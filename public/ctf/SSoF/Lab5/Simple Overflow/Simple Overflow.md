
---
## Description

The goal of this attack is to print the message `YOU WIN!!!` on the screen. How can we do it?

- Recall how variables are stored in the stack; can variable `buffer` interfere with variable `test`?
- You might want to use GDB to see where `buffer` and `test` are stored in memory.
- Don't know how to use GDB? A quick GDB-101 with a list of basic GDB commands can be found in the sidebar.

This file was compiled with no canaries and `-no-pie` and is running at `nc mustard.stt.rnl.tecnico.ulisboa.pt 25151`.

---

I received two files:
- An ELF 32-bit LSB executable.
- The C source code of the executable.

![[IST/SSoF/CTF's/ist1117363/Lab5/Simple Overflow/Images/Files.png]]

![[IST/SSoF/CTF's/ist1117363/Lab5/Simple Overflow/Images/Source code.png]]

The source code has a classic stack buffer overflow vulnerability. The critical section of the code is here:

```c
int test = 0;
char buffer[128];

printf("You win this game if you change variable test to a value different from 0.\n");

test = 0;
gets(buffer); // <- vuln
```

The flaw is that the function `gets(buffer)` is unsafe because it reads input from the user indefinitely until a newline is encountered, without checking if the input fits into the allocated 128-byte buffer.

If I write more than 128 characters into `buffer`, the extra characters will spill over the boundary and overwrite the memory space allocated to `test`.

The goal is to satisfy the condition `if(test != 0)`.

1. **Buffer Size:** The buffer is defined as `char buffer[128]`.
    
2. **Target:** We need to reach the `test` integer, which is 4 bytes long and sits right after the buffer.
    
3. **The Payload:** We need to send **128 bytes** of junk data to fill the buffer completely, followed by at least **1 byte** (or more) to corrupt the `test` variable.
    

I figured that if I sent 128+ 'A's, I would overwrite the `test` variable.

I used this command to get the flag:
```payload
python3 -c "print('A'*129)" | nc mustard.stt.rnl.tecnico.ulisboa.pt 25151
```

![[IST/SSoF/CTF's/ist1117363/Lab5/Simple Overflow/Images/Flag.png]]

## FLAG
```flag
SSof{Buffer_Overflow_to_control_local_variables}
```

---

## Conclusion

This challenge showed a standard stack buffer overflow caused by the unsafe `gets()` function. Due to the lack of bounds checking, input exceeding the 128-byte buffer spilled into the `test` variable. This allowed me to overwrite the `test` control variable, satisfying the win condition and retrieving the flag.

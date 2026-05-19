
---

## Description

You now know everything about the stack and how to change its values, change the functions that are called and so on. But can you call a function _even if NO function is called_ anywhere in our code?

File `return.c` was compiled with no-canaries and `-no-pie`. The goal of this attack is to call function `win` and print the `Congratulations` message on the screen. Can you do it?

- Recall that the name of a function in C is the address where this function is written in the memory.
- Is it true that no function is called in our program? How can you call `win`? Recall how the stack is organised and what values are stored in it.

This challenge is running at `nc mustard.stt.rnl.tecnico.ulisboa.pt 25154`.

---

![[Files.png]]

![[Source.png]]

The source code contains the same `gets(buffer)` vulnerability as previous challenges, but with a key difference: there is no function pointer variable to overwrite.

```c
void challenge() {
  char buffer[10];
  gets(buffer); // <-- vuln
}
```

Instead of overwriting a variable, I must overwrite the **Saved Return Address**.

When `main` calls `challenge`, it pushes a **return address** onto the stack. This address tells the CPU where to go back to after `challenge` finishes.

The stack layout looks roughly like this:

1. **Buffer** (10 bytes) - Low Memory
2. **Padding** (compiler alignment, usually 2-6 bytes)
3. **Saved EBP** (4 bytes)
4. **Return Address** (4 bytes) - High Memory

If we overflow the buffer enough, we will overwrite the saved EBP and then the **Return Address**. When `challenge()` tries to return, it will instead jump to the address we put there (in this case, `win()`).

Finding the address of `win()` using objdump, I was able to craft the final command.
![[win.png]]

I just had to calculate the offset to overwrite the EBP.
I calculated the offset as: **Buffer Size (10) + Compiler Padding (8) + Saved EBP (4) = 22 bytes**.

![[Flag.png]]

## FLAG
```flag
SSof{Overflow_of_saved_r37urn_address}
```

---

## Conclusion

This challenge showed how **ret2win** works. Instead of overwriting a local variable, I overflowed the buffer to corrupt the **saved return address** stored on the stack. By replacing the original return address (which pointed back to `main`) with the address of `win` (`0x080486f1`), it was possible to get the flag via `win()`.


--------------
#### Description

Can you try to get the flag? I'm not revealing anything anymore!! Connect to the program with netcat:

```sh
$ nc rescued-float.picoctf.net 53338
```

The program's source code can be downloaded [here](https://challenge-files.picoctf.net/c_rescued_float/a46e1331e4c897a4bed0f61714f2897d3aeba658ca3cc54e39f213bff453b495/vuln.c). The binary can be downloaded [here](https://challenge-files.picoctf.net/c_rescued_float/a46e1331e4c897a4bed0f61714f2897d3aeba658ca3cc54e39f213bff453b495/vuln)

This are the files provided.
Once again we have a ELF executable and the source code.
![[Pasted image 20251107175820.png]]
Source code of the vuln.c
![[Pasted image 20251107175942.png]]
 As we can see in the main, 
 1. They prepare a signal for segmentation fault, which is not interesting since its just a printf function.
2. Set the buffer for stdout unbuffered, not important
3. And then it call the function call_functions

The function calls `printf(buffer)` where `buffer` is user-controlled. Because `printf` treats its first argument as a _format string_, any `%` sequences we provide are interpreted. This is a classic **format-string vulnerability**: with `%p` we can **leak stack/code pointers** (info leak), and with `%n` in other contexts we could **write** to memory. In this challenge we only need a leak to defeat **PIE/ASLR**: use `%N$p` to leak an address inside the main module, compute the PIE base as `base = leak − offset`, then jump to `win` at `base + win_offset` when prompted.

For this, we first need to know the functions offsets. Since this is an ELF PIE executable, the base address is randomized at runtime.


![[Pasted image 20251107211343.png]]
![[Pasted image 20251107211351.png]]
![[Pasted image 20251107211357.png]]
We can see the offsets for each function are:
>call_function -> 12c7
>main -> 1400
>win -> 136a
>_start -> 11c0

Now that we know some **offsets** we can just leaked addresses until we find one that ends in that.

With the address + offset, we can calculate the **base address**, and from there calculate the **win address**. 
With the win address is already game over.
I made this script to be easier to get the flag.

![[Pasted image 20251107210342.png]]
![[Pasted image 20251107210509.png]]
And like that we get the flag

==FLAG==
```
picoCTF{p13_5h0u1dn'7_134k_c9a04879}
```
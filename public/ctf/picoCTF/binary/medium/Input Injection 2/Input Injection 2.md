
-----------

#### Description

This program greets you and then runs a command. But can you take control of what command it executes? Connect to the program with netcat: `nc saffron-estate.picoctf.net 56268`. You can download the program file [here](https://challenge-files.picoctf.net/c_saffron_estate/ae2d22b69a50bbe5ba1bfba8785fd57faede0fc0837e40f149e8961e803f0bf5/vuln). And the source [code here](https://challenge-files.picoctf.net/c_saffron_estate/ae2d22b69a50bbe5ba1bfba8785fd57faede0fc0837e40f149e8961e803f0bf5/vuln.c).

They give us two files.
![[Pasted image 20251103205603.png]]
One is the source code of the executable, and the other is the executable itself.

Looking at the code, we see that they use malloc to dynamically allocate memory for a variable in the heap (28 bytes).
![[Pasted image 20251103214748.png]]
This is very dangerous, because since they didn't free the allocated memory or check the size of user_input, we can exploit it.

Since they give you the address of both variables, we can calculate the offset to override the `shell` variable, which is going to be executed via the `system()` function.

So I made this script to automate everything.

![[Pasted image 20251103214706.png]]
![[Pasted image 20251103214611.png]]

## FLAG
```
picoCTF{us3rn4m3_2_sh3ll_e7257819}
```

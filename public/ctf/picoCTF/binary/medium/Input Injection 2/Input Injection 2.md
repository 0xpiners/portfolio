
-----------

#### Description

This program greets you and then runs a command. But can you take control of what command it executes? Connect to the program with netcat: `nc saffron-estate.picoctf.net 56268`. You can Download the program file [here](https://challenge-files.picoctf.net/c_saffron_estate/ae2d22b69a50bbe5ba1bfba8785fd57faede0fc0837e40f149e8961e803f0bf5/vuln). And source [code](https://challenge-files.picoctf.net/c_saffron_estate/ae2d22b69a50bbe5ba1bfba8785fd57faede0fc0837e40f149e8961e803f0bf5/vuln.c)

They give us two files
![[Pasted image 20251103205603.png]]
One of them is the source code of the executable
The other is the executable itself

Looking at the code we see that they use malloc to dynamically allocate memory for that var in the heap (28 bytes)
![[Pasted image 20251103214748.png]]
This is very dangerous, because since they didnt free the alllocated memory , neither checked the size of user_input.

Since they give you the address of both variables, we can calculate the offset to override the var shell which is going to get executed via system() func.

That way I made this script to automate everything.

![[Pasted image 20251103214706.png]]
![[Pasted image 20251103214611.png]]

==FLAG==
```
picoCTF{us3rn4m3_2_sh3ll_e7257819}
```
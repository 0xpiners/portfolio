
--------------

#### Description

A friendly program wants to greet you… but its goodbye might say more than it should. Can you convince it to reveal the flag? Connect to the challenge instance: `nc saffron-estate.picoctf.net 52785`. You can download the program file [here](https://challenge-files.picoctf.net/c_saffron_estate/fff72eac36616734dbeec6bf504139d22d14453c3f8922b5df08fea08780dd3f/vuln). And the source [code here](https://challenge-files.picoctf.net/c_saffron_estate/fff72eac36616734dbeec6bf504139d22d14453c3f8922b5df08fea08780dd3f/vuln.c).

They give us these files.
![[Pasted image 20251103195050.png]]
We got a:
1. ELF executable
2. Source code of that executable

![[Pasted image 20251103200934.png]]
What the code does is:
1. First prints "What is your name?" and flushes stdout.
2. Then uses `fgets` to get input from the user — a buffer of 200 bytes — which will be important.
3. Then removes the `\n` when you enter your input, normal stuff.
4. And then calls the function `fun` with the arguments `name` and `"uname"`.
5. Then it copies your name to a buffer of 10 bytes, which is odd because they previously allowed you to input up to 200 bytes.
6. It copies the `cmd` command to the `c` buffer (10 bytes).
7. Then it prints the buffer of 10 bytes and then executes the `cmd` command stored in the `c` variable.

This lets us do a buffer overflow, because there's no input validation after `fun` is called.
Since we can input up to 200 bytes, we can just write "abcdefghij ls" and overflow into `c`, getting remote code execution.

I tested this by connecting to the service.
![[Pasted image 20251103202002.png]]
And yep, that easily, we now know the location of flag.txt.
Let's make a script to automate the whole process.
![[Pasted image 20251103202439.png]]
![[Pasted image 20251103202430.png]]
Just like that, we got the flag.

## FLAG

```
picoCTF{0v3rfl0w_c0mm4nd_d3eb7161}
```

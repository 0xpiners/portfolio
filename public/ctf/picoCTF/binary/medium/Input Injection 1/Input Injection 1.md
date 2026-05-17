
--------------

#### Description

A friendly program wants to greet you… but its goodbye might say more than it should. Can you convince it to reveal the flag? connect to the challenge instance `nc saffron-estate.picoctf.net 52785`. You can Download the program file [here](https://challenge-files.picoctf.net/c_saffron_estate/fff72eac36616734dbeec6bf504139d22d14453c3f8922b5df08fea08780dd3f/vuln). And source [code](https://challenge-files.picoctf.net/c_saffron_estate/fff72eac36616734dbeec6bf504139d22d14453c3f8922b5df08fea08780dd3f/vuln.c)

They give us these files
![[Pasted image 20251103195050.png]]
We got a:
1. ELF executable
2. Source code of that executable

![[Pasted image 20251103200934.png]]
What the code does is.
1. First prints "What is your name" and flushes stdout
2. Then, uses fgets to get input from the user, in this case a buffer of 200 bytes, this will be important.
3. Then removes the \n when you enter your input, normal stuff.
4. And then calls the func fun with the arguments name and "uname"
5. Then it copies your name to a buffer of 10 bytes, which is weird because they previously lets you input a buffer of 200 bytes.
6. It copies the cmd command to the c buffer (10 bytes)
7. Then prints buffer of 10 bytes and then executes the cmd command stored in c var.

This lets us do a buffer overflow, because theres no input validation after fun being called.
Since we can input to 200 bytes, we can just write "abcdefghij ls" and get a buffer overflow to overwrite c. This way we get remote code execution.

I tested this connecting to the service
![[Pasted image 20251103202002.png]]
And yup, easy as that, we get know the location of the flag.txt
Lets do a script to automate the whole process
![[Pasted image 20251103202439.png]]
![[Pasted image 20251103202430.png]]
Easy as that, we got the flag

==FLAG==

```
picoCTF{0v3rfl0w_c0mm4nd_d3eb7161}
```
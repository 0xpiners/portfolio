
-------------
#### Description

Someone's commits seems to be preventing the program from working. Who is it? You can download the challenge files here:

- [challenge.zip](https://artifacts.picoctf.net/c_titan/159/challenge.zip)
![[Pasted image 20251111145950.png]]

This is another .git challenge, where we can see the message.py doesnt work because theres a ) missing.

In this challenge we only have the master.
![[Pasted image 20251111150253.png]]

And a lot of commits
![[Pasted image 20251111150303.png]]

Because there are a lot of random commits made, we can just see who alter the file.
Since the name of the ctf is blame game, we will use git blame to see who changed it.
![[Pasted image 20251111160703.png]]
Nice we got the flag.

==FLAG==
```
picoCTF{@sk_th3_1nt3rn_81e716ff}
```
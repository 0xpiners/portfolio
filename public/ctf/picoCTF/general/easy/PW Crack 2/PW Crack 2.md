
------------

#### Description

Can you crack the password to get the flag? Download the password checker [here](https://artifacts.picoctf.net/c/15/level2.py) and you'll need the encrypted [flag](https://artifacts.picoctf.net/c/15/level2.flag.txt.enc) in the same directory too.

![[Pasted image 20251111185622.png]]
![[Pasted image 20251111185658.png]]

We can see on the level_2_pw_check() function, that it checks user input with the combination of the following hex values:
1. 0x33
2. 0x39
3. 0x63
4. 0x65

All together forms the word
![[Pasted image 20251111185835.png]]PASSWORD -> 39ce
![[Pasted image 20251111185910.png]]

==FLAG==
```
picoCTF{tr45h_51ng1ng_502ec42e}
```
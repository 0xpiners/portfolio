
------------
#### Description

I accidentally wrote the flag down. Good thing I deleted it! You download the challenge files here:

- [challenge.zip](https://artifacts.picoctf.net/c_titan/137/challenge.zip)

![[Pasted image 20251111115720.png]]
![[Pasted image 20251111120050.png]]

Lets see the git logs
![[Pasted image 20251111121017.png]]
Ok, so basically he created the flag and then removed it, lets get the commit where he removed the flag, with git show
![[Pasted image 20251111121115.png]]Nice, we got the flag.

==FLAG==
```
picoCTF{s@n1t1z3_cf09a485}
```
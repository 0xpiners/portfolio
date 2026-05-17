
------------
#### Description

I accidentally wrote the flag down. Good thing I deleted it! You can download the challenge files here:

- [challenge.zip](https://artifacts.picoctf.net/c_titan/137/challenge.zip)

![[Pasted image 20251111115720.png]]
![[Pasted image 20251111120050.png]]

Let's see the git logs.
![[Pasted image 20251111121017.png]]
Ok, so basically they created the flag and then removed it. Let's get the commit where the flag was removed, using `git show`.
![[Pasted image 20251111121115.png]]Nice, we got the flag.

## FLAG
```
picoCTF{s@n1t1z3_cf09a485}
```

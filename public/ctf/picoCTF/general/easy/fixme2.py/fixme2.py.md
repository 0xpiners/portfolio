
-------------------

#### Description

Fix the syntax error in the Python script to print the flag. [Download Python script](https://artifacts.picoctf.net/c/6/fixme2.py)

![[Pasted image 20251111213037.png]]
They give us a Python file that I assume is broken.

![[Pasted image 20251111213132.png]]Yep, and it's already giving us the fix: in conditional statements, if we are comparing two things we use `==` instead of `=`. Let's fix it.

![[Pasted image 20251111213220.png]]Ok, now it's fixed. Let's run it.
![[Pasted image 20251111213234.png]]Easy flag.

## FLAG
```
picoCTF{3qu4l1ty_n0t_4551gnm3nt_f6a5aefc}
```

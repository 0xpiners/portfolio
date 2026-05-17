
------------

#### Description

Fix the syntax error in this Python script to print the flag. [Download Python script](https://artifacts.picoctf.net/c/25/fixme1.py)

![[Pasted image 20251111213322.png]]
I assume the script is broken because of the name of the challenge.
![[Pasted image 20251111213345.png]]
![[Pasted image 20251111213414.png]]
We can see that line 20 has a little gap compared to the previous line. Since Python is a programming language that uses indentation to define code blocks, let's remove that gap.
![[Pasted image 20251111213557.png]]
![[Pasted image 20251111213604.png]]

## FLAG
```
picoCTF{1nd3nt1ty_cr1515_6a476c8f}
```

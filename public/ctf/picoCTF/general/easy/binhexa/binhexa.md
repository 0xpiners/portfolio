
----------------

#### Description

How well can you perform basic binary operations? Start searching for the flag here: `nc titan.picoctf.net 52141`

![[Pasted image 20251111163436.png]]
This is what we get when we connect to the service.

So our first question is to do a bitwise OR between both binary numbers. Let's do it in Python.
![[Pasted image 20251111163539.png]]![[Pasted image 20251111163546.png]]

First question done. Now we have to left-shift binary number 1 by 1 bit. Let's also do it with Python.
![[Pasted image 20251111163636.png]]

Third question:
![[Pasted image 20251111163640.png]]
![[Pasted image 20251111163736.png]]
Fourth question:
![[Pasted image 20251111163743.png]]
![[Pasted image 20251111163819.png]]
Fifth question:
![[Pasted image 20251111163824.png]]
![[Pasted image 20251111163845.png]]
Sixth question:
![[Pasted image 20251111163849.png]]
![[Pasted image 20251111163904.png]]

After the last question we get the final question.
![[Pasted image 20251111163936.png]]
Which is to enter the last operation result in hexadecimal.
![[Pasted image 20251111164010.png]]

![[Pasted image 20251111164015.png]]
Just like that, we get the flag.

## FLAG
```
picoCTF{b1tw^3se_0p3eR@tI0n_su33essFuL_675602ae}
```

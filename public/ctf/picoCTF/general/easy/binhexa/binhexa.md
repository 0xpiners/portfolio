
----------------

#### Description

How well can you perfom basic binary operations? Start searching for the flag here `nc titan.picoctf.net 52141`

![[Pasted image 20251111163436.png]]
This is what we get when we connect to the service.

So our first question is to do a bitwise OR between both binary nums, lets do it in python.
![[Pasted image 20251111163539.png]]![[Pasted image 20251111163546.png]]

First question done, now we have to left shift bin 1 by 1 bit, lets also do it with python.
![[Pasted image 20251111163636.png]]

Third question
![[Pasted image 20251111163640.png]]
![[Pasted image 20251111163736.png]]
 Fourth question
 ![[Pasted image 20251111163743.png]]
 ![[Pasted image 20251111163819.png]]
Fifth question
![[Pasted image 20251111163824.png]]
![[Pasted image 20251111163845.png]]
Sixth question
![[Pasted image 20251111163849.png]]
![[Pasted image 20251111163904.png]]

After the last question we get the final final question
![[Pasted image 20251111163936.png]]
Which is to enter the last operation in hexadecimal
![[Pasted image 20251111164010.png]]

![[Pasted image 20251111164015.png]]
Like that, we get the flag.

==FLAG==
```
picoCTF{b1tw^3se_0p3eR@tI0n_su33essFuL_675602ae}
```
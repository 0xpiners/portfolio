
---------------

#### Description

Can you make sense of this file? Download the file [here](https://artifacts.picoctf.net/c/475/enc_flag).

![[Pasted image 20251111164153.png]]

Using cat on the file, we can see its encoded in base64, lets decode it.
![[Pasted image 20251111164250.png]]
Ok, its double encoded in base64, only god knows how many times this is encoded(i mean it must not be that many but still), lets do a python script that decodes it  until it gets the flag.
![[Pasted image 20251111165207.png]]
![[Pasted image 20251111165238.png]]
After 6 iteractions we got the flag.

==FLAG==
```
picoCTF{base64_n3st3d_dic0d!n8_d0wnl04d3d_492767d2}
```
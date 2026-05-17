
-----------


They give you a file
```bash
c50790f066676d65fdc2d2cfa0256fe4ba3845d91c5424be26d2597fd88b73fe  confidential.pdf
```
![[Pasted image 20251020201027.png]]

Executing exiftool to see the pdf's metadata, we see a strange field: *author*

![[Pasted image 20251020201120.png]]
We can also notice that is is encoded in base64, so I used this command to decoded it
![[Pasted image 20251020201159.png]]
And we easily get the flag

==FLAG==
```
picoCTF{puzzl3d_m3tadata_f0und!_ee454950}
```
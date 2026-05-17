

-------------

Description:
```
This file seems broken... or is it? Maybe a couple of bytes could make all the difference. Can you figure out how to bring it back to life? Download the file [here](https://challenge-files.picoctf.net/c_amiable_citadel/d5cf66acaae23a2634256d69988d9a77ff0dade995dc28432dc35e788699ea69/file).
```

The only file they give us is:
![[Pasted image 20251023155819.png]]

First thing I do is see what type of file is this using the command `file {file}`
![[Pasted image 20251023155903.png]]
Its only data. What is weird is when I used cat on the file it showed this:
![[Pasted image 20251023160005.png]]We can see a lot of characters, but in the middle we see random data.
Also in the begging of the file we see that it is a jfif file.
![[Pasted image 20251023160051.png]]

I used to tool hexedit to see the file signature of the file, since we knew it was a JFIF, and of course the first bytes were wrong.

![[Pasted image 20251023160540.png]] The correct bytes of a JFIF file is:
```
`FF D8 FF E0 00 10 4A 46   49 46 00 01`
```

Changing the first bytes to that and saving the file as .jpeg
We get this image
![[Pasted image 20251023160819.png]]
==FLAG==
```
picoCTF{r3st0r1ng_th3_by73s_1512b52a}
```


-----------
#### Description

Unzip this archive and find the flag.

- [Download zip file](https://artifacts.picoctf.net/c/503/big-zip-files.zip)


When we unzip the file, we get a lot of files, like a lot.
![[Pasted image 20251111182020.png]]

We can assume the flag is somewhere in those files, so we can use the find command to cat everything and find the flag, like this
```
find . -type f -exec cat {} \; | grep "picoCTF"
```

![[Pasted image 20251111182731.png]]And like that we get the flag.

==FLAG==
```
picoCTF{gr3p_15_m4g1c_ef8790dc}
```

-----------
#### Description

What was I last working on? I remember writing a note to help me remember... You can download the challenge files here:

- [challenge.zip](https://artifacts.picoctf.net/c_titan/66/challenge.zip)

They gives a zip file, lets unzip it
![[Pasted image 20251105203650.png]]

It looks its a repository from github
![[Pasted image 20251105203718.png]]

When I cd into the directory we only have one file, catting it we get this. 
Lets check the .git objects
![[Pasted image 20251105203752.png]]
Trying to see past commits, using git log
![[Pasted image 20251105204132.png]]
We can also see what was commited to main
![[Pasted image 20251105204149.png]]

==FLAG==
```
picoCTF{t1m3m@ch1n3_d3161c0f}
```

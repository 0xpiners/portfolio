
-----------
#### Description

What was I last working on? I remember writing a note to help me remember... You can download the challenge files here:

- [challenge.zip](https://artifacts.picoctf.net/c_titan/66/challenge.zip)

They give us a zip file. Let's unzip it.
![[Pasted image 20251105203650.png]]

It looks like a GitHub repository.
![[Pasted image 20251105203718.png]]

When I cd into the directory we only have one file. Catting it, we get this.
Let's check the .git objects.
![[Pasted image 20251105203752.png]]
Trying to see past commits using `git log`.
![[Pasted image 20251105204132.png]]
We can also see what was committed to main.
![[Pasted image 20251105204149.png]]

## FLAG
```
picoCTF{t1m3m@ch1n3_d3161c0f}
```

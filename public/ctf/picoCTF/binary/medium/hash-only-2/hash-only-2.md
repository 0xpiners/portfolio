
---------------

#### Description

Here is a binary that has enough privilege to read the content of the flag file but will only let you know its hash. If only it could just give you the actual content! Connect using `ssh ctf-player@rescued-float.picoctf.net -p 64667` with the password, `3f39b042` and run the binary named "flaghasher".

![[Pasted image 20251108124553.png]]
I copied the binary to my home machine for better investigation of the file.

When i ran the code it compute the md5 hash of the file /root/flag.txt (which I created)

I ran strings on the elf to see if I could find anything usefull
![[Pasted image 20251108130927.png]]
We can see in the bottom of the print, that they use md5sum to compute the hash.

Lets just check if for some reason the md5sum has more permissions that it should have.
![[Pasted image 20251108134652.png]]
Nope we cant do nothing.

Lets check the PATH variable
![[Pasted image 20251108134719.png]]
Lets check if we have any writtable directory
![[Pasted image 20251108134747.png]]
Nice, we can write in the bin directory, but then I thought of just seeing if I can write in the PATH variable
![[Pasted image 20251108135524.png]]

Nope I cant, lets just escape this rbash, this doesnt let me do shit.
Now that we can redirects output, use commands more freely we dont even need the writable bin, we can just add $HOME to the PATH env var and execute the flaghasher, which will use our modificated md5sum binary.

![[Pasted image 20251108134051.png]]

==FLAG==
```
picoCTF{Co-@utH0r_Of_Sy5tem_b!n@riEs_4b31549c}
```
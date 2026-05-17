
---------------

#### Description

Here is a binary that has enough privilege to read the content of the flag file but will only let you know its hash. If only it could just give you the actual content! Connect using `ssh ctf-player@rescued-float.picoctf.net -p 64667` with the password, `3f39b042` and run the binary named "flaghasher".

![[Pasted image 20251108124553.png]]
I copied the binary to my home machine for better investigation.

When I ran the code, it computed the MD5 hash of the file /root/flag.txt (which I created).

I ran `strings` on the ELF to see if I could find anything useful.
![[Pasted image 20251108130927.png]]
We can see at the bottom of the output that they use `md5sum` to compute the hash.

Let's just check if, for some reason, md5sum has more permissions than it should have.
![[Pasted image 20251108134652.png]]
Nope, we can't do anything there.

Let's check the PATH variable.
![[Pasted image 20251108134719.png]]
Let's check if we have any writable directory.
![[Pasted image 20251108134747.png]]
Nice, we can write to the bin directory. But then I thought of just seeing if I can write to the PATH variable.
![[Pasted image 20251108135524.png]]

Nope, I can't. Let's just escape this rbash, which doesn't let me do much.
Now that we can redirect output and use commands more freely, we don't even need the writable bin. We can just add `$HOME` to the PATH env var and execute the flaghasher, which will use our modified md5sum binary.

![[Pasted image 20251108134051.png]]

## FLAG
```
picoCTF{Co-@utH0r_Of_Sy5tem_b!n@riEs_4b31549c}
```

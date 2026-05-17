
--------------

#### Description

Here is a binary that has enough privilege to read the content of the flag file but will only let you know its hash. If only it could just give you the actual content! Connect using `ssh ctf-player@shape-facility.picoctf.net -p 60091` with the password, `4f5344cd` and run the binary named "flaghasher". You can get a copy of the binary if you wish: `scp -P 60091 ctf-player@shape-facility.picoctf.net:~/flaghasher .`

I copied the file to my home directory.
![[Pasted image 20251115011424.png]]
Lets analyze before ssh into the machine.
![[Pasted image 20251115011518.png]]
It basically computes the MD5 hash of the /root/flag.txt, since I dont have any flag.txt on my machine it gives an error.


![[Pasted image 20251115011449.png]]
After that, I used strings first to find any useful string and I found the command it uses to compute the md5 hash.

It uses **md5sum**

Lets ssh into the machine to find anything useful.
![[Pasted image 20251115011701.png]]
Found the location of the file.

I checked the permissions of the binary and for some reason its writable.
![[Pasted image 20251115011819.png]]

Since is writable we can just:
> echo "cat /root/flag.txt" > /usr/bin/md5sum

And then run the flaghasher.
![[Pasted image 20251115012525.png]]

==FLAG==
```bash
picoCTF{sy5teM_b!n@riEs_4r3_5c@red_0f_yoU_07e85021}
```
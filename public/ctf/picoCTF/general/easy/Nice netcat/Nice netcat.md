
-----------

#### Description

There is a nice program that you can talk to by using this command in a shell: `$ nc mercury.picoctf.net 21135`, but it doesn't speak English...

When we connect to the service, it gives us a bunch of numbers that look like ascii, lets grab all and decode using cyberchef
![[Pasted image 20251112224244.png]]![[Pasted image 20251112224412.png]]

==FLAG==
```
picoCTF{g00d_k1tty!_n1c3_k1tty!_afd5fda4}
```
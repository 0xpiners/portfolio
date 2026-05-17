
-------------

#### Description

Do you know how to move between directories and read files in the shell? Start the container, `ssh` to it, and then `ls` once connected to begin. Login via `ssh` as `ctf-player` with the password, `8c606eb1` on the host `wily-courier.picoctf.net` and port `57622`.

Lets login using ssh with the credentials provided.
![[Pasted image 20251111221138.png]]

We already got the first part of the flag, lets find the rest using the instructions.
![[Pasted image 20251111221203.png]]
![[Pasted image 20251111221230.png]]
![[Pasted image 20251111221243.png]]
Nice we got the second part, lets find the third one in /home
![[Pasted image 20251111221346.png]]
Nice we found all parts.

==FLAG==
```
picoCTF{xxsh_0ut_0f_//4t3r_0b24fc4f}
```
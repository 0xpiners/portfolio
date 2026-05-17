
-------------


#### Description
```
The factory is hiding things from all of its users. Can you login as Joe and find what they've been looking at? `https://jupiter.challenges.picoctf.org/problem/13594/` ([link](https://jupiter.challenges.picoctf.org/problem/13594/)) or http://jupiter.challenges.picoctf.org:13594
```

They give us a username -> *Joe*

We get this login page when we visit the website
![[Pasted image 20251026170846.png]]

I tried log in with the user *Joe* and a *random password* and it appeared this
![[Pasted image 20251027230445.png]]

I tried log in with *another user* and for my surprise, it *didnt check* anything.
![[Pasted image 20251027230523.png]]I logged in with the *user = a* and the *password = a*

I checked *the cookies* to see if I would find anything useful and for my surprise I found this
![[Pasted image 20251027230627.png]]
We have *3 important cookies*:
- admin -> False
- usernamd -> a
- password -> a

I thought of changing the username to *Joe* and admin to True and I got the flag
![[Pasted image 20251027230755.png]]
==FLAG==
```
picoCTF{th3_c0nsp1r4cy_l1v3s_d1c24fef}
```
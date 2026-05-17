
-----

#### Description
```
Find the flag being held on this server to get ahead of the competition [http://mercury.picoctf.net:21939/](http://mercury.picoctf.net:21939/)
```

![[Pasted image 20251026161732.png]]

The description of this challenge is aHEAD, giving us an hint about the HEAD method of http.

Also I didnt find anything useful in the cookies and source code.

After that I decided see the requests being made using mitmproxy.

![[Pasted image 20251026162345.png]]

I noticed that whenver we Choose Red, we made a *POST* request, and whenever we choose Blue we made a *GET* request.

Because of the name of the challenge (*aHEAD*) , I tried to change the request method do HEAD and we got the flag
![[Pasted image 20251026162514.png]]
==FLAG==
```
picoCTF{r3j3ct_th3_du4l1ty_6ef27873}
```
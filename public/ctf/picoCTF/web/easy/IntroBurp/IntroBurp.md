
---------------


#### Description
```
Try [here](http://titan.picoctf.net:61347/) to find the flag
```

When I visit the site for the first time, we see this
![[Pasted image 20251028123605.png]]
Putting random stuff on the fields, we are asked for a 2fa code
![[Pasted image 20251028123643.png]]
Since the name of the challenge is *IntroToBurp*, I tried using a proxy to see the *requests being made*

When we *POST* the fields, we have this
- A *csrf_token* -> to protect from *CSRF attacks*
- Cookie with that *csrf_token*
- And all the *fields*
![[Pasted image 20251028123733.png]]

*Nothing that important* . So i tried to input a *random 2fa code* and see the *request*

![[Pasted image 20251028123925.png]]

Once again, we have *the otp code*. What if we try *to change the body of the request*, maybe the *server doesnt know how to respond* to those requests.

I tried that and we got the flag

![[Pasted image 20251028124236.png]]
![[Pasted image 20251028124242.png]]
==FLAG==
```
picoCTF{#0TP_Bypvss_SuCc3$S_e1eb16ed}
```
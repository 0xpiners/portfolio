
---------------


#### Description
```
Try [here](http://titan.picoctf.net:61347/) to find the flag
```

When I visit the site for the first time, we see this:
![[Pasted image 20251028123605.png]]
Putting random stuff in the fields, we are asked for a 2FA code.
![[Pasted image 20251028123643.png]]
Since the name of the challenge is *IntroBurp*, I tried using a proxy to see the *requests being made*.

When we *POST* the fields, we have:
- A *csrf_token* — to protect from *CSRF attacks*
- A cookie with that *csrf_token*
- And all the *fields*
![[Pasted image 20251028123733.png]]

*Nothing that important.* So I tried to input a *random 2FA code* and see the *request*.

![[Pasted image 20251028123925.png]]

Once again, we have *the OTP code*. What if we try *to change the body of the request*? Maybe the *server doesn't know how to respond* to those requests.

I tried that and we got the flag.

![[Pasted image 20251028124236.png]]
![[Pasted image 20251028124242.png]]
## FLAG
```
picoCTF{#0TP_Bypvss_SuCc3$S_e1eb16ed}
```
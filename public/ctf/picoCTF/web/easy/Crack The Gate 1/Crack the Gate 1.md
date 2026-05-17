
--------------

Description:
```
We're in the middle of an investigation. One of our persons of interest, ctf player, is believed to be hiding sensitive data inside a restricted web portal. We've uncovered the email address he uses to log in: `ctf-player@picoctf.org`. Unfortunately, we don't know the password, and the usual guessing techniques haven't worked. But something feels off... it's almost like the developer left a secret way in. Can you figure it out? The website is running [here](http://amiable-citadel.picoctf.net:55545/). Can you try to log in?
```

They give us an email for a future login:
- `ctf-player@picoctf.org`


After visiting the site we see this:
![[Pasted image 20251023154314.png]]

Just a simple login page. The first thing I tried was SQL injection, but with no success.
I tried these payloads:
```
" OR 1 = 1 -- -
' OR 1 = 1; 
' GROUP BY columnames having 1=1 --
```

Since the description doesn't mention anything about SQLi, I figured our way in must be something else.

Upon seeing the source code of the website, we see an interesting comment:
![[Pasted image 20251023154907.png]]Comment:
```
ABGR: Wnpx - grzcbenel olcnff: hfr urnqre "K-Qri-Npprff: lrf"
```

My first thought was that it was some kind of ROT13-encoded string, because we see capital letters at the beginning of certain words.

Using CyberChef to decode, we got this:
![[Pasted image 20251023155048.png]]

```
NOTE: Jack - temporary bypass: use header "X-Dev-Access: yes"
```

This is huge. We found a temporary bypass — we just have to use the header `X-Dev-Access: yes` to bypass the login page.

I used the mitmproxy command to simulate this request (we could also use Burp Suite).
![[Pasted image 20251023155612.png]]
![[Pasted image 20251023155620.png]]Easy enough, we get the flag.

## FLAG
```
picoCTF{brut4_f0rc4_83812a02}
```
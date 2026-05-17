
---

#### Description

Help us test the form by submitting the username as `test` and password as `test!`. The website is running [here](http://saturn.picoctf.net:55989/).

---
After visiting the website I got this.
![[Pasted image 20260307004704.png]]
Since the description says to test the app with the user "test" and password "test!", I did exactly that.
![[Pasted image 20260307004812.png]]
I got redirected here.
I tried to "search for flags" but with no success.
The JS for this search submit field actually doesn't do anything.
![[Pasted image 20260307004846.png]]

I decided to look at the requests being made and noticed I was being redirected twice (I used Burp Suite for this).
![[Pasted image 20260307004928.png]]
(`/next-page/id=cGljb0NURntwcm94aWVzX2Fs`)

Decoding this from base64, we get `picoCTF{proxies_al` — the first part of the flag.
When doing the same with that page (using Burp Suite) I get another redirect.
![[Pasted image 20260307005153.png]]
This time to `bF90aGVfd2F5XzNkOWUzNjk3fQ==`, which was the second part of the flag.

## FLAG
```flag
picoCTF{proxies_all_the_way_3d9e3697}
```

---
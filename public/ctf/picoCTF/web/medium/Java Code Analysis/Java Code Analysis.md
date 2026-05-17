
---

#### Description

BookShelf Pico, my premium online book-reading service. I believe that my website is super secure. I challenge you to prove me wrong by reading the 'Flag' book! Here are the credentials to get you started:

- Username: "user"
- Password: "user"

Source code can be downloaded [here](https://artifacts.picoctf.net/c/480/bookshelf-pico.zip). Website can be accessed [here!](http://saturn.picoctf.net:53096/).

---
This is the website I encountered when first visiting the site.
A simple login page.
![[Pasted image 20260307001957.png]]

Fortunately we also have the source code for this application.

![[Pasted image 20260307002044.png]]

After some time understand the app, I found some important config files (thanks to the README.md which was very well explained)

I found hardcoded creds for the user "user". Unfortunately the admin creds were redacted. 
![[Pasted image 20260307002300.png]]

After logging in, I immediately saw a book named Flag which had the flag all blurry. We obvious need admin to see it.
![[Pasted image 20260307002404.png]]

I saw that the user session was being handled by JWT.
![[Pasted image 20260307002504.png]]

I decoded the JWT and got this.
![[Pasted image 20260307002526.png]]
We could try to forge the admin JWT, but for that we needed the JWT secret. Maybe it is also hardcoded?
After a while I found the file SecretGenerator.java which was the file generating the JWT secret.
![[Pasted image 20260307002624.png]]
The JWT secret was also hardcoded, which was 1234.
With that we could forge a valid admin JWT.

![[Pasted image 20260307002738.png]]
This was the JWT I used.
```jwt
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQWRtaW4iLCJpc3MiOiJib29rc2hlbGYiLCJleHAiOjE3NzM0NDc4MzQsImlhdCI6MTc3Mjg0MzAzNCwidXNlcklkIjoyLCJlbWFpbCI6ImFkbWluIn0.10USUsj9XyTrFZxWNCbQDx8LxDw-owEUHITSGhpefyc
```

After refreshing my webpage with that JWT I got admin session (I also had to change the token-payload cookie with the json being used).

![[Pasted image 20260307002843.png]]

==FLAG==
```flag
picoCTF{w34k_jwt_n0t_g00d_7745dc02}
```

---
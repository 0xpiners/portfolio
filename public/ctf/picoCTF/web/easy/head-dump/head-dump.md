
---

#### Description

Welcome to the challenge! In this challenge, you will explore a web application and find an endpoint that exposes a file containing a hidden flag. The application is a simple blog website where you can read articles about various topics, including an article about API documentation. Your goal is to explore the application and find the endpoint that generates files holding the server's memory, where a secret flag is hidden. The website is running [picoCTF News](http://verbal-sleep.picoctf.net:54945/).

---
Website
![[Pasted image 20260226231004.png]]

I tried clicking every button I could until I noticed that the *API Documentation* link led me to their API documentation page.

![[Pasted image 20260226232938.png]]
There I saw I could use their *headdump* endpoint to retrieve memory allocation info.

I wrote a script to automate the search.

![[Pasted image 20260226233020.png]]

## FLAG
```flag
picoCTF{Pat!3nt_15_Th3_K3y_59106086}
```

---

---------------
#### Description

The login system has been upgraded with a basic rate-limiting mechanism that locks out repeated failed attempts from the same source. We’ve received a tip that the system might still trust user-controlled headers. Your objective is to bypass the rate-limiting restriction and log in using the known email address: **ctf-player@picoctf.org** and uncover the hidden secret. The website is running [here](http://amiable-citadel.picoctf.net:54835/). Can you try to log in?. Download the passwords list [here](https://challenge-files.picoctf.net/c_amiable_citadel/19e50f2e8840b167ec16c4f74a40e38f42ac3c24765e257c300fba4562b4efae/passwords.txt).

They give us the email address -> *ctf-player@picoctf.org* , also we have a list of password
![[Pasted image 20251028153843.png]]
We can try to *bruteforce the password* but the description tells us theres a *rate-limiting restriction* but we can still try using *user normal headers*

For that I did this script:
![[Pasted image 20251028222204.png]]

What this script does is, *use the header X-Forwared-For* to simulate a request from *different IP's*. This technique is used to *bypass rate-limiting* techniques.

Running the code and we get the flag.
![[Pasted image 20251028223035.png]]

==FLAG==
```
picoCTF{xff_byp4ss_brut3_473b3fdd}
```
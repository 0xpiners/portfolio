
---------

### Given IP -> **10.82.158.164**

## Description

> boot2root machine for FIT and bsides guatemala CTF.

-------

First thing I did was adding the **IP mapping** of the challenge to `/etc/hosts
![[Pasted image 20251123132758.png]]

Let's take a look into the website.
![[Pasted image 20251123132824.png]]

Looks like a blog. The about, archives and contact sections don't do nothing at all.

The whole website has a lot of Lorem ipsum, and also has a **post comment section (might be interesting)**.
![[Pasted image 20251123133005.png]]

There is also something interesting. We have a user named **meliodas**.
![[Pasted image 20251123135650.png]]

Let's continue to enumerate the machine, with **nmap and gobuster**.

---------
## Nmap

I first did a fast scan to see all ports available, and only after that, I did a more detailed scan on those ports.
![[Pasted image 20251123133806.png]]

I miss typed one of the ports so I had to scan it again.
![[Pasted image 20251123134114.png]]
So we only have port 22(ssh) and port 80(http).

I tried to see if there was any known vulnerable to any of the services, but with no success.

---

## Gobuster

After a while, I was not finding any other endpoints except of
1. images
2. robots.txt
![[Pasted image 20251123135500.png]]

Lets visit robots.txt.
![[Pasted image 20251123135550.png]]

So basically a disallow rule to the base endpoint (/) with anyone with the User-Agent: rockyou

This might be an hint to bruteforce something. Then I remember we have a user named meliodas and ssh.

Lets brute force it using hydra.
![[Pasted image 20251123135755.png]]

Nice, and like that we have the password for the user meliodas.

> meliodas:iloveyou1

-----------

## SSH

Using SSH to login into the machine, the first thing I did was running **sudo -l**, since **we knew the passsword**.
![[Pasted image 20251123135857.png]]

Before doing anything, I looked into meliodas home directory, and I found the user.txt flag.
![[Pasted image 20251123140034.png]]

==USER FLAG==
```user flag
6d488cbb3f111d135722c33cb635f4ec
```

Lets take a deeper look into `bak.py`.
![[Pasted image 20251123141948.png]]

Basically it **decompresses the website.zip into /var/www/html**, nothing to special about it.

What is special is that **we can run it as root** in our **home directory**, which we have **permissions to write**. 
Since we have those perms, I can just **create a `new bak.py`**, with malicious code, and **get a shell**.

![[Pasted image 20251123142139.png]]
![[Pasted image 20251123142147.png]]

The a.py is the old bak.py and the bak.py is my malicious script.
![[Pasted image 20251123142229.png]]

==ROOT FLAG==
```root flag
e8c8c6c256c35515d1d344ee0488c617
```

-----------
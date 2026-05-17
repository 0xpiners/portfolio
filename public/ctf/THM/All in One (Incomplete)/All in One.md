
-------------


## Description

This box's intention is to help you practice **several** ways in exploiting a system. There are a few **intended** paths to exploit it and a few **unintended** paths to get root.

Try to discover and exploit them all. **Do not** just exploit it using intended paths, hack like a **pro** and **enjoy** the box!

_Give the machine about 5 mins to fully boot._

**Twitter:** i7m4d

IP GIVEN -> **10.10.217.77**

The first thing I did was visit the IP in my browser (to see if there was any web service running).
![[Pasted image 20251105190706.png]]We got a basic Apache2 Ubuntu default page.
Looking at the source code, we don't find anything suspicious, so I thought of using nmap to find more services that might be open.
![[Pasted image 20251105190730.png]]

Nmap results:
![[Pasted image 20251105193304.png]]
We see 3 different services.
1. FTP -> with anonymous login allowed
2. SSH
3. The HTTP web service that we saw previously

Let's see what's inside the FTP service quickly.
![[Pasted image 20251105193631.png]]

Weird, there's nothing useful in there, let's skip FTP for a while and see what else we have.

I ran gobuster against our web service and found two hidden directories.
![[Pasted image 20251105193722.png]]
We got:
1. wordpress
2. hackathons

Let's visit both.
![[Pasted image 20251105193830.png]]
![[Pasted image 20251105193849.png]]

Looking at the source code of the hackathons endpoint we find something else as well.
![[Pasted image 20251105193919.png]]
We got some kind of credentials, I think.
```
Dvc W@iyur@123
```

Since the other endpoint is WordPress, let's try to use wpscan to find anything useful.
![[Pasted image 20251105194046.png]]![[Pasted image 20251105194101.png]]

There is more to see on the wpscan.

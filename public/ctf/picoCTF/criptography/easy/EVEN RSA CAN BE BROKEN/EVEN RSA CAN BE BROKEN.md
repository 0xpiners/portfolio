
-----

#### Description

```
This service provides you an encrypted flag. Can you decrypt it with just N & e? Connect to the program with netcat: `$ nc verbal-sleep.picoctf.net 49850` The program's source code can be downloaded [here](https://challenge-files.picoctf.net/c_verbal_sleep/1ce03df0245f787fd1d116ac8502051905222e1138057a4070872f3a5d38c232/encrypt.py)
```

They give us a python file
![[Pasted image 20251023161322.png]]

And a port to connect to this file (on the server side)
```
nc verbal-sleep.picoctf.net 49850
```

The important part is when we connect to the port they give us the N, e variable and the cyphertext
![[Pasted image 20251023161600.png]]
N:
```
N = 16442264181684114906715404326298827172491402904840836557960591787236162895034127914681272454062933409782555841955160458996180818998520156822457748491118542
```
e:
```
e = 65537
```
cyphertext:
```
3723742724556306970409494931577617975403239265024159822819223837065737662886028124858891241298929067016680409942050586362447010568754327519994115527949423
```

Lets first understand how RSA works

Basically RSA is an assymetric encryption algorithm

1. Choose two large random prime numbers _p_ and _q_
2. Multiply _p_ and _q_ together to get integer _n_
3. Derive another integer _e_ such that _e_ and _(p-1)(q-1)_ have no common factors
4. Choose integer _d_ such that _ed – 1_ is divisible by _(p-1)(q-1)_

_The public key is made up of n and e_

_The private key is made up of n and d_

Since the N is a even number, we can assume p is 2(prime) and q is N/2 which will be also a prime number.

I made this script to easily get the flag
![[Pasted image 20251110195735.png]]
![[Pasted image 20251110195717.png]]

==FLAG==
```
picoCTF{tw0_1$_pr!m375129bb1}
```
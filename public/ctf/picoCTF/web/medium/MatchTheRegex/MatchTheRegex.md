
---

#### Description

How about trying to match a regular expression

Additional details will be available after launching your challenge instance.

---
Website
![[Pasted image 20260226234236.png]]


When I tried to input random stuff on the input box I got this
![[Pasted image 20260226234318.png]]

I looked into the source code and saw an interesting script.
![[Pasted image 20260226234346.png]]
Basically what the script does is send a request to the endpoit /flag with the parameter input with the value of our input box value.

We also have a comment that looks like regex.

*^p.....F!?*

I thought if maybe I inputed something that matches the regex it would give me a flag, since the only thing the script does is returning json.

I did this script which I tried the word picoCTF since it matches the regex.
![[Pasted image 20260226234542.png]]

With this payload I got the flag that easily.

==FLAG==
```flag\
picoCTF{succ3ssfully_matchtheregex_f89ea585}
```

---
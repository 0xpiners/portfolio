
---

#### Description

How about trying to match a regular expression?

Additional details will be available after launching your challenge instance.

---
Website
![[Pasted image 20260226234236.png]]


When I tried to input random stuff in the input box I got this:
![[Pasted image 20260226234318.png]]

I looked into the source code and saw an interesting script.
![[Pasted image 20260226234346.png]]
Basically what the script does is send a request to the endpoint `/flag` with the parameter `input` set to the value of our input box.

We also have a comment that looks like a regex pattern:

*^p.....F!?*

I thought that if I input something that matches the regex it would give me the flag, since the only thing the script does is return JSON.

I wrote this script and tried the word picoCTF, since it matches the regex.
![[Pasted image 20260226234542.png]]

With this payload I got the flag that easily.

## FLAG
```flag
picoCTF{succ3ssfully_matchtheregex_f89ea585}
```

---
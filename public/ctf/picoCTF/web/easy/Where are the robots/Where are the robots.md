

-------------
#### Description
```
Can you find the robots? `https://jupiter.challenges.picoctf.org/problem/56830/` ([link](https://jupiter.challenges.picoctf.org/problem/56830/)) or http://jupiter.challenges.picoctf.org:56830
```

The first time visiting the site we get a page saying *where are the robots*.
This is clearly a hint for the file *robots.txt* (used to manage how bots can navigate into the site).
![[Pasted image 20251028151919.png]]

Visiting *https://jupiter.challenges.picoctf.org/problem/56830/robots.txt*,
we see a *new directory*.
![[Pasted image 20251028152036.png]]

Going inside that directory we get the flag.
![[Pasted image 20251028152111.png]]

## FLAG
```
picoCTF{ca1cu1at1ng_Mach1n3s_1bb4c}
```

------------

#### Description

```
Kishor Balan tipped us off that the following code may need inspection: `https://jupiter.challenges.picoctf.org/problem/9670/` ([link](https://jupiter.challenges.picoctf.org/problem/9670/)) or http://jupiter.challenges.picoctf.org:9670
```

They only give us a link
```
http://jupiter.challenges.picoctf.org:9670
```

![[Pasted image 20251026160620.png]]

The first thing I did, was checking the source code
![[Pasted image 20251026160814.png]]

We got already the first part of the flag (out of 3)
*First part*
```
picoCTF{tru3_d3
```

![[Pasted image 20251026160908.png]]

The second part was on the custom css ffile

*Second part*
```
t3ct1ve_0r_ju5t
```

![[Pasted image 20251026160944.png]]
Last part was on the custom js file
*Third flag*
```
_lucky?2e7b23e3}
```

==FLAG==
```
picoCTF{tru3_d3t3ct1ve_0r_ju5t_lucky?2e7b23e3}
```


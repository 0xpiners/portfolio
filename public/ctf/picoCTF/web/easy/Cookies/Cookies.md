

-----

#### Description
```
Who doesn't love cookies? Try to figure out the best one. [http://mercury.picoctf.net:27177/](http://mercury.picoctf.net:27177/)
```

![[Pasted image 20251026162611.png]]

We get a page to search for cookies, for example the snickerdoodle cookie.

![[Pasted image 20251026162733.png]]
Although this is not very useful. I noticed that whenever I inputted the word *snickerdoodle*, I got a response from the server with a *Set-Cookie* header with the value of 0.

![[Pasted image 20251026165728.png]]
I tried to increment the value of the cookie *name* to 1 and see the response.

We see that we got *I love chocolate chip cookies*.

![[Pasted image 20251026165806.png]]

I incremented until 18 and finally got the flag.
![[Pasted image 20251026165905.png]]
## FLAG
```
picoCTF{3v3ry1_l0v3s_c00k135_064663be}
```

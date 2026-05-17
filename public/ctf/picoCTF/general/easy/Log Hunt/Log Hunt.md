

-----

We only get one file.
![[Pasted image 20251020201550.png]]![[Pasted image 20251020201600.png]]
We can see it has only ASCII text.
Using the cat command, we see a lot of stuff.
![[Pasted image 20251020201632.png]]


Using the command `wc -l`, we can see how many lines the file has.
![[Pasted image 20251020201645.png]]

We can assume the flag must be somewhere in the file, so we can use grep to find it, like this:
![[Pasted image 20251020201747.png]]
Ok, the flag is divided into parts, but `INFO FLAGPART` must be in all of them, so we can use grep like this:
![[Pasted image 20251020201928.png]]

With that we grab all the different parts easily.

## FLAG
```
picoCTF{us3_y0urlinux_sk1lls_cedfa5fb}
```

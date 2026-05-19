
---------

#### Description

Can you look at the data in this binary: [static](https://mercury.picoctf.net/static/ff4e569d6b49b92d090796d4631a2577/static)? This [BASH script](https://mercury.picoctf.net/static/ff4e569d6b49b92d090796d4631a2577/ltdis.sh) might help!

![[Pasted image 20251112223753.png]]

![[Pasted image 20251112223830.png]]
![[Pasted image 20251112223900.png]]
Running the static executable gives us some text saying the flag is somewhere within the executable.
Let's run the bash script. It might help.
![[Pasted image 20251112224000.png]]Running it says we need to provide a file as an argument. Doing that, it saves two files: one containing the strings and the other containing the instructions of the executable.
![[Pasted image 20251112224053.png]]
But we can already see the flag in the strings found.

## FLAG
```
picoCTF{d15a5m_t34s3r_ccb2b43e}
```


----
#### Description

Know of little and big endian? [Source](https://artifacts.picoctf.net/c_titan/118/flag.c)

![[Pasted image 20251110202228.png]]
![[Pasted image 20251110202248.png]]
![[Pasted image 20251110202300.png]]
This is a big file.
Lets execute it just to see what happens.
![[Pasted image 20251110202403.png]]
I didnt know what little endian representation is so I googled it.

Endianess is basically the order in which a computer stores the bytes of a multi-byte value in memory.

There are:
1. Big-endian -> Stores the **most significant byte first** (the “big end” first):  
`12 34 56 78`
2. Little-endian -> Stores the **least significant byte first** (the “little end” first):  
`78 56 34 12`

After putting the correct little endian representation, they ask for the big endian, so lets do a script that does that for us and prints the flag:
![[Pasted image 20251110210911.png]]
![[Pasted image 20251110210901.png]]
And like that we have the flag
==FLAG==
```
picoCTF{3ndi4n_sw4p_su33ess_817b7cfe}
```
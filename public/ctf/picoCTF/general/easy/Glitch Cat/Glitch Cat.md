
----------------
#### Description

Our flag printing service has started glitching! `$ nc saturn.picoctf.net 63213`

Connecting to the port gives us this:
![[Pasted image 20251111212831.png]]

Basically it gives us the flag, but part of it is encoded in hexadecimal. Let's use Python to decode it.
![[Pasted image 20251111212911.png]]Now we have the full flag.

## FLAG
```
picoCTF{gl17ch_m3_n07_bda68f75}
```

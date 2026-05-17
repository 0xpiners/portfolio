
--------------
#### Description

Can you get the real meaning from this file? Download the file [here](https://artifacts.picoctf.net/c_titan/3/enc_flag).

![[Pasted image 20251110200317.png]]
![[Pasted image 20251110200335.png]]

By using cat on the file, we see it's base64 encoded. Let's decode it using the following command:
![[Pasted image 20251110200409.png]]
Ok, another base64-encoded string inside. Let's do it again.

![[Pasted image 20251110201958.png]]
Hmm, now it looks like some ROT13 cipher. Let's use CyberChef to decode it.
![[Pasted image 20251110202051.png]]

Nice, we got the flag with amount = 19.

## FLAG
```
picoCTF{caesar_d3cr9pt3d_b204adc6}
```


--------------
#### Description

Python scripts are invoked kind of like programs in the Terminal... Can you run [this Python script](https://mercury.picoctf.net/static/b351a89e0bc6745b00716849105f87c6/ende.py) using [this password](https://mercury.picoctf.net/static/b351a89e0bc6745b00716849105f87c6/pw.txt) to get [the flag](https://mercury.picoctf.net/static/b351a89e0bc6745b00716849105f87c6/flag.txt.en)?

![[Pasted image 20251112223339.png]]
We receive 3 files:
1. Python script
2. flag.txt encoded
3. Password

Let's run the script.
![[Pasted image 20251112223555.png]]
![[Pasted image 20251112223406.png]]
It looks like it gives us the option to encode or decode. Let's decode it using the usage command.
![[Pasted image 20251112223449.png]]
Of course, it asks for a password.
![[Pasted image 20251112223507.png]]
![[Pasted image 20251112223523.png]]
Nice, we decoded the flag.

## FLAG
```
picoCTF{4p0110_1n_7h3_h0us3_67c6cc96}
```

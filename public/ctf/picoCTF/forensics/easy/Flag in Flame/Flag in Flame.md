

------------
They give us a .txt file.
![[Pasted image 20251020203327.png]]
Using cat, we see a random chunk of data that looks base64-encoded.
![[Pasted image 20251020203435.png]]
We then decode this using `base64 -d` and we get this.
![[Pasted image 20251020203503.png]]
Random data. I tried redirecting all output to a file (in this case "a") and then used the `file` command to see what type it is.
![[Pasted image 20251020203602.png]]
We see that it is a PNG file. Using a simple `mv` to change the name of the file to image.png and opening it, we get this.
![[Pasted image 20251020203646.png]]
We see a hex-encoded string at the bottom of the image.
Using an online tool to convert the image text, I copied the string and then decoded it using this command.
![[Pasted image 20251020203825.png]]
And boom, we got the flag.


## FLAG
```
picoCTF{forensics_analysis_is_amazing_24d16895}
```


------------


They give us one JPG file.
![[Pasted image 20251020202406.png]]

Using the command `exiftool`, we can see in the metadata a base64-encoded string.
![[Pasted image 20251020202610.png]]Using the command `base64 -d` we can decode it.
![[Pasted image 20251020202630.png]]
We see another hidden field mentioning steghide (a well-known tool for hiding files within images) and a base64-encoded string.

![[Pasted image 20251020202825.png]]
And we get the password to use with steghide.
![[Pasted image 20251020202857.png]]Using this command we can extract the hidden file (flag.txt) using the password.

Using `cat flag.txt`, we get the final flag.

## FLAG

```
picoCTF{h1dd3n_1n_1m4g3_92f08d7c}
```

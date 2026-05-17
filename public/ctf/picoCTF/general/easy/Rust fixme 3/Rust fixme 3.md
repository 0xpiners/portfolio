
-----
#### Description

Have you heard of Rust? Fix the syntax errors in this Rust file to print the flag! Download the Rust code [here](https://challenge-files.picoctf.net/c_verbal_sleep/dcdaf491b35c1d0f5075e9583edbbb7aaea1dffb6ad32bc000e4d87b5200ff7b/fixme3.tar.gz).

![[Pasted image 20251110191852.png]]![[Pasted image 20251110191914.png]]

Here we can see the source code of the Rust file
![[Pasted image 20251110192325.png]]
![[Pasted image 20251110192259.png]]
When I tried to run the code I got an error saying "call to unsafe function", requiring us to use an unsafe block
We also see the code its basically decrpyting the hex_values using the key "CSUCKS", so we either copy all hex values and use the key CSUCKS to decrypt it using XOR, or we just fix the code adding an unsafe block to the function.
![[Pasted image 20251110192741.png]]
(Fixed code)
And like that we just need to run it again and we get the flag.
![[Pasted image 20251110192231.png]]==FLAG==
```
picoCTF{n0w_y0uv3_f1x3d_1h3m_411}
```
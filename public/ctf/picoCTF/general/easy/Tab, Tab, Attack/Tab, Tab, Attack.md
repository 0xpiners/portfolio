
---------

#### Description

Using tabcomplete in the Terminal will add years to your life, esp. when dealing with long rambling directory structures and filenames: [Addadshashanammu.zip](https://mercury.picoctf.net/static/72712e82413e78cc8aa8d553ffea42b0/Addadshashanammu.zip)

**![[Pasted image 20251112222844.png]]**

When unzipping the zip, we already can see a lot of directories nested in each other. We can just tab until we cat the final file.
![[Pasted image 20251112222953.png]]
Ok the file looks weird. We already can see the flag, but lets see what type of file is this.
![[Pasted image 20251112223041.png]]Its just an executable. Running it also gives us the flag.

==FLAG==
```
picoCTF{l3v3l_up!_t4k3_4_r35t!_6f332f10}
```
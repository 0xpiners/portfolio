

-----------
#### Description

Unzip this archive and find the flag.

- [Download zip file](https://artifacts.picoctf.net/c/503/big-zip-files.zip)


When we unzip the file, we get a lot of files — a lot.

We can assume the flag is somewhere in those files, so we can use the `find` command to `cat` everything and find the flag, like this:
```
find . -type f -exec cat {} \; | grep "picoCTF"
```

And just like that we get the flag.

## FLAG
```
picoCTF{gr3p_15_m4g1c_ef8790dc}
```

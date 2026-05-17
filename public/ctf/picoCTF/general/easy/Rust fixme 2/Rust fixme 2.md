
-----------------

#### Description

The Rust saga continues? I ask you, can I borrow that, pleeeeeaaaasseeeee? Download the Rust code [here](https://challenge-files.picoctf.net/c_verbal_sleep/babfbee79718a6363826ba86300173ffde6d81577e9dd07d4130c53a7eecf6c3/fixme2.tar.gz).

They give us this file.
![[Pasted image 20251103131006.png]]Let's unzip it.
![[Pasted image 20251103131109.png]]Ok, we have 3 files:
1. Cargo.lock -> Automated file for locking dependency versions.
2. Cargo.toml -> Project configuration file.
3. main.rs -> The important file that contains the main code.
![[Pasted image 20251103131318.png]]Here we can see the main.rs function.
![[Pasted image 20251103131444.png]]When we try to run main.rs, it gives us two errors.
Basically we are passing a non-mutable argument into the function, so we can't change its value.
To fix this, we just have to add **mut** to the argument so Rust knows it's a mutable object.
![[Pasted image 20251103142952.png]]
Like this.
After running the main script again, we get the flag.
This CTF was about how Rust syntax works and how mutable objects work.
![[Pasted image 20251103143011.png]]

## FLAG
```
picoCTF{4r3_y0u_h4v1n5_fun_y31?}
```

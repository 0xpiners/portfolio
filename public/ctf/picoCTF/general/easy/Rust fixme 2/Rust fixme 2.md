
-----------------

#### Description

The Rust saga continues? I ask you, can I borrow that, pleeeeeaaaasseeeee? Download the Rust code [here](https://challenge-files.picoctf.net/c_verbal_sleep/babfbee79718a6363826ba86300173ffde6d81577e9dd07d4130c53a7eecf6c3/fixme2.tar.gz).

They give us this file
![[Pasted image 20251103131006.png]]Lets unzip it 
![[Pasted image 20251103131109.png]]Ok, we have 3 files
1. Cargo.lock -> Automated file, for locking dependicy versions
2. Cargo.toml -> Project configuration file
3. main.rs -> Important file that contains main code
![[Pasted image 20251103131318.png]]Here we can see the main.rs function.
![[Pasted image 20251103131444.png]]When we try to run  the main.rs, it gives us two errors.
Basically we are passing a not mutable argument into the function, that way we can not change its value.
To fix this we just have to add **mut** into the argument so it knows its a muttable object
![[Pasted image 20251103142952.png]]
Like this.
After running the main script again, we get the flag.
This ctf was about RUST syntax worked, and how muttable objects works,
![[Pasted image 20251103143011.png]]

==FLAG==
```
picoCTF{4r3_y0u_h4v1n5_fun_y31?}
```
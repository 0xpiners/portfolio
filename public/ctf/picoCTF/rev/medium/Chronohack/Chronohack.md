
-----------

#### Description

Can you guess the exact token and unlock the hidden flag? Our school relies on tokens to authenticate students. Unfortunately, someone leaked an important [file for token generation](https://challenge-files.picoctf.net/c_verbal_sleep/d7dc902d5c4d7c746ba963b10484ed0e93ac6e7a2f478aedd846ef4ecd61c1fe/token_generator.py). Guess the token to get the flag. The access is granted through `nc verbal-sleep.picoctf.net 62691`.

They only give us a Python script.
![[Pasted image 20251114124612.png]]

![[Pasted image 20251114124624.png]]

So, we can see it generates a "random" token from a seed, but the way they calculate the seed is using `time.time()`. This is predictable since we know the time of the connection.
![[Pasted image 20251114131815.png]]
The tricky part is that the seed is in milliseconds, so we have to be precise.

Luckily, in the main function we have 50 guesses, so we can create a range of 50 possible seeds based on the time we connected to the server.
![[Pasted image 20251114131806.png]]
Let's write a Python script for that.
![[Pasted image 20251114144104.png]]

## FLAG
```bash
picoCTF{UseSecure#$_Random@j3n3r@T0rsb93f322d}
```

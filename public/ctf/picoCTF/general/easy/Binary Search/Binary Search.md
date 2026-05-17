
-------------

#### Description

Want to play a game? As you use more of the shell, you might be interested in how they work! Binary search is a classic algorithm used to quickly find an item in a sorted list. Can you find the flag? You'll have 1000 possibilities and only 10 guesses. Cyber security often has a huge amount of data to look through - from logs, vulnerability reports, and forensics. Practicing the fundamentals manually might help you in the future when you have to write your own tools! You can download the challenge files here:

- [challenge.zip](https://artifacts.picoctf.net/c_atlas/5/challenge.zip)

`ssh -p 51571 ctf-player@atlas.picoctf.net` Using the password `1ad5be0d`. Accept the fingerprint with `yes`, and `ls` once connected to begin. Remember, in a shell, passwords are hidden!

![[Pasted image 20251112193453.png]]
So we have a .sh file, lets see whats inside.
![[Pasted image 20251112193511.png]]
Lets also see what happens when we run it.
![[Pasted image 20251112193540.png]]
Ok so its basically a guessing game and we have 10 guesses. Lets always add half between the lower and higher(initially the lower will be 0 and higher 100)

![[Pasted image 20251112200207.png]]

==FLAG===
```
picoCTF{g00d_gu355_3af33d18}
```

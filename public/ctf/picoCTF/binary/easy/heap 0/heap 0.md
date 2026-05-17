
----

#### Description

Are overflows just a stack concern? Download the binary [here](https://artifacts.picoctf.net/c_tethys/15/chall). Download the source [here](https://artifacts.picoctf.net/c_tethys/15/chall.c). Connect with the challenge instance here: `nc tethys.picoctf.net 60241`

They give us this file
![[Pasted image 20251102010353.png]]
![[Pasted image 20251102010413.png]]One of the files is a ELF 64 LSB executable
And another one is the source code in C

Main:
![[Pasted image 20251102014302.png]]
They give us the option to print heap variables (1), write into a variable (2), which is important, print safe_var (3), check if we got a heap overflow (4), and exit (5)

We have this function that checks if the safe_var is still "bico". If it is not, it prints the flag.
This hint us we have to do some type of overflow, in this case heap overflow.
![[Pasted image 20251102013955.png]]

Just to have some information about the heap, heap is region of the program memory used for *dynamic memory allocation*, basically it lets possible to allocate and free memory while the program its running and not at the complie time.

In the init() function, we can see they use malloc to allocate 5 bytes to each input_data and safe_var, which is normal.
![[Pasted image 20251102014102.png]]![[Pasted image 20251102014227.png]]
We can see they allocate only 5 bytes of space for each variable.

This function is crucial, because when we are asked to input the data for the buffer (of 5 bytes), they dont check the size of the new input.  Thats crucial, because we can just reach the address of the save_var with random data.
![[Pasted image 20251102014417.png]]
Since we know both addresses of the variables in the heap, we can calculate the "distance" in bytes from both variables so we know how many chars we need to input
![[Pasted image 20251102014533.png]]

> INPUT_DATA = 0x55d01c350720
> SAFE_VAR     = 0x55d01c350740

Doing simple math
![[Pasted image 20251102014930.png]]
Both addresses are 32 bytes away.
This means we can input 32 "A" and let the null terminator override the safe_var.
![[Pasted image 20251102015448.png]]And with that we easily manage to do a heap overflow.
I did a script to automate the whole process and running it we get the flag
![[Pasted image 20251102020505.png]]
![[Pasted image 20251102020453.png]]

==FLAG==
```
picoCTF{my_first_heap_overflow_0c473fe8}
```

----

#### Description

Are overflows just a stack concern? Download the binary [here](https://artifacts.picoctf.net/c_tethys/15/chall). Download the source [here](https://artifacts.picoctf.net/c_tethys/15/chall.c). Connect with the challenge instance here: `nc tethys.picoctf.net 60241`

They give us these files.
![[Pasted image 20251102010353.png]]
![[Pasted image 20251102010413.png]]One of the files is an ELF 64-bit LSB executable, and the other is the source code in C.

Main:
![[Pasted image 20251102014302.png]]
They give us the option to print heap variables (1), write into a variable (2) which is important, print safe_var (3), check if we got a heap overflow (4), and exit (5).

We have this function that checks if the safe_var is still "bico". If it is not, it prints the flag.
This hints that we have to do some type of overflow — in this case, a heap overflow.
![[Pasted image 20251102013955.png]]

Just to have some background: the heap is a region of program memory used for *dynamic memory allocation*. It allows allocating and freeing memory while the program is running, rather than at compile time.

In the init() function, we can see they use malloc to allocate 5 bytes for each of input_data and safe_var, which is normal.
![[Pasted image 20251102014102.png]]![[Pasted image 20251102014227.png]]
We can see they allocate only 5 bytes of space for each variable.

This function is crucial, because when we are asked to input the data for the buffer (of 5 bytes), they don't check the size of the new input. That's critical, because we can just reach the address of safe_var with random data.
![[Pasted image 20251102014417.png]]
Since we know both addresses of the variables in the heap, we can calculate the "distance" in bytes between them, so we know how many chars we need to input.
![[Pasted image 20251102014533.png]]

> INPUT_DATA = 0x55d01c350720
> SAFE_VAR     = 0x55d01c350740

Doing simple math:
![[Pasted image 20251102014930.png]]
Both addresses are 32 bytes apart.
This means we can input 32 "A"s and let the null terminator override the safe_var.
![[Pasted image 20251102015448.png]]And with that we easily manage to do a heap overflow.
I wrote a script to automate the whole process and running it we get the flag.
![[Pasted image 20251102020505.png]]
![[Pasted image 20251102020453.png]]

## FLAG
```
picoCTF{my_first_heap_overflow_0c473fe8}
```

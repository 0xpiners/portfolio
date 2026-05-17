
-------------

#### Description

Can you use your knowledge of format strings to make the customers happy? Download the binary [here](https://artifacts.picoctf.net/c_mimas/76/format-string-0). Download the source [here](https://artifacts.picoctf.net/c_mimas/76/format-string-0.c). Connect with the challenge instance here: `nc mimas.picoctf.net 56734`

They give us two files, a ELF execubtable and the C source code of that executable.
![[Pasted image 20251102140535.png]]

Viewing the source code, we see in the main func, that it reads the contents of the flag, after that it prepares a segmentation fault handler and then prints the menu for patrick.
![[Pasted image 20251102145048.png]]
The sigsegv_handler is very important, because shows us that if we managed to do a seg fault, it will print the flag
![[Pasted image 20251102145217.png]]
We already know our objective, lets now see what the serve_patrick() function does
![[Pasted image 20251102145246.png]]
We see it prints the menu and some options for Patrick, we see we need to choose one valid option to get to serve_bob(). 
To pass the condition we must choose a valid option and someway double the size of the allowed BUFSIZE.

Looking at the options we can see we have a "Gr%114d_Cheese" option. This is great, because we see that they printf(choice1) the var without specifying the format. This is crucial because when we are priting **Gr%114d_Cheese**, printf will print Gr normally and then it will detect the %114d format specifier, which has a 114 minumum field width.
Because printf was expecting a int (because of the %d format specifier), it will print whatever int is in the stack.
This way we can get passed both conditions (valid option and double the BUFSIZE)

After that we can see the serve_bob() func:
![[Pasted image 20251102150047.png]]

In this func, we see they also printf, without specifying the format specifier, and on the options for Bob, we see that they have **Cla%sic_Che%s%steak**, this lets us do a **format string vulnerability**, because when we input that option (because theres no format specification) and it will try to read the address from the memory, if that address/pointer is invalid, it will cause a seg fault.

Now that we know what options to choose to cause the seg fault, I made a script to automate the whole process.
 Running it, we get the flag.
![[Pasted image 20251102144739.png]]
![[Pasted image 20251102144802.png]]

==FLAG==
```
picoCTF{7h3_cu570m3r_15_n3v3r_SEGFAULT_63191ce6}
```
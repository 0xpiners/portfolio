
-------------

#### Description

Can you use your knowledge of format strings to make the customers happy? Download the binary [here](https://artifacts.picoctf.net/c_mimas/76/format-string-0). Download the source [here](https://artifacts.picoctf.net/c_mimas/76/format-string-0.c). Connect with the challenge instance here: `nc mimas.picoctf.net 56734`

They give us two files: an ELF executable and the C source code of that executable.
![[Pasted image 20251102140535.png]]

Viewing the source code, we see in the main function that it reads the contents of the flag, then prepares a segmentation fault handler, and then prints the menu for Patrick.
![[Pasted image 20251102145048.png]]
The sigsegv_handler is very important, because it shows us that if we managed to cause a segfault, it will print the flag.
![[Pasted image 20251102145217.png]]
We already know our objective, so let's now see what the serve_patrick() function does.
![[Pasted image 20251102145246.png]]
We see it prints the menu and some options for Patrick. We need to choose one valid option to get to serve_bob().
To pass the condition we must choose a valid option and somehow double the size of the allowed BUFSIZE.

Looking at the options we can see we have a "Gr%114d_Cheese" option. This is great, because `printf(choice1)` prints the variable without specifying the format. This is crucial because when printing **Gr%114d_Cheese**, `printf` will print "Gr" normally and then detect the `%114d` format specifier, which has a minimum field width of 114.
Because `printf` was expecting an int (because of the `%d` format specifier), it will print whatever int is on the stack.
This way we can get past both conditions (valid option and doubling the BUFSIZE).

After that we can see the serve_bob() function:
![[Pasted image 20251102150047.png]]

In this function, they also call `printf` without specifying a format specifier. Looking at the options for Bob, we see that they have **Cla%sic_Che%s%steak**, which allows a **format string vulnerability**: when we input that option (with no format specification), `printf` will try to read addresses from the stack. If any address/pointer is invalid, it will cause a segfault.

Now that we know which options to choose to cause the segfault, I made a script to automate the whole process.
Running it, we get the flag.
![[Pasted image 20251102144739.png]]
![[Pasted image 20251102144802.png]]

## FLAG
```
picoCTF{7h3_cu570m3r_15_n3v3r_SEGFAULT_63191ce6}
```

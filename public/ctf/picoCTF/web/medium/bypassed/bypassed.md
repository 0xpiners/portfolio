
---------------

#### Description

A university's online registration portal asks students to upload their ID cards for verification. The developer put some filters in place to ensure only image files are uploaded but are they enough? Take a look at how the upload is implemented. Maybe there's a way to slip past the checks and interact with the server in ways you shouldn't. You can access the web application at [here](http://amiable-citadel.picoctf.net:60284/)!


Checking the site, we get a *student identity verification* where we can *upload jpg, png, or gif*
![[Pasted image 20251028235950.png]]

I tried to see how that *filter worked*. I tried to *upload a .php* file to see what happened.
![[Pasted image 20251029173824.png]]Yeah... I couldnt. I already knew *there are more than 1 php extension* so I tried using *.php5*
![[Pasted image 20251029173915.png]]For my surprise it worked!

I accessed the file to see if the *server ran php*. But unfortunetaly no...
![[Pasted image 20251029173958.png]]

Then I remembered *apache servers use .htacess* file to *show what files can execute or render at least*

Since we can upload files, lets try *upload a malicious .htaccess* that will let us *execute php code*.
![[Pasted image 20251029174156.png]]
This is the content of the .htaccess, lets try upload it and see if the filter blocks it or not
![[Pasted image 20251029174245.png]]
We got it!
![[Pasted image 20251029174254.png]]
We *overrided the .htaccess*

Now that the server *renders php code* and we know we can *upload .php5 files* , it becomes easy.
I got lazy and asked chat gpt to make me a *simple input text that runs commands and sends back the output*
![[Pasted image 20251029174558.png]]This is what we got, works so its fine.
![[Pasted image 20251029174614.png]]
We can try to find the flag using the find command like this:
```
find / -name flag.txt
```
![[Pasted image 20251029174725.png]]We know *where is the flag -> /var/www/flag.txt*
Lets cat it
![[Pasted image 20251029174758.png]]
We only could do this way because we knew the name (or guessed) of the file. But it would be simple to make a reverse shell soo... Anyways heres the flag
==FLAG==
```
picoCTF{s3rv3r_byp4ss_191e9557}
```
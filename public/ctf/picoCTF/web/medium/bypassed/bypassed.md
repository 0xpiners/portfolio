
---------------

#### Description

A university's online registration portal asks students to upload their ID cards for verification. The developer put some filters in place to ensure only image files are uploaded, but are they enough? Take a look at how the upload is implemented. Maybe there's a way to slip past the checks and interact with the server in ways you shouldn't. You can access the web application [here](http://amiable-citadel.picoctf.net:60284/)!


Checking the site, we get a *student identity verification* page where we can *upload jpg, png, or gif* files.
![[Pasted image 20251028235950.png]]

I tried to see how that *filter worked*. I tried to *upload a .php* file to see what happened.
![[Pasted image 20251029173824.png]]Yeah... I couldn't. I already knew *there is more than one PHP extension*, so I tried using *.php5*.
![[Pasted image 20251029173915.png]]To my surprise it worked!

I accessed the file to see if the *server ran PHP*. Unfortunately, no.
![[Pasted image 20251029173958.png]]

Then I remembered that *Apache servers use `.htaccess`* to *control which files can execute or be rendered*.

Since we can upload files, let's try to *upload a malicious `.htaccess`* that will let us *execute PHP code*.
![[Pasted image 20251029174156.png]]
This is the content of the `.htaccess`. Let's try uploading it and see if the filter blocks it.
![[Pasted image 20251029174245.png]]
We got it!
![[Pasted image 20251029174254.png]]
We *overrode the `.htaccess`*.

Now that the server *renders PHP code* and we know we can *upload `.php5` files*, it becomes easy.
I asked ChatGPT to make me a *simple text input that runs commands and sends back the output*.
![[Pasted image 20251029174558.png]]This is what we got — it works, so it's fine.
![[Pasted image 20251029174614.png]]
We can try to find the flag using the find command:
```
find / -name flag.txt
```
![[Pasted image 20251029174725.png]]We know *where the flag is: `/var/www/flag.txt`*.
Let's cat it.
![[Pasted image 20251029174758.png]]
We could only do it this way because we knew (or guessed) the filename. But it would be simple to set up a reverse shell too. Anyway, here's the flag.
## FLAG
```
picoCTF{s3rv3r_byp4ss_191e9557}
```
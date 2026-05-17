
---------------

#### Description

Can you find the flag in the file? This would be really tedious to look through manually, something tells me there is a better way. The flag is in this [file](https://challenge-files.picoctf.net/c_fickle_tempest/9e4f9113960f157ceb824bdb449dc2a74504b484346c1442e64854408d5a90c5/file).

![[Pasted image 20251119205646.png]]

When we cat the file, we get a lot of nonsense.
![[Pasted image 20251119205722.png]]

Lets use grep to find the flag.

![[Pasted image 20251119205827.png]]
We can see in red the flag.

==FLAG==
```flag
picoCTF{grep_is_good_to_find_things_9C6Ef2F7}
```
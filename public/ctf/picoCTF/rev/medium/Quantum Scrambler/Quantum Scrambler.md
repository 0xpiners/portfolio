
----------------

#### Description

We invented a new cypher that uses "quantum entanglement" to encode the flag. Do you have what it takes to decode it? Connect to the program with netcat: `$ nc verbal-sleep.picoctf.net 59200` The program's source code can be downloaded [here](https://challenge-files.picoctf.net/c_verbal_sleep/e13eb5873244e0dc70a4ca3776fbca63ffad937514dc165aa3123f87dae0c735/quantum_scrambler.py).

They only give us this file
![[Pasted image 20251103155944.png]]

Viewing the source code we get this:
![[Pasted image 20251103160031.png]]

So basically what it does is:
1. Transforms all flag.txt into a list with the hex values of each char and returns it
2. After that, it "scrables the list"
	1. Removes the i-1 index of the list and appends it to i-2 (i starts as 2)
	2. Appends every index of 0 to i-2 to i-1 of the list (keep in mind, because it popped on index from the list now x becomes x-1 index)
Heres a simple example of whats happening (I will chars to be less confusing)
```
LIST = [ "a" , "b", "c", "d", "e" ]
 i=2
 LIST = [["a", "b"], "b", "c", "d", "e"] # After first operation -> poping i-1 (second index) and appending to i-2 (first index)
 LIST = [["a","b"], ["b", []], "c", "d", "e"] # After appending everything from 0:i-2 (which is nothing because i-2 = 0, 0:0 its nothing, an empty list))
 i=3
 LIST = [[["a","b"], ["b", [], "c"], "d", "e"] # After poping i-1 (2) and appending to i-2 (1)
 LIST = [[["a","b"], ["b", [], "c"], ["d", ["a", "b"]], "e"] # After appending everything from 0:i-2 (0:1)
```

From this we can see the only thing that matters is the first and last element from each list
I made this script to do exactly that
![[Pasted image 20251103194550.png]]
![[Pasted image 20251103194621.png]]
I dont know why but the last element of the last list was this huge list, so I just decided to extract the last hex from it and use cyberchef to decode everything
![[Pasted image 20251103194707.png]]
And with that, we got the flag

==FLAG==
```
picoCTF{python_is_weirdfeabf287}
```
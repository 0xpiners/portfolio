

----------


Description
I wonder what this really is... enc ''.join([chr((ord(flag[i]) << 8) + ord(flag[i + 1])) for i in range(0, len(flag), 2)])

They give us a *file enc*.
![[Pasted image 20251031140513.png]]

As we see in the description, the *flag was encoded using the following line*:
```
''.join([chr((ord(flag[i]) << 8) + ord(flag[i + 1])) for i in range(0, len(flag), 2)])
```

Basically what happens is:
1. They *iterate the whole flag*, jumping *2 by 2*, as we can see in the range(0, len(flag), *2*).
2. For each i (even indexes of flag), they *shift the ASCII value of the char left by 8 bits*, meaning *the first 8 bits of the char are "pushed" to the left*.
		1. If we have the letter "p", its ASCII representation is *112* -> in binary -> *01110000*, *shifting 8 bits to the left* -> we get this binary number *0111000000000000* -> *28672*.
		2. They then add the *ASCII value of the index i+1*. Let's *assume i+1 = "i"*.
		3. After that they *turn it into a char* -> so we have *i(0) -> p* and *i(1) -> i*. We already know the *ord value of p << 8*; the *ord value of "i" is -> 105*, so we get *28672+105* -> which is:
![[Pasted image 20251031141351.png]]
We see it's the same char as our encoded flag (so we know the first chars are "p" and "i", obviously because we know the flag format -> picoCTF{}).

With all of this in mind, I made a script that decodes it.
![[Pasted image 20251031141724.png]]

It's important to mention that we can always *get all the even-indexed chars* because when we *shift 8 bits to the left* and then *shift back 8 bits to the right*, the *LSB* (which is the odd-indexed char) doesn't matter.
![[Pasted image 20251031142110.png]]
As you can see, because "b" is the *LSB*, shifting to the *right* effectively *removes* the *ord value of b*.

To get the values of *the odd-indexed chars*, we simply need to take the *ord value of the encoded char* (already with the sum of both ords) and *subtract the ord value of the even-indexed char shifted 8 bits to the right*.
With this we can recover the *ord value of the odd-indexed chars*.

After running the script, we get the flag.
![[Pasted image 20251031142347.png]]
## FLAG
```
picoCTF{16_bits_inst34d_of_8_75d4898b}
```

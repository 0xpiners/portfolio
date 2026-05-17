
---------

#### Description

Can you make sense of this source code file and write a function that will decode the given encrypted file content? Find the encrypted file [here](https://challenge-files.picoctf.net/c_verbal_sleep/ba64ef56074be4d9f1b047eb451185d84de7c490e264b9ea6e645bd9b0956c01/enc_flag). It might be good to analyze [source file](https://challenge-files.picoctf.net/c_verbal_sleep/ba64ef56074be4d9f1b047eb451185d84de7c490e264b9ea6e645bd9b0956c01/block_chain.py) to get the flag.

![[Pasted image 20251114155231.png]]

We got two files, one python script and one text file containing the encoded flag.
![[Pasted image 20251114155308.png]]
![[Pasted image 20251114155334.png]]![[Pasted image 20251114155344.png]]
This is what we get when we run with a random arg
![[Pasted image 20251114220206.png]]

Lets start by looking at the main.
![[Pasted image 20251114203902.png]]It gets the token sent with sysargs (we dont know which one was used, maybe its the flag). Then it prints a random key that is going to be used to encrypt all blocks later created.

It also creates the genesis block (first block of our blockchain). 
Lets take a look on the Block class.
![[Pasted image 20251114204338.png]]
It has some attributes but nothing that relevant to see. Its how normal blockchain works.

After creating the Genesis block, it will create 4 more blocks and random transaction and append it to the blockchain.
This is the function that creates new blocks.
![[Pasted image 20251114215655.png]]
![[Pasted image 20251114215718.png]]
It basically just checks if the hash starts with "00" and adds it to the blockchain. Also increments the index.

After that it gets the blocks as string (basically the hash function of itself).
![[Pasted image 20251114215841.png]]
Then they encrypt it, using the key and a token, which we dont know.

This is the function they use do encrypt.
![[Pasted image 20251114215446.png]]

As we can see they put the token inside the plaintext, then they pad it using block sizes of 16 bytes and then xor each block with the key (first 16 bytes).

We can actually decrypt this using xor, because xor reverses xor.

I made this script to decrypt it.
![[Pasted image 20251114220408.png]]
Basically we have both key and encrypted text.

We can just sha256 the key (like they did on the script), because the key they gives us is not the same they use for encryption.
We can just get the first 16 bytes of that key, since the encryption uses 16 bytes block.
Then we just have to xor it again and remove the padding.

Running it we get the flag, which was the token that they inserted in the middle.
![[Pasted image 20251114220510.png]]

==FLAG==
```bash
picoCTF{block_3SRhViRbT1qcX_XUjM0r49cH_qCzmJZzBK_60647fbb}
```
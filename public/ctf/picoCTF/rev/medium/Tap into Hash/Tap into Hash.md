
---------

#### Description

Can you make sense of this source code file and write a function that will decode the given encrypted file content? Find the encrypted file [here](https://challenge-files.picoctf.net/c_verbal_sleep/ba64ef56074be4d9f1b047eb451185d84de7c490e264b9ea6e645bd9b0956c01/enc_flag). It might be good to analyze the [source file](https://challenge-files.picoctf.net/c_verbal_sleep/ba64ef56074be4d9f1b047eb451185d84de7c490e264b9ea6e645bd9b0956c01/block_chain.py) to get the flag.

![[Pasted image 20251114155231.png]]

We got two files: one Python script and one text file containing the encoded flag.
![[Pasted image 20251114155308.png]]
![[Pasted image 20251114155334.png]]![[Pasted image 20251114155344.png]]
This is what we get when we run it with a random argument.
![[Pasted image 20251114220206.png]]

Let's start by looking at the main function.
![[Pasted image 20251114203902.png]]It gets the token sent with sysargs (we don't know which one was used, maybe it's the flag). Then it prints a random key that is going to be used to encrypt all blocks created later.

It also creates the genesis block (first block of our blockchain).
Let's take a look at the Block class.
![[Pasted image 20251114204338.png]]
It has some attributes but nothing that relevant to examine. It's how normal blockchain works.

After creating the genesis block, it creates 4 more blocks with random transactions and appends them to the blockchain.
This is the function that creates new blocks.
![[Pasted image 20251114215655.png]]
![[Pasted image 20251114215718.png]]
It basically just checks if the hash starts with "00" and adds it to the blockchain, also incrementing the index.

After that it gets the blocks as a string (basically the hash function of itself).
![[Pasted image 20251114215841.png]]
Then they encrypt it using the key and a token, which we don't know.

This is the function they use to encrypt.
![[Pasted image 20251114215446.png]]

As we can see, they put the token inside the plaintext, then they pad it using block sizes of 16 bytes, and then XOR each block with the key (first 16 bytes).

We can actually decrypt this using XOR, because XOR reverses XOR.

I made this script to decrypt it.
![[Pasted image 20251114220408.png]]
Basically we have both the key and the encrypted text.

We can just SHA-256 the key (like they did in the script), because the key they give us is not the same one used for encryption.
We can just take the first 16 bytes of that key, since the encryption uses 16-byte blocks.
Then we just have to XOR it again and remove the padding.

Running it, we get the flag, which was the token inserted in the middle.

## FLAG
```bash
picoCTF{block_3SRhViRbT1qcX_XUjM0r49cH_qCzmJZzBK_60647fbb}
```

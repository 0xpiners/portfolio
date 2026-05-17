
---

#### Description

Here's a file that was recovered from a 32-bits system that organized the bytes a weird way. We're not even sure what type of file it is. Download it [here](https://artifacts.picoctf.net/c_titan/35/challengefile) and see what you can get out of it

---

I started by checking `challengefile` with `file` and `strings`, but it didn’t reveal a useful file type or readable content. 
Since the challenge title was `endianness-v2` and it mentioned a 32-bit system, I inferred the data was likely stored with the wrong byte order for 32-bit words. 
A 32-bit word is 4 bytes, so I wrote a script that reads the file as raw bytes, splits it into 4-byte chunks, and reverses each chunk (`AB CD EF 01` -> `01 EF CD AB`). 
I kept any leftover bytes at the end unchanged. After writing the transformed output to a new file, the file became recognizable, confirming the conversion was correct. So the solve was to perform a per-word 4-byte endian swap, not reverse the whole file.

```python
with open("challengefile", "rb") as f:
    data = f.read()

out = bytearray()
for i in range(0, len(data), 4):
    chunk = data[i : i + 4]
    if len(chunk) == 4:
        out.extend(chunk[::-1])
    else:
        out.extend(chunk)

with open("output_swap32.jpg", "wb") as f:
    f.write(out)

```

==FLAG==
```flag
picoCTF{cert!f1Ed_iNd!4n_s0rrY_3nDian_188d7b8c}
```

---
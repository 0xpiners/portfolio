
---

## Description

I've heard that there is a juicy secret blog post yet to be released. Can you find it?

`http://ssof2526.challenges.cwte.me:25261`

---

The website was the same as the previous one.
![[IST/SSoF/CTF's/ist1117363/Lab4/Wow, it can't be more juicy than this/Images/Website.png]]

Since the description talked about a secret blog post, I started by testing if I could control the query structure. I suspected from the previous challenges that the backend query was something like: `SELECT id, title, content FROM blog_posts WHERE title LIKE '%$search%';`

I tried a **Union-Based SQL Injection** to see if I could append my own data to the results. I needed to guess the correct number of columns.

Payload:
`%' UNION SELECT 1, 'TEST-TITLE', 'TEST-CONTENT'--`
![[Test Post.png]]

**It worked because the `UNION` operator allowed me to combine the results of the original query with the results of a new, injected query.** The payload `%' UNION SELECT...` closed the original search term and appended a second `SELECT` statement. Because the column count matched (3 columns) and the data types were compatible, the database returned both the legitimate blog posts and my artificial "TEST-TITLE" row.

Next, I needed to find the table containing the secret. Since this is an SQLite database, I queried the `sqlite_master` table to list all table names.

`%' UNION SELECT 1, tbl_name, sql FROM sqlite_master--`

The output revealed a suspicious table named **`secret_blog_post`**.
![[Secret.png]]

Finally, I targeted that table to retrieve its contents. I injected a final query to select the `title` and `content` columns from `secret_blog_post`.

`%' UNION SELECT 1, title, content FROM secret_blog_post--`
![[IST/SSoF/CTF's/ist1117363/Lab4/Wow, it can't be more juicy than this/Images/Flag.png]]

## FLAG
```flag
SSof{Never_understimate_the_power_of_the_UNION}
```

---
## Conclusion

This challenge demonstrated a **Union-Based SQL Injection**. By failing to sanitize the search input, the application allowed me to append arbitrary queries to the database execution. This allowed me to map the entire database schema using `sqlite_master`.

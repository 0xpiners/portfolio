
---

## Description

I heard the `admin` keeps some really nice info just for him.

`http://ssof2526.challenges.cwte.me:25261`

---

This is the page I found when visiting the challenge.
![[Page.png]]

I noticed there was a login page as well.
![[Login.png]]

Since this was a SQL injection challenge, I tried the simplest SQLi payload.

`' OR 1=1 --'`

And it worked.
![[Admin.png]]

**It worked because the injected payload changed the intended SQL query.**  
For example, instead of running something like:

`SELECT * FROM users WHERE username='admin' AND password='secret';`

the payload `' OR 1=1 --` transformed it into:

`SELECT * FROM users WHERE username='' OR 1=1 -- ' AND password='secret';`

Since `1=1` is always true and the rest of the query is commented out, the database returns the admin row, letting me log in as admin without knowing any credentials.

After that I visited the admin's profile and got the flag.
![[Flag.png]]

## FLAG
```flag
SSof{SQLi_on_SELECT_allows_you_to_become_an_administrator}
```


--- 

## Conclusion

This challenge showed how a basic SQL injection can bypass insecure login logic. By closing the string, forcing an always-true condition, and commenting out the rest of the query, the payload tricked the application into granting admin access, highlighting why proper input validation and prepared statements are essential.


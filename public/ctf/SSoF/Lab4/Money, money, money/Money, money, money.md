
---

## Description

Register a new account. Can you win the jackpot?

`http://ssof2526.challenges.cwte.me:25261`

---

The website was the same as the previous one.
![[Website.png]]

But this time the description says to register a new account and hit the "jackpot".

I registered a user and went to the login page.
![[Register.png]]

There I could find an age input field and a bio input field.

The age input field only let me put numbers, so it's not useful for SQLi.

But the bio input field let me put anything I wanted, which makes sense since it's a bio.

I guessed the objective was to change the `tokens` value in the database, since the jackpot requires 84828 tokens.

I started probing the bio field to see what was allowed. First I tried standard SQL comments like `--`, but the server returned an error saying "please no comments".
![[No comments.png]]

Then I tried stacking queries with `;` to run a second update command, but it blocked me saying "You can only execute one statement at a time".
![[One.png]]

I also triggered an error that revealed the query structure. It showed that my input was being wrapped in single quotes for the bio column: `UPDATE user SET bio = 'aaaa' WHERE username = 'piners'`.
![[Error.png]]

Since I couldn't start a new statement with `;` or comment out the end with `--`, I had to hijack the existing update statement. In SQL, you can update multiple columns at once by separating them with a comma.

So I crafted a payload to:

1. Close the bio string with `'`.
    
2. Inject a new column assignment: `, tokens=84828`.
    
3. Balance the syntax by adding a dummy assignment (`bio='`) to consume the final quote from the original query.

The final payload I put in the bio field was: `', tokens=84828, bio='`

This tricked the database into executing: `UPDATE user SET bio = '', tokens=84828, bio=' WHERE username = 'piners'`

It worked perfectly. The server treated the trailing `WHERE` clause as part of the string assigned to `bio`, keeping the syntax valid while updating my tokens to 84828.

![[Flag.png]]

## FLAG
```flag
SSof{Can_you_UPDATE_your_tokens}
```

---
## Conclusion

This challenge demonstrated that blocking stacked queries and comments is not enough to prevent SQL injection. By leveraging the syntax of `UPDATE` statements, I was able to inject additional column assignments within a single statement, modifying restricted data like the token balance.

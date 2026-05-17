
-------------------

#### Description

In a bustling city where innovation meets finance, Pico Bank has emerged as a beacon of cutting-edge security. Promising state-of-the-art protection for your assets, the bank claims its mobile application is impervious to all forms of cyber threats. Pico Bank’s tagline, "Security Beyond the Limits," echoes through its high-tech marketing campaigns, assuring users of their utmost safety. As a cybersecurity enthusiast, your mission is to test these bold claims. You’ve been hired by a secretive organization to put Pico Bank’s mobile app through a rigorous security assessment. The flag might be in one or more locations, and additional information reveals that a Pico Bank user’s credentials were leaked in an unusual way. Your task is to crack the username and password based on the following profile information: His name is Alex Johnson with the email johnson@picobank.com, Date of Birth: March 14, 1990, Last Transaction Amount: $345.67, Pet name: tricky, and Favorite Color: Blue. To perform this challenge, you can use any Android emulator. Some examples include [Genymotion Android Emulator](https://www.genymotion.com/product-desktop/download/) or [Android Studio](https://developer.android.com/studio). Access the Pico Bank Website [Pico Bank Website](http://amiable-citadel.picoctf.net:57765/) and download the application.

(I used waydroid as emulator for the android app)

![[Pasted image 20251113131740.png]]When we visit the website we see this app which we can download.
![[Pasted image 20251113131816.png]]Lets decompile it using apktool -d
![[Pasted image 20251113231324.png]]
Lets open all files using subl.

After exploring a bit we found some classes that sound interesting.
![[Pasted image 20251113231453.png]]
1. Login
2. OTP
3. Transaction

Lets see what we can find.
Lets start with the login class.
We can see some atributes
1. loginButton
2. passwordEditText
3. usernameEditText
![[Pasted image 20251113231614.png]]
Here we have the constructor of the class.
We can ignore the locals 0 and line 15.
Ele chama o constructor da superclasse, neste caso o AppCompactActivity.
Basicamente é:
```
class Login extends AppCompactActivity {

	public Login() {
	    super();
	}
}
```

![[Pasted image 20251113231857.png]]

Then we have the onCreate method, it translates so something like this.
![[Pasted image 20251113232601.png]]
```bash
protected void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	EdgeToEdge.enable(this);
	setContentView(R.layout.activity_login);
	View v1 = findViewId(R.id.main);
	
	usernameEditText = findViewId(R.id.username);
	passwordEditText = findViewId(R.id.password);
	loginButton = findViewById(R.id.loginBtn);
	loginButton.setOnClickListener(new Login$1(this));
}
```

We see that when we login, it creates a new Login$1 instance.
Lets look at the method onClick of the Login$1 class (inner class).
![[Pasted image 20251113234336.png]]
Lets take a closer look to the password and username checks

This gets the password (access$100 gets the password input)
![[Pasted image 20251113235545.png]]
This gets the username (access$000 gets the username input)
![[Pasted image 20251113235631.png]]

Then they compare values

They compare the const string johnson (v2) with v0, that we saw previouly it was the username.
![[Pasted image 20251113235749.png]]
Same with the password
![[Pasted image 20251113235824.png]]
We can see both the password and username are hard coded.
This translates to something like this.
```bash
public void onClick(View v) {
    String username = this.usernameEditText.getText().toString();
    String password = this.passwordEditText.getText().toString();

    if ("johnson".equals(username) && "tricky1990".equals(password)) {
        Intent intent = new Intent(this, OTP.class);
        this.startActivity(intent);
        this.finish();
    } else {
        Toast.makeText(this$0, "Incorrect credentials", Toast.LENGTH_SHORT).show();
    }
}
```
![[Pasted image 20251114000108.png]]
![[Pasted image 20251114000121.png]]
Ok we managed to login.
![[Pasted image 20251114000209.png]]
So we saw that if the login is successful, it doesnt go the cond_0, which is the incorrect creds toast prompt.
After correct creds we startActivity(intent), which is the class OTP.
Lets see it.


We can see 4 attributes to the class OTP.
1. all 4 digits of the otp code
2. RequestQueue
3. Submit button
![[Pasted image 20251114000350.png]]
We can see some "getters" for each otpDigit
![[Pasted image 20251114000457.png]]

Lets check this non sythentic method
![[Pasted image 20251114000550.png]]It verifies the OTP code.
It basically does this.
1. First creates the string containing the url server.
2. Then it creates the endpoint, which is /verify-otp
3. Then it gets the OTP code from R.string.otp_value
4. Checks with the user

Compares value of p1 (argument passed to verifyOTP) and v2 (hard coded OTP code)
![[Pasted image 20251114001003.png]]

Lets get that OTP code from resources strings.
![[Pasted image 20251114001120.png]]We got it.
The code is **9673**.

Its important to mention what happens when the OTP code is correct.
Basically it prepares a json to send to the server url.
Something like this:
```bash
{
 "otp" : "9673"
}
```
![[Pasted image 20251114001256.png]]

We can assume the server url is the one provided in the challenge.
Lets send a curl requests with that otp code.
![[Pasted image 20251114001524.png]]

We got one part of the flag.

```bash
s3cur3d_m0b1l3_l0g1n_56fd4e6b}
```

We also got an hint.
**The other part of the flag is hidden in the app**

Lets also put the correct otp code on the app to see what happens.
![[Pasted image 20251114001648.png]]![[Pasted image 20251114001655.png]]
We got a bunch of transactions.
We got another hint.
**Investigate the transaction history for unusual data**

Lets see Transactions class
![[Pasted image 20251114001922.png]]
![[Pasted image 20251114001937.png]]Nothing special, just the constructor and getters, something like this.
```bash
public class Transaction {
    private String amount;
    private String date;
    private boolean incoming;
    private String name;

    public Transaction(String name, String date, String amount, boolean incoming) {
        this.name = name;
        this.date = date;
        this.amount = amount;
        this.incoming = incoming;
    }

    public String getName() { return name; }
    public String getDate() { return date; }
    public String getAmount() { return amount; }
    public boolean isIncoming() { return incoming; }
}

```

After looking at the transactions, I noticed they were only 1's and 0's, it looks like binary.

I appended all binary amounts (from most recent to the oldest) and used a tool online to decode it.
![[Pasted image 20251114003037.png]]

Nice. We got the final part of the flag.

==FLAG==
```
picoCTF{1_l13d_4b0ut_b31ng_s3cur3d_m0b1l3_l0g1n_56fd4e6b}
```
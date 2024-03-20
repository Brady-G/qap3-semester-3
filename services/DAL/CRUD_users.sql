-- Add user
INSERT INTO public."users" (name, password, salt, email) VALUES ("Brady", "1676385165073720dbba34300363e637463cbc4acc9b2c9c009e41d21d5f7efca87cba49c9f7249344b32c77e66380d4de050f6ed2020dcaf5dbef1fca851395", "7a9876213ecac58e85e1646b9d4a0d5f", "example@example.com");

-- Get user by email
SELECT * FROM public."users" WHERE email = "example@example.com";

-- Change Password
UPDATE public."users" SET password = "648c967bbc4d69d08cb15219b52f38092ba213f140a8a358ac4aeefb3452a67cec1ba4150dcc40a9434585b6ce7fa3b0af4bdc8a7d97d8741c66649ed5caeaef", salt = "3e1f6e50cca1fbeb4d13491ce9919472" WHERE email = "example@example.com";

-- Change username
UPDATE public."users" SET name = "Brady Green" WHERE email = "example@example.com";

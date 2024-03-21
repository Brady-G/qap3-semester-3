### Setup

To start this project you first need to run `npm install`

After which you need to create a .env file in the root directory with the following

```
PG_HOST=localhost 
PG_USER=postgres
PG_PASS="password"
PG_PORT=1234

JWT_SECRET="supersecretpassword"
```

They all are required the first 4 are for connections to the database and are specific to your system.
The last 1 is the secret to use for encrypting the JWTs that are sent to users as part of authentication.
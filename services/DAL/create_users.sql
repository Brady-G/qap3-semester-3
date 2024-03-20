CREATE TABLE public."users"
(
    id serial NOT NULL,
    name character varying(256) NOT NULL,
    password character varying(256) NOT NULL,
    salt character varying(256) NOT NULL,
    email character varying(256) NOT NULL
);

-- Make it so only 1 email can be used per account
ALTER TABLE ONLY public.users
    ADD CONSTRAINT one_email UNIQUE (email);

-- Make id be the primary key
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
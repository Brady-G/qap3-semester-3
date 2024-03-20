CREATE TABLE public."projects"
(
    id serial NOT NULL,
    name character varying(256) NOT NULL,
    "user" integer NOT NULL
);

-- Make it so the id is the primary key
ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);

-- Make the user field a foreign key to the id from the users table
ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_users_projects FOREIGN KEY ("user") REFERENCES public.users(id);
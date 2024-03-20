-- Crate project
INSERT INTO public."projects" (name, "user") VALUES ("First Project", 1);

-- Update Project
UPDATE public."projects" SET "user" = 1, "name" = "New Project Name" WHERE id = 1;

-- Delete Project
DELETE public."projects" WHERE id = 1;

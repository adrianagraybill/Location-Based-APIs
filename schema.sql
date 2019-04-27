CREATE TABLE IF NOT EXISTS

students(
  id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  city VARCHAR(25),
  miles NUMERIC(3,1)
);

-- Create my comment

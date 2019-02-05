DROP DATABASE IF EXISTS todo_db;
CREATE DATABASE todo_db;

\c todo_db 

CREATE TABLE todo_tb (
  ID SERIAL PRIMARY KEY,
  title VARCHAR,
  tdate VARCHAR,
  done INTEGER
);

INSERT INTO todo_tb (title, tdate, done)
  VALUES ('This is example', '1397/08/08', 0);
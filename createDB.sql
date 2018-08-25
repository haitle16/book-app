DROP DATABASE books_app;
CREATE DATABASE books_app;
\c books_app;
CREATE TABLE IF NOT EXISTS
books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT
);
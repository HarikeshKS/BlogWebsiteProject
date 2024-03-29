CREATE TABLE blogs (
	id SERIAL PRIMARY KEY,
	title VARCHAR(100),
	content TEXT,
	author VARCHAR(100),
	date DATE
);

INSERT INTO blogs VALUES (1,'How to build a blog website?', 'Choose a platform like WordPress or Wix, pick a domain, design layout, add content, and launch!', 'Harikesh Kumar Sharma','01/03/2024');

INSERT INTO blogs (title, content, author, date) VALUES ();

UPDATE blogs SET title = $1, content = $2, author = $3 WHERE id = $4;

DELETE FROM blogs WHERE id = $1;
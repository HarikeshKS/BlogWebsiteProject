import express, { query } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

env.config();

// Adding the database connection
const db = new pg.Pool({
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
});
db.connect();

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET all posts
app.get("/posts", async (req, res) => {
  // Get all the posts from the database
  try {
    const results = await db.query("SELECT * FROM blogs");
    console.log(results.rows);
    res.json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "No posts found" });
  }
});

// GET a specific post by id
app.get("/posts/:id", async (req, res) => {
  // get specific post by id from the database
  try {
    const results = await db.query("SELECT * FROM blogs WHERE id = $1 ", [
      req.params.id,
    ]);
    console.log(results.rows[0]);
    res.json(results.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Post not found" });
  }
});

// POST a new post
app.post("/posts", async (req, res) => {
  try {
    const date = new Date();
    const addBlog = await db.query(
      "INSERT INTO blogs (title, content, author, date) VALUES ($1,$2,$3,$4) RETURNING *",
      [req.body.title, req.body.content, req.body.author, date]
    );
    console.log(addBlog.rows[0]);
    res.status(201).json(addBlog.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// PATCH a post when you just want to update one parameter
app.patch("/posts/:id", async (req, res) => {
  console.log(req.body.content);
  try {
    const editedPost = await db.query(
      "UPDATE blogs SET title = $1, content = $2, author = $3 WHERE id = $4 RETURNING *",
      [req.body.title, req.body.content, req.body.author, req.params.id]
    );
    res.json(editedPost.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Post not found" });
  }
});

// DELETE a specific post by providing the post id
app.delete("/posts/:id", async (req, res) => {
  try {
    const deletePost = await db.query("DELETE FROM blogs WHERE id = $1", [
      req.params.id,
    ]);
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(404).json({ message: "Post not found" });
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});

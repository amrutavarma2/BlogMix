import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogsFilePath = path.join(__dirname, "blogs.json");

function loadBlogs() {
  if (!fs.existsSync(blogsFilePath)) return [];
  const data = fs.readFileSync(blogsFilePath, "utf-8");
  return JSON.parse(data);
}

function saveBlogs(blogs) {
  fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));
}

function getBlogs() {
  try {
    const data = fs.readFileSync(blogsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading blogs:", error);
    return [];
  }
}

const app = express();
const port = 3000;

let users = [
  { email: "test@example.com", password: "123456", name: "Test User", contact: "9999999999" }
];

app.use(express.static(path.join(__dirname, "FrontEnd")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "FrontEnd"));

let blogs = loadBlogs();

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signin", (req, res) => {
  const message = req.query.message || "";
  res.render("signin", { message });
});

app.get("/register", (req, res) => {
  const email = req.query.email || "";
  res.render("register", { email });
});

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (user) {
    if (user.password === password) {
      req.session.user = user.email;
      res.redirect("/blog");
    } else {
      res.redirect("/signin?message=Invalid+password.+Please+try+again.");
    }
  } else {
    res.redirect("/register?email=" + encodeURIComponent(email));
  }
});

app.post("/register", (req, res) => {
  const { name, contact, email, password } = req.body;
  const alreadyExists = users.find((u) => u.email === email);

  if (!alreadyExists) {
    users.push({ name, contact, email, password });
    req.session.user = email;
    res.redirect("/blog");
  } else {
    res.redirect("/signin?message=User+already+exists.+Please+sign+in.");
  }
});

app.get("/blog", (req, res) => {
  res.redirect("/search?q=");
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", (req, res) => {
  const { title, author, content } = req.body;
  const authorEmail = req.session.user;

  if (!title || !author || !content) {
    return res.status(400).send("All fields are required.");
  }

  const newBlog = {
    id: Date.now(),
    title,
    author,
    content
  };

  blogs.push(newBlog);
  saveBlogs(blogs);

  res.redirect("/search?q=");
});

app.get("/search", (req, res) => {
  const query = req.query.q ? req.query.q.toLowerCase() : '';
  const blogs = loadBlogs();
  const results = blogs.filter(
    blog =>
      blog.title.toLowerCase().includes(query) ||
      blog.author.toLowerCase().includes(query)
  );
  res.render("searchResults", { blogs: results, query: req.query.q || "", sessionUser: req.session.user });
});

app.post("/delete/:id", (req, res) => {
  const blogIndex = blogs.findIndex(b => String(b.id) === req.params.id);
  if (blogIndex === -1 || blogs[blogIndex].authorEmail !== req.session.user) {
    return res.status(403).send("Unauthorized");
  }
  blogs.splice(blogIndex, 1);
  saveBlogs(blogs);
  res.redirect("/search?q=");
});

app.get("/blog/:id", (req, res) => {
  const id = req.params.id;
  const blogs = getBlogs();
  const blog = blogs.find(b => String(b.id) === id);

  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  res.render("blog", { blog });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

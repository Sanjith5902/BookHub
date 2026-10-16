
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const {
  addBook,
  findBook,
  updateBook,
  deleteBook,
  BorrowBook,
  ReturnBook,
  Adduser,
  loginuser,
} = require("./controller.js");

require("./db.js");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to library");
});

// User routes
app.post("/login", loginuser);
app.post("/register", Adduser);

// Book routes
app.post("/addbook", addBook);
app.get("/findbook", findBook);
app.put("/updatebook/:id", updateBook);
app.delete("/deletebook/:id", deleteBook);

// Borrow and return routes
app.post("/borrowbook/:id", BorrowBook);
app.put("/returnbook/:id", ReturnBook);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

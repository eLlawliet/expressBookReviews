const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username." });
  }
  
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists." });
  }
  
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});
  
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/booksdb');
    let readable_book = JSON.stringify(response.data, null, 2);
    return res.status(200).send(readable_book);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred.", error });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred.", error });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const authorName = req.params.author;
    const response = await axios.get(`http://localhost:5000/books/author/${authorName}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred.", error });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const titleBooks = req.params.title;
    const response = await axios.get(`http://localhost:5000/books/title/${titleBooks}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred.", error });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  
  if(books[isbn] && books[isbn].reviews){
    return res.status(200).json(books[isbn].reviews)
  } 
});

module.exports.general = public_users;

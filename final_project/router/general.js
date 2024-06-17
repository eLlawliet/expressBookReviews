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
public_users.get('/',function (req, res) {
  //Write your code here
  let readable_book = JSON.stringify({books}, null, 2)
  return res.status(200).send(readable_book);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  let booksByAuthor = {};

  for (let id in books) {
    if (books[id].author === authorName) {
      booksByAuthor[id] = books[id];
    }
  }
  return res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleBooks = req.params.title;
  let booksByTitle = {}
  
  for (let id in books) {
    if (books[id].title === titleBooks){
      booksByTitle[id] = books[id]
    }
  }
  return res.status(200).json(booksByTitle)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  
  if(books[isbn] && books[isbn].reviews){
    return res.status(200).json(books[isbn].reviews)
  } 
});

module.exports.general = public_users;

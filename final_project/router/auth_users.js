const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (!username || username.trim() === '') {
    return false;
  }
  if (username.length < 3 || username.length > 16) {
    return false;
  }
  const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!validUsernameRegex.test(username)) {
    return false;
  }
  return true;
};

const authenticatedUser = (username,password)=>{
  const user = users.find(user => user.username === username);
  if (user && user.password === password) {
    return true;
  }
  return false
}

regd_users.post("/login", (req,res) => {
  const jwtS = '9jsdagg0912kdi';
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, jwtS, { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful.", token});
  } else {
    return res.status(401).json({ message: "Invalid username or password." });
  }
});

regd_users.put("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.userId;

  let book;
  for (let key in books) {
    if (key === isbn) {
      book = books[key];
      break;
    }
  }

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  let userReview = book.reviews.find(r => r.username === username);
  if (userReview) {
    userReview.review = review;
  } else {
    book.reviews.push({ username, review });
  }

  return res.status(200).json({ message: "Review updated successfully." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.userId; // assuming this is set from the JWT verification middleware

  // Find the book entry in the database
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Filter out the review by the current user
  const initialReviewCount = book.reviews.length;
  book.reviews = book.reviews.filter(review => review.username !== username);

  // Check if a review was deleted
  if (initialReviewCount === book.reviews.length) {
    return res.status(404).json({ message: "Review not found." });
  }

  return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

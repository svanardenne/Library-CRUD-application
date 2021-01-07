var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', (req, res) => {
  throw new Error();
    res.redirect('/books');
});

router.get('/books', async (req, res) => {
  const books = await Book.findAll();
  res.render('index', {books});
});

router.get('/books/new', (req, res) => {
  res.render('new-book');
});

router.post('/books/new', async (req, res) => {
  let book;
  console.log(req.body)
  try {
    book = await Book.create(req.body);
    res.redirect(`/books/${book.id}`);
  } catch(error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await book.build(req.body);
      res.render("books/new", {book, errors: error.errors});
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
});


module.exports = router;

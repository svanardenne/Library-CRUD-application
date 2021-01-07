var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', (req, res) => {
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
  try {
    book = await Book.create(req.body);
    res.redirect(`/books/`);
  } catch(error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("new-book", {book, errors: error.errors});
    } else {
      throw error;
    }
  }
});

router.get('/books/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', {id: req.params.id, book});
});

router.post('/books/:id', async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  } catch(error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("update-book", {book, errors: error.errors});
    } else {
      throw error;
    }
  }
});

router.post('/books/:id/delete', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  try {
    if(book) {
      await book.destroy();
      res.redirect('/books');
    } else {
      res.sendStatus(404);
    }
  } catch(error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("update-book", {book, errors: error.errors});
    } else {
      throw error;
    }
  }
});


module.exports = router;

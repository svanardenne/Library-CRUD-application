var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const Op = require('sequelize').Op;

// Create ongoing variable to be updated by search route
let searchValue = '';

// Handles asynchronous functions
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
}

// GET Home page and redirect
router.get('/', (req, res) => {
    res.redirect('/books/?page=0');
});

// Main book list
router.get('/books', asyncHandler(async (req, res) => {
  if(searchValue === '') {
    const {count, rows} = await Book.findAndCountAll({ // Database search method used for both fetching data and pagination
      offset: parseInt(req.query.page) * 8,
      limit: 8,
    });
    const pagination = count / 8;
    res.render('index', {count, rows, pagination});
  } else {
    const {count, rows} = await Book.findAndCountAll({ // Uses previous search value instead of always loading a new page
      offset: parseInt(req.query.page) * 8,
      limit: 8,
      where: {
        [Op.or]: [
          {title: {[Op.like]: `%${searchValue}%`}},
          {author: {[Op.like]: `%${searchValue}%`}},
          {genre: {[Op.like]: `%${searchValue}%`}},
          {year: {[Op.like]: `%${searchValue}%`}},
        ]
      }
    });
    const pagination = count / 8;
    res.render('index', {count, rows, pagination});
  }
}));

// Search route
router.post('/books', asyncHandler(async (req, res) => {
  const {count, rows} = await Book.findAndCountAll({
    offset: parseInt(req.query.page) * 8,
    limit: 8,
    where: {
      [Op.or]: [
        {title: {[Op.like]: `%${req.body.query}%`}},
        {author: {[Op.like]: `%${req.body.query}%`}},
        {genre: {[Op.like]: `%${req.body.query}%`}},
        {year: {[Op.like]: `%${req.body.query}%`}},
      ]
    }
  });
  const pagination = count / 8;
  searchValue = req.body.query;
  res.render('index', {count, rows, pagination});
}));

// New book form page
router.get('/books/new', (req, res) => {
  res.render('new-book');
});

// New book submit
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect(`/books/?page=0`);
  } catch(error) {
    if(error.name === "SequelizeValidationError") { // checking the error type
      book = await Book.build(req.body);
      res.render("new-book", {book, errors: error.errors});
    } else {
      throw error;
    }
  }
}));

// Book Update and Delete Page
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', {id: req.params.id, book});
}));

// Book Update submit
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books/?page=0");
    } else {
      res.sendStatus(404);
    }
  } catch(error) {
    if(error.name === "SequelizeValidationError") { // checking the error type
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", {book, errors: error.errors});
    } else {
      throw error;
    }
  }
}));

// Book Delete submit
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
    if(book) {
      await book.destroy();
      res.redirect('/books/?page=0');
    } else {
      res.sendStatus(404);
    }
}));

module.exports = router;
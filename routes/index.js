var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', (async (req, res, next) => {
  // res.render('index', { title: 'Express' });
    const books = await Book.findAll();
    const err = new Error();
    next(err);
}));

module.exports = router;

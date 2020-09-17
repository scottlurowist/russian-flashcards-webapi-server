

// Express docs: http://expressjs.com/en/api.html
const express = require('express');

// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport');

// pull in Mongoose model for examples
//const Example = require('../models/example')
const Flashcard = require('../models/flashcard');

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors');

const httpStatusCodes = require('../../lib/http-status-codes');

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404;

// Use this function when we want to create a new flashcard but it already exists.
const handleDuplicateFlashcard = customErrors.handleDuplicateFlashcardError;

// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership;

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields');

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false });

// instantiate a router (mini app that only handles routes)
const router = express.Router();


// INDEX
// GET /flashcards
router.get('/flashcards', requireToken, async (req, res, next) => {

  try {

    const flashcards = await Flashcard.find();

    const mappedFlashcards = flashcards.map(flashcards => flashcards.toObject());
  
    res.status(httpStatusCodes.success.ok)
       .json({ flashcard: mappedFlashcards });
  }
  catch(err) {
    // Pass the error to our error handler middleware.
    next(err);
  }
});


// SHOW
// GET /flashcards/5a7db6c74d55bc51bdf39793
router.get('/flashcards/:id', requireToken, async (req, res, next) => {

  try {
    // req.params.id will be set based on the `:id` in the route
    const flashcard = await Flashcard.findById(req.params.id);

    // What if there is no flashcard?
    handle404(flashcard);

    res.status(httpStatusCodes.success.ok)
      .json({ flashcard: flashcard.toObject() });    
  }
  catch(err) {
    // Pass the error to our error handler middleware.    
    next(err);
  }
});


// CREATE
// POST /flashcards
router.post('/flashcards', requireToken, async (req, res, next) => {

  // set owner of new example to be current user
  req.body.flashcard.owner = req.user.id;

  let doesFlashcardExist;

  try {
    // Does the flashcard already exist? If so, don't duplicate it.
    doesFlashcardExist = await Flashcard.countDocuments(req.body.flashcard);

    if (doesFlashcardExist) {
      handleDuplicateFlashcard();
    }

    const flashcard = await Flashcard.create(req.body.flashcard);

    res.status(httpStatusCodes.success.created)
       .json({ flashcard: flashcard.toObject() });
  }
  catch(err) {
    // Pass the error to our error handler middleware.    
    next(err);
  }
});


// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/flashcards/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.flashcard.owner;

  Flashcard.findById(req.params.id)
    .then(handle404)
    .then(flashcard => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, flashcard)

      // pass the result of Mongoose's `.update` to the next `.then`
      return flashcard.updateOne(req.body.flashcard)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})


module.exports = router;

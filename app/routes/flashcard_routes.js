

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



// CREATE
// POST /flashcards
router.post('/flashcards', requireToken, async (req, res, next) => {

  // set owner of new example to be current user
  req.body.flashcard.flashcardOwner = req.user.id;

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
    next(err);
  }
});


module.exports = router;

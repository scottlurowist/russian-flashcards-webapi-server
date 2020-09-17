const mongoose = require('mongoose')

const flashcardSchema = new mongoose.Schema({
  englishWord: {
    type: String,
    required: true
  },
  russianWord: {
    type: String,
    required: true
  },
  flashcardOwner: {
    // References use the type ObjectId
    type: mongoose.Schema.Types.ObjectId,
    // the name of the model to which they refer
    ref: 'User'
  }
}, {
  timestamps: true,
})

module.exports = mongoose.model('Flashcard', userSchema)

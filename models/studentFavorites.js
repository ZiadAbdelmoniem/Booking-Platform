// models/studentFavorites.js

const mongoose = require('mongoose');

const studentFavoritesSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    required: true,
  },
  favoriteTutors: [
    {
      tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TutorProfile',
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
    },
  ],
});

const StudentFavorites = mongoose.model('student_favorites', studentFavoritesSchema);

module.exports = StudentFavorites;

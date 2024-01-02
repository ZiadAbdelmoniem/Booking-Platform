// models/tutorProfile.js

const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  subjects: String,
  grade_level: [String] ,
  slots: {
    Sunday: [String],
    Monday: [String],
    Tuesday: [String],
    Wednesday: [String],
    Thursday: [String],
    Friday: [String],
    Saturday: [String],
  },
});

const TutorProfile = mongoose.model('tutor_profile', tutorProfileSchema);

module.exports = TutorProfile;

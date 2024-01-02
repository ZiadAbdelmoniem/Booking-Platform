// models/studentProfile.js

const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  grade_level: {
    type: Number,
  },
  subjects: [String],
  slots: {
    Sunday: [String],
    Monday: [String],
    Tuesday: [String],
    Wednesday: [String],
    Thursday: [String],
    Friday: [String],
    Saturday: [String],
}
  // Additional fields based on your requirements
});

const StudentProfile = mongoose.model('student_profile', studentProfileSchema);

module.exports = StudentProfile;

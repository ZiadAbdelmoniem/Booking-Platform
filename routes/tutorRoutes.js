// routes/tutorRoutes.js

const express = require('express');
const router = express.Router();
const TutorProfile = require('../models/tutorProfile');

// Create a new tutor profile
router.post('/tutors', async (req, res) => {
  try {
    const tutor = await TutorProfile.create(req.body);
    res.json(tutor);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all tutor profiles
router.get('/tutors', async (req, res) => {
  try {
    const tutors = await TutorProfile.find();
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific tutor profile by ID
router.get('/tutors/:id', async (req, res) => {
  try {
    const tutor = await TutorProfile.findById(req.params.id);
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }
    res.json(tutor);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

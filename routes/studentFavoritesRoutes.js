// routes/studentFavoritesRoutes.js

const express = require('express');
const router = express.Router();
const StudentFavorites = require('../models/studentFavorites');

// Get all student favorites
router.get('/student-favorites', async (req, res) => {
  try {
    const studentFavorites = await StudentFavorites.find();
    res.json(studentFavorites);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get student favorites by ID
router.get('/student-favorites/:id', async (req, res) => {
  try {
    const studentFavorite = await StudentFavorites.findById(req.params.id);
    if (!studentFavorite) {
      return res.status(404).json({ error: 'Student favorites not found' });
    }
    res.json(studentFavorite);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new student favorite
router.post('/student-favorites', async (req, res) => {
  try {
    const { studentId, tutors } = req.body;

    // Assuming tutors is an array of objects with tutorId and score
    const newStudentFavorite = await StudentFavorites.create({
      studentId,
      tutors,
    });

    res.status(201).json(newStudentFavorite);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

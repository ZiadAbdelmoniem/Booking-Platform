// routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/studentProfile');
const TutorProfile = require('../models/tutorProfile');
const StudentFavorites = require('../models/studentFavorites');
const { extractInformationFromUserPrompt, generateTutorList0, generateTutorList, generateFavoriteList } = require('../chatGPTService');

// // Create a new student profile
// router.post('/students', async (req, res) => {
//   try {
//     const student = await StudentProfile.create(req.body);
//     res.json(student);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Get all student profiles
// router.get('/students', async (req, res) => {
//   try {
//     const students = await StudentProfile.find();
//     res.json(students);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Get a specific student profile by ID
// router.get('/students/:id', async (req, res) => {
//   try {
//     const student = await StudentProfile.findById(req.params.id);
//     if (!student) {
//       return res.status(404).json({ error: 'Student not found' });
//     }
//     res.json(student);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// this endpoint recieves in it's body the prompt where a student asks for a tutor for a certain grade, subject and certain time slots and then the endpoint replies with the list of tutors with scores that reflect how much does this tutor fit the student
router.get('/gpt', async (req, res) => {
  try {
    const { userPrompt } = req.query;

    // Use ChatGPT to generate a tutor list based on user preferences and available tutors
    const generatedTutorList0 = await generateTutorList0(userPrompt);
    const generatedTutorList = await generateTutorList(generatedTutorList0,userPrompt);
    console.log(generateTutorList);

    res.json({ generatedTutorList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/gpt/:id', async (req, res) => {
  try {
    const { userPrompt } = req.body;

    const student = await StudentProfile.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Use ChatGPT to generate a tutor list based on user preferences and available tutors
    const generatedFavoriteList = await generateFavoriteList(userPrompt);
    console.log(generatedFavoriteList);

    const tutorScorePairs = generatedFavoriteList.split(';').map(pair => pair.split(','));

    // Get the list of tutor names from tutor-score pairs
    const tutorNames = tutorScorePairs.map(pair => pair[0]);

    // Use a single database query to find all tutors with the specified names
    const tutors = await TutorProfile.find({ name: { $in: tutorNames } });

    // Create a map for efficient lookup of tutors by name
    const tutorsMap = new Map(tutors.map(tutor => [tutor.name, tutor]));

    // Create an array to store favorite tutors with their scores
    const favoriteTutors = [];
    console.log(tutorScorePairs);
    console.log(tutorScorePairs.length);

    // Flag to check if at least one tutor with a non-zero score is found
    let hasNonZeroScore = false;

    // Iterate through the tutor-score pairs
    for (const [tutorName, score] of tutorScorePairs) {
      // Use the tutorsMap for efficient lookup of the tutor document
      const tutor = tutorsMap.get(tutorName);

      // If the tutor is found, add them to the favoriteTutors array
      if (tutor) {
        const scoreValue = parseFloat(score);

        if (scoreValue > 0) {
          favoriteTutors.push({
            tutor: tutor._id,
            score: scoreValue,
          });

          // Set the flag to true if a tutor with a non-zero score is found
          hasNonZeroScore = true;
        }
      }
    }

    // Check if at least one tutor with a non-zero score is found
    if (hasNonZeroScore) {
      // Create a new StudentFavorites document with the student and favorite tutors
      const newStudentFavorite = await StudentFavorites.create({
        student: student,
        favoriteTutors: favoriteTutors,
      });
      console.log(newStudentFavorite);

      res.status(201).json(newStudentFavorite);
    } else {
      // If no suitable tutors are found, return a response of 0
      res.status(200).json({ response: 0 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.post('/gpt/:id', async (req, res) => {
//   try {
//     const { userPrompt } = req.body;

//     const student = await StudentProfile.findById(req.params.id);
//     if (!student) {
//       return res.status(404).json({ error: 'Student not found' });
//     }

//     // Use ChatGPT to generate a tutor list based on user preferences and available tutors
//     const generatedFavoriteList = await generateFavoriteList(userPrompt);
//     console.log(generatedFavoriteList);

//     const tutorScorePairs = generatedFavoriteList.split(';').map(pair => pair.split(','));

//     // Get the list of tutor names from tutor-score pairs
//     const tutorNames = tutorScorePairs.map(pair => pair[0]);

//     // Use a single database query to find all tutors with the specified names
//     const tutors = await TutorProfile.find({ name: { $in: tutorNames } });

//     // Create a map for efficient lookup of tutors by name
//     const tutorsMap = new Map(tutors.map(tutor => [tutor.name, tutor]));

//     // Create an array to store favorite tutors with their scores
//     const favoriteTutors = [];
//     console.log(tutorScorePairs);
//     console.log(tutorScorePairs.length);


//     // Iterate through the tutor-score pairs
//     for (const [tutorName, score] of tutorScorePairs) {
//       // Use the tutorsMap for efficient lookup of the tutor document
//       const tutor = tutorsMap.get(tutorName);

//       // If the tutor is found, add them to the favoriteTutors array
//       if (tutor) {
//         favoriteTutors.push({
//           tutor: tutor._id,
//           score: parseFloat(score), // Assuming the score is a string and needs to be converted to a number
//         });
//       }
//     }

//     // Create a new StudentFavorites document with the student and favorite tutors
//     const newStudentFavorite = await StudentFavorites.create({
//       student: student,
//       favoriteTutors: favoriteTutors,
//     });
//     console.log(newStudentFavorite);

//     res.status(201).json(newStudentFavorite);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

module.exports = router;

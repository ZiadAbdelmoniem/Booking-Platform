const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const tutorRoutes = require('./routes/tutorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const studentFavoritesRoutes = require('./routes/studentFavoritesRoutes');
const cors = require('cors');

const app = express();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:KCDEFGCQI6iv3ILG@cluster0.lrqrs12.mongodb.net/?retryWrites=true&w=majority';
const PORT = process.env.PORT || 3000;

app.use(cors());

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

mongoose.connect(MONGODB_URI, { useUnifiedTopology: true });

app.use(bodyParser.json());

app.use('/api/tutor', tutorRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/student', studentFavoritesRoutes);

// Serve React static files
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

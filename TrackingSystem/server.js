const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const scooterRoutes = require('./routes/scooterRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use('/api/scooters', scooterRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/bikesetu')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('Connection Error:', err));

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const mongoose = require('mongoose');

// Define the scooter schema 
const scooterSchema = new mongoose.Schema({
    scooterId: { type: String, required: true, unique: true },
    manufacturer: { type: String, required: true },
    status: {
        type: String,
        enum: ['At Manufacturer', 'At Yard', 'At Franchisee', 'With Customer'],
        default: 'At Manufacturer'
    },
    currentLocation: { type: String, default: 'Manufacturer' }, // Track the current location
    updatedAt: { type: Date, default: Date.now } // Last update time
});

const Scooter = mongoose.model('Scooter', scooterSchema);

module.exports = Scooter;

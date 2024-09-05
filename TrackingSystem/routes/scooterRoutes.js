const express = require('express');
const Scooter = require('../models/Scooter');
const router = express.Router();

// Create a new scooter
router.post('/create', async (req, res) => {
    try {
        const { scooterId, manufacturer } = req.body;
        const scooter = new Scooter({ scooterId, manufacturer });
        await scooter.save();
        res.status(201).json({ message: 'Scooter created successfully', scooter });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update scooter's status and location
router.put('/update/:scooterId', async (req, res) => {
    try {
        const { scooterId } = req.params;
        const { status, currentLocation } = req.body;

        const scooter = await Scooter.findOneAndUpdate(
            { scooterId },
            { status, currentLocation, updatedAt: Date.now() },
            { new: true }
        );

        if (!scooter) return res.status(404).json({ message: 'Scooter not found' });

        res.json({ message: 'Scooter updated successfully', scooter });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get scooter's current status
router.get('/:scooterId', async (req, res) => {
    try {
        const scooter = await Scooter.findOne({ scooterId: req.params.scooterId });

        if (!scooter) return res.status(404).json({ message: 'Scooter not found' });

        res.json(scooter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

const router = require('express').Router(); 
let Observation = require('../models/Observation');

// GET request to fetch all observations
router.route('/').get(async (req, res) => {
  try {
    const observations = await Observation.find().sort({ timestamp: -1 });
    res.status(200).json(observations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST request to save a new observation
router.route('/').post(async (req, res) => {
  const { auditorName, auditeeName, location, observation, category, startDate, endDate } = req.body;

  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }

  try {
    const newObservation = new Observation({
      auditorName,
      auditeeName,
      location, // Save location
      observation,
      category,
      startDate,
      endDate,
    });

    await newObservation.save();
    res.status(201).json({ msg: 'Observation saved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

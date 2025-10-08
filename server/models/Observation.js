const mongoose = require('mongoose');

const ObservationSchema = new mongoose.Schema({
    auditorName: { type: String, required: true },
    auditeeName: { type: String, required: true },
    location: { type: String, required: true }, // New field added
    observation: { type: String, required: true },
    category: { type: String, default: 'On-plan' },
    startDate: { type: Date },
    endDate: { type: Date },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Observation', ObservationSchema);

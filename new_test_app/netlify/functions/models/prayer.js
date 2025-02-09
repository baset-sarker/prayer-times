const mongoose = require('mongoose');
// import mongoose from 'mongoose';

const prayerSchema = new mongoose.Schema({
    fajr: String,
    fajr_added_time: Number,
    duhr: String,
    duhr_added_time: Number,
    asr: String,
    asr_added_time: Number,
    magrib: String,
    magrib_added_time: Number,
    isha: String,
    isha_added_time: Number,
    hadis1: String,
    hadis2: String,
    hadis3: String,
    hadis4: String,
    hadis5: String,
    notice_head_line: String,
    notice_first_line: String,
    notice_second_line: String,
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If you want to associate prayers with users
});

const Prayer = mongoose.model('Prayer', prayerSchema);

// module.exports = { Prayer }; // Export the Prayer model
export default Prayer; // Export the Prayer model
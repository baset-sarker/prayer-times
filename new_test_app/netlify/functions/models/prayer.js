// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const prayerSchema = new mongoose.Schema({
    fajr: String,
    fajr_added_time: { type: Number, default: 0 },
    fajr_api: String,
    sunrise: String,
    duhr: String,
    duhr_added_time: { type: Number, default: 0 },
    duhr_api: String,
    jummah: String,
    asr: String,
    asr_added_time: { type: Number, default: 0 },
    asr_api: String,
    magrib: String,
    magrib_added_time: { type: Number, default: 0 },
    magrib_api: String,
    isha: String,
    isha_added_time: { type: Number, default: 0 },
    isha_api: String,
    tarawih:String,
    hadis1: String,
    hadis2: String,
    hadis3: String,
    hadis4: String,
    hadis5: String,
    notice_head_line: String,
    notice_first_line: String,
    notice_second_line: String,
    updated_at: String,
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If you want to associate prayers with users
});


export const Prayer = mongoose.model('Prayer', prayerSchema);
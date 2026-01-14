

import {Prayer} from './models/prayer.js';
import {fetchIslamicFinderData, fetchData, convert24to12,getLocalPryayerTime} from './helpers/helper_func.js';
import dotenv from 'dotenv'; // Load environment variables from .env file
import mongoose from 'mongoose';
dotenv.config(); // Load environment variables from .env file
const MONGODB_URI = process.env.MONGODB_URI ; // Replace with your MongoDB URI


// MongoDB Connection
mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB Connection Error:', err));


export const handler = async (event, context) => {
    console.log("Running daily task...");

    try {

        const prayer = await Prayer.findById("67a6a7f3910f6b920a5d4254");
        console.log("Previous prayer",prayer);

        // const api_data = await fetchIslamicFinderData();
        // prayer.fajr_api = convert24to12(api_data.results.Fajr)
        // prayer.sunrise = convert24to12(api_data.results.Duha)
        // prayer.duhr_api = convert24to12(api_data.results.Dhuhr)
        // prayer.asr_api = convert24to12(api_data.results.Asr)
        // prayer.magrib_api = convert24to12(api_data.results.Maghrib)
        // prayer.isha_api = convert24to12(api_data.results.Isha)

        // get data from PrayerTime.js
        const times = getLocalPryayerTime();
        prayer.fajr_api = convert24to12(times.fajr);
        prayer.sunrise = convert24to12(times.sunrise);
        prayer.duhr_api = convert24to12(times.dhuhr);
        prayer.asr_api = convert24to12(times.asr);
        prayer.magrib_api = convert24to12(times.maghrib);
        prayer.isha_api = convert24to12(times.isha);

        // allaathan api data
        // const api_data = await fetchData();
        // prayer.fajr_api = convert24to12(api_data.data.timings.Fajr)
        // prayer.duhr_api = convert24to12(api_data.data.timings.Dhuhr)
        // prayer.asr_api = convert24to12(api_data.data.timings.Asr)
        // prayer.magrib_api = convert24to12(api_data.data.timings.Maghrib)
        // prayer.isha_api = convert24to12(api_data.data.timings.Isha)
        // prayer.sunrise = convert24to12(api_data.data.timings.Sunrise)



        console.log("Updated prayer",prayer);


        // nee to update the time 
        prayer.updated_at = new Date();
        await prayer.save();

    } catch (err) {
        console.error("Error updating prayer:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error updating prayer" }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Daily task executed successfully" }),
    };
}; 


// await handler();
// _id
// 67a6a7f3910f6b920a5d4254
// fajr_api
// "5:24 AM"
// fajr_added_time
// 35
// fajr
// "05:59 AM"
// sunrise
// "6:44 AM"
// duhr_api
// "12:13 PM"
// duhr_added_time
// 46
// duhr
// "01:00 PM"
// asr_api
// "3:12 PM"
// asr_added_time
// 20
// magrib_api
// "5:43 PM"
// magrib_added_time
// 20
// magrib
// "06:00 PM"
// isha_api
// "7:03 PM"
// isha_added_time
// 0
// isha
// "07:03 PM"
// hadis1
// "“Those people who show no mercy will receive no mercy from Allah.”  [M…"
// hadis2
// "“Make things easier, do not make things more difficult, spread the gla…"
// hadis3
// "“Those who are the means for good deeds are the same as those who perf…"
// hadis5
// "“Not one of you can (truly) believe if you do not want for your (belie…"
// hadis4
// "Allah is pleased with the task performed by you in which both the acti…"
// asr
// "03:32 PM"
// jummah
// "1:15 pm "
// notice_first_line
// ""
// notice_head_line
// ""
// notice_second_line
// ""
// tarawih
// "7:30 PM"
// updated_at
// ""
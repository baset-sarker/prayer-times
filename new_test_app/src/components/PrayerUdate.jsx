// React (PrayerUpdate.jsx - with Bootstrap)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function PrayerUpdate({ token }) {
  // ... (state, useEffect, handleChange as before)

  prayerId = '67a6a7f3910f6b920a5d4254'; // Hardcoded prayer ID
  prayer = {    }
    useEffect(() => {
        const fetchPrayer = async () => {
        try {
            // const serverURL = import.meta.env.VITE_SERVER_URL; // Get the URL
            // const response = await axios.get(`${serverURL}/api/prayer/${prayerId}`, {
            const response = await axios.get(`/api/prayer/${prayerId}`, {
            headers: { Authorization: `Bearer ${token}` },
            });
            setPrayer(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching prayer login first');
        }
        };
    
        fetchPrayer();
    }, [prayerId, token]);

  return (
    <div className="container"> {/* Add a container for Bootstrap layout */}
      <h2>Update Prayer</h2> {/* Add a heading */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3"> {/* Use Bootstrap form groups for better spacing */}
          <label htmlFor="fajr_api" className="form-label">Fajr API</label>
          <input type="text" className="form-control" id="fajr_api" name="fajr_api" value={prayer.fajr_api} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="fajr_added_time" className="form-label">Fajr Added Time</label>
          <input type="text" className="form-control" id="fajr_added_time" name="fajr_added_time" value={prayer.fajr_added_time} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="fajr" className="form-label">Fajr</label>
          <input type="text" className="form-control" id="fajr" name="fajr" value={prayer.fajr} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="sunrise" className="form-label">Sunrise</label>
          <input type="text" className="form-control" id="sunrise" name="sunrise" value={prayer.sunrise} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="duhr_api" className="form-label">Dhuhr API</label>
          <input type="text" className="form-control" id="duhr_api" name="duhr_api" value={prayer.duhr_api} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="duhr_added_time" className="form-label">Dhuhr Added Time</label>
          <input type="text" className="form-control" id="duhr_added_time" name="duhr_added_time" value={prayer.duhr_added_time} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="duhr" className="form-label">Dhuhr</label>
          <input type="text" className="form-control" id="duhr" name="duhr" value={prayer.duhr} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="dummah" className="form-label">Dummah</label>
          <input type="text" className="form-control" id="dummah" name="dummah" value={prayer.dummah} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="asr_api" className="form-label">Asr API</label>
          <input type="text" className="form-control" id="asr_api" name="asr_api" value={prayer.asr_api} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="asr_added_time" className="form-label">Asr Added Time</label>
          <input type="text" className="form-control" id="asr_added_time" name="asr_added_time" value={prayer.asr_added_time} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="asr" className="form-label">Asr</label>
          <input type="text" className="form-control" id="asr" name="asr" value={prayer.asr} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="magrib_api" className="form-label">Magrib API</label>
          <input type="text" className="form-control" id="magrib_api" name="magrib_api" value={prayer.magrib_api} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="magrib_added_time" className="form-label">Magrib Added Time</label>
          <input type="text" className="form-control" id="magrib_added_time" name="magrib_added_time" value={prayer.magrib_added_time} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="magrib" className="form-label">Magrib</label>
          <input type="text" className="form-control" id="magrib" name="magrib" value={prayer.magrib} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="isha_api" className="form-label">Isha API</label>
          <input type="text" className="form-control" id="isha_api" name="isha_api" value={prayer.isha_api} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="isha_added_time" className="form-label">Isha Added Time</label>
          <input type="text" className="form-control" id="isha_added_time" name="isha_added_time" value={prayer.isha_added_time} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="isha" className="form-label">Isha</label>
          <input type="text" className="form-control" id="isha" name="isha" value={prayer.isha} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="hadis1" className="form-label">Hadis 1</label>
          <input type="text" className="form-control" id="hadis1" name="hadis1" value={prayer.hadis1} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="hadis2" className="form-label">Hadis 2</label>
          <input type="text" className="form-control" id="hadis2" name="hadis2" value={prayer.hadis2} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="hadis3" className="form-label">Hadis 3</label>
          <input type="text" className="form-control" id="hadis3" name="hadis3" value={prayer.hadis3} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="hadis4" className="form-label">Hadis 4</label>
          <input type="text" className="form-control" id="hadis4" name="hadis4" value={prayer.hadis4} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="hadis5" className="form-label">Hadis 5</label>
          <input type="text" className="form-control" id="hadis5" name="hadis5" value={prayer.hadis5} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Update Prayer</button>
      </form>
    </div>
  );
}

export default PrayerUpdate;
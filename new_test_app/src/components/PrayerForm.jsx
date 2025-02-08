// src/components/PrayerForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function getUpdatedTime(timeString, change) {
  
  change = parseInt(change) || 0;

  let [time, period] = timeString.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  // Adjust minutes
  minutes += change;

  if (minutes >= 60) {
    minutes = 0;
    hours = hours === 12 ? 1 : hours + 1; // Handle 12-hour format
  } else if (minutes < 0) {
    minutes = 59;
    hours = hours === 1 ? 12 : hours - 1;
  }

  // Format back to string
  const updatedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
  
  return updatedTime;
}

function PrayerForm({ token, apiUrl }) {
  const step = 1;
  const max = 59;
  const min = -59;

  const navigate = useNavigate();
  const { id } = useParams();
  const [prayer, setPrayer] = useState({
    fajr_api: "",
    fajr_added_time: 0,
    fajr: "",
    sunrise: "",
    duhr_api: "",
    duhr_added_time: 0, // Initialize to 0
    duhr: "",
    jummah: "",
    asr_api: "",
    asr_added_time: 0, // Initialize to 0
    asr: "",
    magrib_api: "",
    magrib_added_time: 0, // Initialize to 0
    magrib: "",
    isha_api: "",
    isha_added_time: 0, // Initialize to 0
    isha: "",
    hadis1: "",
    hadis2: "",
    hadis3: "",
    hadis4: "",
    hadis5: ""
  });
  const [error, setError] = useState(null);
  const isEditing = !!id;

  useEffect(() => {
    const fetchPrayer = async () => {
      if (isEditing) {
        try {
          console.log('fetching prayer',`${apiUrl}/${id}`);
          const response = await axios.get(`${apiUrl}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setPrayer(response.data);
      
          console.log(response.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Error fetching prayer');
          
        }
      }
    };

    fetchPrayer();
 }, [id, apiUrl, token, isEditing]);


  const handleChange = (e) => {
    setPrayer({ ...prayer, [e.target.name]: e.target.value });
    if (e.target.name === 'fajr_added_time') {
      const updatedTime = getUpdatedTime(prayer.fajr_api, e.target.value);
      setPrayer({ ...prayer, fajr: updatedTime, [e.target.name]: e.target.value });

    } else if (e.target.name === 'duhr_added_time') {
      const updatedTime = getUpdatedTime(prayer.duhr_api, e.target.value);
      setPrayer({ ...prayer, duhr: updatedTime, [e.target.name]: e.target.value  });
    }
    else if (e.target.name === 'asr_added_time') {
      const updatedTime = getUpdatedTime(prayer.asr_api, e.target.value);
      setPrayer({ ...prayer, asr: updatedTime, [e.target.name]: e.target.value });
    }
    else if (e.target.name === 'magrib_added_time') {
      const updatedTime = getUpdatedTime(prayer.magrib_api, e.target.value);
      setPrayer({ ...prayer, magrib: updatedTime, [e.target.name]: e.target.value  });
    }
    else if (e.target.name === 'isha_added_time') {
      const updatedTime = getUpdatedTime(prayer.isha_api, e.target.value);
      setPrayer({ ...prayer, isha: updatedTime, [e.target.name]: e.target.value });
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${apiUrl}/${id}`, prayer, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(apiUrl, prayer, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/prayers'); // Redirect to the prayer list after save
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving prayer');
    }
  };

  const handleIncrement = (e) => {
    const api_time = e.target.dataset.api_time;
    const db_time = e.target.dataset.db_time;
    const orgvalue = prayer[e.target.dataset.inc_added_time];
    const newIncValue = Math.min(max, orgvalue + step);
    const updatedTime = getUpdatedTime(prayer[api_time], newIncValue);
    //  // split by space an take first element   fajr_api  take faajr

    setPrayer({
      ...prayer, // Spread the existing prayer object
      [e.target.dataset.inc_added_time]: newIncValue, // Update the added_time field
      [db_time]: updatedTime, // Update the db_time field
    });
    
  };
  
  const handleDecrement = (e) => {
    const api_time = e.target.dataset.api_time;
    const db_time = e.target.dataset.db_time;
    const orgvalue = prayer[e.target.dataset.dec_added_time];
    const newDecValue = Math.max(min, orgvalue - step);

    // // set to prayer db field
    const updatedTime = getUpdatedTime(prayer[api_time], newDecValue);

    setPrayer({
      ...prayer, // Spread the existing prayer object
      [e.target.dataset.dec_added_time]: newDecValue, // Update the added_time field
      [db_time]: updatedTime, // Update the db_time field
    });
  
  };


  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

        <div className='mb-3 mt-3'>
            <label htmlFor="field1" className="form-label">Fajr Global - Add/Subtract - Potsdam</label>
            <div className="input-group">
              <input type="text" className="form-control" id="fajr_api" name="fajr_api" value={prayer.fajr_api} onChange={handleChange} />
              <button className="btn btn-outline-secondary" data-dec_added_time="fajr_added_time" data-api_time="fajr_api" data-db_time='fajr' type="button" onClick={handleDecrement}>-</button>
              <input type="text" className="form-control" name='fajr_added_time' value={prayer.fajr_added_time} onChange={handleChange} min="-59" max="59" step="1"/>
              <button className="btn btn-outline-secondary" data-inc_added_time="fajr_added_time" data-api_time="fajr_api" data-db_time='fajr' type="button" onClick={handleIncrement}> + </button>
              <input type="text" className="form-control" id="fajr" name="fajr" value={prayer.fajr} onChange={handleChange} />
            </div>
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="sunrise" className="form-label">Sunrise</label>
          <input type="text" className="form-control" id="sunrise" name="sunrise" value={prayer.sunrise} onChange={handleChange} />
        </div>

        <div className='mb-3 mt-3'>
           <label htmlFor="duhr_api" className="form-label">Duhr Global - Add/Subtract - Potsdam</label>
           <div className="input-group">
              <input type="text" className="form-control" id="duhr_api" name="duhr_api" value={prayer.duhr_api} onChange={handleChange} />`
              <button className="btn btn-outline-secondary" data-dec_added_time="duhr_added_time" data-api_time="duhr_api" data-db_time="duhr" type="button" onClick={handleDecrement}>-</button>
              <input type="text" className="form-control" name='duhr_added_time' value={prayer.duhr_added_time} onChange={handleChange} min="-59" max="59" step="1"/>
              <button className="btn btn-outline-secondary" data-inc_added_time="duhr_added_time" data-api_time="duhr_api"  data-db_time="duhr" type="button" onClick={handleIncrement}> + </button>
              <input type="text" className="form-control" id="duhr" name="duhr" value={prayer.duhr} onChange={handleChange} />
            </div>
        </div>


        <div className="mb-3 mt-3">
          <label htmlFor="jummah" className="form-label">Jummah</label>
          <input type="text" className="form-control" id="jummah" name="jummah" value={prayer.jummah} onChange={handleChange} />
        </div>


        <div className='mb-3 mt-3' >
          <label htmlFor="asr_added_time" className="form-label">Asr Global - Add/subtract - Potsdam</label>
          <div className="input-group">
            <input type="text" className="form-control" id="asr_api" name="asr_api" value={prayer.asr_api} onChange={handleChange} />
            <button className="btn btn-outline-secondary" data-dec_added_time="asr_added_time" data-api_time="asr_api" data-db_time="asr" type="button" onClick={handleDecrement}>-</button>
            <input type="number" className="form-control" name='asr_added_time' value={prayer.asr_added_time} onChange={handleChange} min="-59" max="59" step="1"/>
            <button className="btn btn-outline-secondary" data-inc_added_time="asr_added_time" data-api_time="asr_api" data-db_time="asr" type="button" onClick={handleIncrement}> + </button>
            <input type="text" className="form-control" id="asr" name="asr" value={prayer.asr} onChange={handleChange} />
          </div>
        </div>

    
        <div className='mb-3 mt-3'>
          <label htmlFor="magrib_added_time" className="form-label">Magrib Global - Add/subtract - Potsdam</label>
          <div className="input-group">
            <input type="text" className="form-control" id="magrib_api" name="magrib_api" value={prayer.magrib_api} onChange={handleChange} />
            <button className="btn btn-outline-secondary" data-dec_added_time="magrib_added_time" data-api_time="magrib_api" data-db_time="magrib" type="button" onClick={handleDecrement}>-</button>
            <input type="number" className="form-control" name='magrib_added_time' value={prayer.magrib_added_time} onChange={handleChange} min="-59" max="59" step="1"/>
            <button className="btn btn-outline-secondary" data-inc_added_time="magrib_added_time" data-api_time="magrib_api" data-db_time="magrib" type="button" onClick={handleIncrement}> + </button>
            <input type="text" className="form-control" id="magrib" name="magrib" value={prayer.magrib} onChange={handleChange} />
          </div>
        </div>

        <div className="mb-3 mt-3">
            <label htmlFor="isha_added_time" className="form-label">Add/subtract</label>
            <div className="input-group">
              <input type="text" className="form-control" id="isha_api" name="isha_api" value={prayer.isha_api} onChange={handleChange} />
              <button className="btn btn-outline-secondary" data-dec_added_time="isha_added_time" data-api_time="isha_api" data-db_time="isha" type="button" onClick={handleDecrement}>-</button>
              <input type="number" className="form-control" name='isha_added_time' value={prayer.isha_added_time} onChange={handleChange} min="-59" max="59" step="1"/>
              <button className="btn btn-outline-secondary" data-inc_added_time="isha_added_time" data-api_time="isha_api" data-db_time="isha" type="button" onClick={handleIncrement}> + </button>
              <input type="text" className="form-control" id="isha" name="isha" value={prayer.isha} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="isha_added_time" className="form-label">Hadis 1</label>
            <div className="input-group">
              <textarea type="text" rows={5} className="form-control" id="hadis1" name="hadis1" value={prayer.hadis1} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="isha_added_time" className="form-label">Hadis 2</label>
            <div className="input-group">
              <textarea type="text" rows={5} className="form-control" id="hadis2" name="hadis2" value={prayer.hadis2} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="isha_added_time" className="form-label">Hadis 3</label>
            <div className="input-group">
              <textarea type="text" rows={5} className="form-control" id="hadis3" name="hadis3" value={prayer.hadis3} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="isha_added_time" className="form-label">Hadis 4</label>
            <div className="input-group">
              <textarea type="text" rows={5} className="form-control" id="hadis4" name="hadis4" value={prayer.hadis4} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="isha_added_time" className="form-label">Hadis 5</label>
            <div className="input-group">
              <textarea type="text" rows={5} className="form-control" id="hadis5" name="hadis5" value={prayer.hadis5} onChange={handleChange} />
            </div>
        </div>
      <button type="submit" className="btn btn-primary">Save</button>
    </form>
  );
}

export default PrayerForm;
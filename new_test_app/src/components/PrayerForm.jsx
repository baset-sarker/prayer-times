// src/components/PrayerForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { updateIqamaTimeForFirstTim, getUpdatedTime } from './helper';


function PrayerForm({ token, apiUrl }) {
  const step = 1;
  const max = 200;
  const min = -200;

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
    tarawih: "",
    hadis1: "",
    hadis2: "",
    hadis3: "",
    hadis4: "",
    hadis5: "",
    notice_head_line: "",
    notice_first_line: "",
    notice_second_line: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;
  
  useEffect(() => {
    const fetchPrayer = async () => {
      setLoading(true);
      if (isEditing) {
        try {
          console.log('fetching prayer',`${apiUrl}/${id}`);
          const response = await axios.get(`${apiUrl}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          let updatedPrayer = updateIqamaTimeForFirstTim(response.data);
          setPrayer(updatedPrayer);
          console.log('updatedPrayer', updatedPrayer);
          console.log(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || 'Error fetching prayer');
          if ([401, 403].includes(err.response?.status)) {
            navigate('/login');
          }
          
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

    }else if (e.target.name === 'asr_added_time') {
      console.log('asr_added_time', e.target.value);  
      const updatedTime = getUpdatedTime(prayer.asr_api, e.target.value);
      setPrayer({ ...prayer, asr: updatedTime, [e.target.name]: e.target.value  });

    }else if (e.target.name === 'magrib_added_time') {
      const updatedTime = getUpdatedTime(prayer.magrib_api, e.target.value);
      console.log('updatedTime', updatedTime);
      setPrayer({ ...prayer, magrib: updatedTime, [e.target.name]: e.target.value  });
    }
    else if (e.target.name === 'isha_added_time') {
      const updatedTime = getUpdatedTime(prayer.isha_api, e.target.value);
      setPrayer({ ...prayer, isha: updatedTime, [e.target.name]: e.target.value });
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      navigate('/prayer'); // Redirect to the prayer list after save
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving prayer');
    } finally {
      setLoading(false);
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
    <div style={{minHeight: '100vh'}}>

    <form onSubmit={handleSubmit}>
      {loading && <div style={{color: 'white'}}> <img height={'30px'} src='/loading.gif'></img> Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3 mt-3">
          <button type="submit" className="btn-green">Save Prayer Times</button><br/>
          *Set add/subtract to -1 to make Iqama time manual (static). <br/>
          *If add/subtract has any value other than -1, the Iqama time will automatically updated as (API time + add/subtract value).
        </div>
        <div className='mb-3 mt-3'>
            <label htmlFor="field1" className="form-label fw-bold">Fajr API - Add/Subtract - Iqama</label>
            <div className="input-group">
              <input type="text" className="form-control" id="fajr_api" name="fajr_api" value={prayer.fajr_api} onChange={handleChange} readOnly />
              <button className="btn btn-outline-secondary" data-dec_added_time="fajr_added_time" data-api_time="fajr_api" data-db_time='fajr' type="button" onClick={handleDecrement}>-</button>
              <input type="text" className="form-control" name='fajr_added_time' value={prayer.fajr_added_time} onChange={handleChange} step="1"/>
              <button className="btn btn-outline-secondary" data-inc_added_time="fajr_added_time" data-api_time="fajr_api" data-db_time='fajr' type="button" onClick={handleIncrement}> + </button>
              <input type="text" className="form-control" id="fajr" name="fajr" value={prayer.fajr} onChange={handleChange} />
            </div>
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="sunrise" className="form-label fw-bold">Sunrise</label>
          <input type="text" className="form-control" id="sunrise" name="sunrise" value={prayer.sunrise} onChange={handleChange} readOnly/>
        </div>

        <div className='mb-3 mt-3'>
           <label htmlFor="duhr_api" className="form-label fw-bold">Duhr API - Add/Subtract - Iqama</label>
           <div className="input-group">
              <input type="text" className="form-control" id="duhr_api" name="duhr_api" value={prayer.duhr_api} onChange={handleChange} readOnly/>`
              <button className="btn btn-outline-secondary" data-dec_added_time="duhr_added_time" data-api_time="duhr_api" data-db_time="duhr" type="button" onClick={handleDecrement}>-</button>
              <input type="text" className="form-control" name='duhr_added_time' value={prayer.duhr_added_time} onChange={handleChange} step="1"/>
              <button className="btn btn-outline-secondary" data-inc_added_time="duhr_added_time" data-api_time="duhr_api"  data-db_time="duhr" type="button" onClick={handleIncrement}> + </button>
              <input type="text" className="form-control" id="duhr" name="duhr" value={prayer.duhr} onChange={handleChange} />
            </div>
        </div>

        
        <div className="mb-3 mt-3">
          <label htmlFor="jummah" className="form-label fw-bold">Jummah</label>
          <input type="text" className="form-control" id="jummah" name="jummah" value={prayer.jummah} onChange={handleChange}/>
        </div>

        <div className='mb-3 mt-3'>
          <label htmlFor="asr_added_time" className="form-label fw-bold">Asr API - Add/subtract - Iqama</label>
          <div className="input-group">
            <input type="text" className="form-control" id="asr_api" name="asr_api" value={prayer.asr_api} onChange={handleChange} readOnly/>
            <button className="btn btn-outline-secondary" data-dec_added_time="asr_added_time" data-api_time="asr_api" data-db_time="asr" type="button" onClick={handleDecrement}>-</button>
            <input type="number" className="form-control" name='asr_added_time' value={prayer.asr_added_time} onChange={handleChange} step="1"/>
            <button className="btn btn-outline-secondary" data-inc_added_time="asr_added_time" data-api_time="asr_api" data-db_time="asr" type="button" onClick={handleIncrement}> + </button>
            <input type="text" className="form-control" id="asr" name="asr" value={prayer.asr} onChange={handleChange} />
          </div>
        </div>
        <div className='mb-3 mt-3'>
          <label htmlFor="magrib_added_time" className="form-label fw-bold">Magrib API - Add/subtract - Iqama</label>
          <div className="input-group">
            <input type="text" className="form-control" id="magrib_api" name="magrib_api" value={prayer.magrib_api} onChange={handleChange} readOnly/>
            <button className="btn btn-outline-secondary" data-dec_added_time="magrib_added_time" data-api_time="magrib_api" data-db_time="magrib" type="button" onClick={handleDecrement}>-</button>
            <input type="number" className="form-control" name='magrib_added_time' value={prayer.magrib_added_time} onChange={handleChange} step="1"/>
            <button className="btn btn-outline-secondary" data-inc_added_time="magrib_added_time" data-api_time="magrib_api" data-db_time="magrib" type="button" onClick={handleIncrement}> + </button>
            <input type="text" className="form-control" id="magrib" name="magrib" value={prayer.magrib} onChange={handleChange} />
          </div>
        </div>

        <div className="mb-3 mt-3">
            <label htmlFor="isha_added_time" className="form-label fw-bold">Isha API - Add/subtract - Iqama</label>
            <div className="input-group">
              <input type="text" className="form-control" id="isha_api" name="isha_api" value={prayer.isha_api} onChange={handleChange} readOnly/>
              <button className="btn btn-outline-secondary" data-dec_added_time="isha_added_time" data-api_time="isha_api" data-db_time="isha" type="button" onClick={handleDecrement}>-</button>
              <input type="number" className="form-control" name='isha_added_time' value={prayer.isha_added_time} onChange={handleChange} step="1"/>
              <button className="btn btn-outline-secondary" data-inc_added_time="isha_added_time" data-api_time="isha_api" data-db_time="isha" type="button" onClick={handleIncrement}> + </button>
              <input type="text" className="form-control" id="isha" name="isha" value={prayer.isha} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="tarawih" className="form-label fw-bold">Tarawih</label>
          <br/>
          * Keep it empty if not applicable <br/>
          <input type="text" className="form-control" id="tarawih" name="tarawih" value={prayer.tarawih} onChange={handleChange} />
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="isha_added_time" className="form-label fw-bold">Hadis 1</label>
            <div className="input-group">
              <textarea type="text" rows={5} className="form-control" id="hadis1" name="hadis1" value={prayer.hadis1} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="isha_added_time" className="form-label fw-bold">Hadis 2</label>
            <div className="input-group">
              <textarea type="text" rows={5} className="form-control" id="hadis2" name="hadis2" value={prayer.hadis2} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="isha_added_time" className="form-label fw-bold">Hadis 3</label>
            <div className="input-group">
              <textarea type="text" rows={5} className="form-control" id="hadis3" name="hadis3" value={prayer.hadis3} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="isha_added_time" className="form-label fw-bold">Hadis 4</label>
            <div className="input-group">
              <textarea type="text" rows={5} className="form-control" id="hadis4" name="hadis4" value={prayer.hadis4} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="isha_added_time" className="form-label fw-bold">Hadis 5</label>
            <div className="input-group">
              <textarea type="text" rows={5} className="form-control" id="hadis5" name="hadis5" value={prayer.hadis5} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="notice_head_line" className="form-label fw-bold">Notice Headline</label>
            <div className="input-group">
              <textarea type="text" className="form-control" id="notice_head_line" name="notice_head_line" value={prayer.notice_head_line} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="notice_first_line" className="form-label fw-bold">Notice First Line</label>
            <div className="input-group">
              <textarea type="text" rows={5} className="form-control" id="notice_first_line" name="notice_first_line" value={prayer.notice_first_line} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
            <label htmlFor="notice_second_line" className="form-label fw-bold">Notice Second Line</label>
            <div className="input-group">
              <textarea type="text" rows={5} className="form-control" id="notice_second_line" name="notice_second_line" value={prayer.notice_second_line} onChange={handleChange} />
            </div>
        </div>
        <div className="mb-3 mt-3">
        *Set add/subtract to -1 to make Iqama time manual (static). <br/>
        *If add/subtract has any value other than -1, the Iqama time will automatically updated as (API time + add/subtract value).<br/>
            <button type="submit" className="btn-green">Save Prayer Times</button>
        </div>
    </form>
    </div>
  );
}

export default PrayerForm;
// src/components/PrayerForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function PrayerForm({ token, apiUrl }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [prayer, setPrayer] = useState({
    fajr: '',
    duhr: '',
    asr: '',
    magrib: '',
    isha: '',
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

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label htmlFor="field1" className="form-label">Field 1</label>
        <input type="text" className="form-control" id="field1" name="field1" value={prayer.fajr} onChange={handleChange} />
        <input type="text" className="form_control_multiple form-control" id="field1" name="field1" value={prayer.fajr_added_time} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="field2" className="form-label">Field 2</label>
        <input type="text" className="form-control" id="field2" name="field2" value={prayer.duhr} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="field3" className="form-label">Field 3</label>
        <input type="text" className="form-control" id="field3" name="field3" value={prayer.asr} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="field4" className="form-label">Field 4</label>
        <input type="text" className="form-control" id="field4" name="field4" value={prayer.magrib} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="field5" className="form-label">Field 5</label>
        <input type="text" className="form-control" id="field5" name="field5" value={prayer.isha} onChange={handleChange} />
      </div>

      <button type="submit" className="btn btn-primary">Save</button>
    </form>
  );
}

export default PrayerForm;
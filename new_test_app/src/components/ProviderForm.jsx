// src/components/PrayerForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function PrayerForm({ token, apiUrl }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [provider, setPrayer] = useState({
    name: '',
    password: '',
    password_encrypted: '',
  });
  const [error, setError] = useState(null);
  const isEditing = !!id;

  useEffect(() => {
    const fetchPrayer = async () => {
      if (isEditing) {
        try {
          console.log('fetching provider',`${apiUrl}/${id}`);
          const response = await axios.get(`${apiUrl}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPrayer(response.data);
          console.log(response.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Error fetching provider');
          
        }
      }
    };

    fetchPrayer();
  }, [id, apiUrl, token, isEditing]);

  const handleChange = (e) => {
    setPrayer({ ...provider, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${apiUrl}/${id}`, provider, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(apiUrl, provider, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/provider'); // Redirect to the provider list after save
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving provider');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="col-md-6 offset-md-3" style={{ minHeight: '800px',paddingTop: '100px' }}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Wifi Name</label>
        <input type="text" className="form-control" id="name" name="name" value={provider.name} onChange={handleChange} required/>
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input type="text" className="form-control" id="password" name="password" onChange={handleChange} required/>
      </div>

      <button type="submit" className="btn btn-primary">Save</button>
    </form>
  );
}

export default PrayerForm;
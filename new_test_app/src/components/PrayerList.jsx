// src/components/PrayerList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PrayerList({ token, apiUrl }) {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` }, // Add token to header
        });
        setPrayers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching prayers');
      } finally {
        setLoading(false);
      }
    };

    fetchPrayers();
  }, [apiUrl, token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrayers(prayers.filter((prayer) => prayer._id !== id)); // Update state after delete
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting prayer');
    }
  };

  if (loading) {
    return <div>Loading prayers...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div style={{ minHeight: '800px' }}>
      <h2>Prayer List</h2>
      {/* <Link to="/prayers/create" className="btn btn-primary mb-3">Create Prayer</Link> */}
      <ul className="list-group">
        {prayers?.map((prayer) => (
          <li key={prayer._id} className="list-group-item">
            {/* Display your prayer fields here */}
            {prayer.fajr} {prayer.duhr} {prayer.asr} {prayer.magrib} {prayer.isha}
            <Link to={`/prayers/edit/${prayer._id}`} className="btn btn-sm btn-warning ms-2">Edit</Link>
            {/* <button onClick={() => handleDelete(prayer._id)} className="btn btn-sm btn-danger ms-2">Delete</button> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PrayerList;
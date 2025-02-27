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
      setError(err.response?.data?.message || 'Error deleting prayer login first');
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
      
      {/* <Link to="/prayers/create" className="btn btn-primary mb-3">Create Prayer</Link> */}
      <ul className="list-group">
        {/* <h2> &nbsp; &nbsp; Prayer List</h2> */}
        {prayers?.map((prayer) => (
          <div key={prayer._id} className='container'>
            <div className='my-4'>
            <Link to={`/prayer/edit/${prayer._id}`} className="btn-green">Edit Prayer</Link> <br></br>
            </div>

            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Prayer Times</td>
                  <td>Fajr:{prayer.fajr} &nbsp;Sunrise:{prayer.sunrise} &nbsp; Dhuhr:{prayer.duhr} &nbsp; Jummah:{prayer.jummah}
                      &nbsp;Asr:{prayer.asr} &nbsp; Magrib:{prayer.magrib} &nbsp;Isha:{prayer.isha} &nbsp;Tarawih:{prayer.tarawih} 
                      
                  </td>
                </tr>
                <tr>
                  <td>Hadis1</td>
                  <td>{prayer.hadis1}</td>
                </tr>
                <tr>
                  <td>Hadis2</td>
                  <td>{prayer.hadis2}</td>
                </tr>
                <tr>
                  <td>Hadis3</td>
                  <td>{prayer.hadis3}</td>
                </tr>
                <tr>
                  <td>Hadis4</td>  
                  <td>{prayer.hadis4}</td>
                </tr>
                <tr>
                  <td>Hadis5</td>
                  <td>{prayer.hadis5}</td>
                </tr>
                {prayer.notice_head_line && (
                    <tr> 
                      <td>Notice Headline</td>
                      <td>{prayer.notice_head_line}</td> 
                    </tr>
                )}
                {prayer.notice_first_line && (
                    <tr> 
                      <td>Notice First Line</td>
                      <td>{prayer.notice_first_line}</td> 
                    </tr>
                
                )}
                {prayer.notice_second_line && (
                    <tr> 
                      <td>Notice Second Line</td>
                      <td>{prayer.notice_second_line}</td> 
                    </tr>
                )}
                &nbsp; Auto-update at: {prayer.updated_at}
              </tbody>
            </table>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default PrayerList;
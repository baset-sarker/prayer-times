// src/components/PrayerList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getIqaamahTime, getTarawihTime} from './helper';
import WhatsAppShare from './WhatsAppShare';



function PrayerList({ token, apiUrl }) {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` }, // Add token to header
        });
        setPrayers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching prayers');
        if ([401, 403].includes(err.response?.status)) {
          navigate('/login');
        }
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

  // if (loading) {
  //   // return <div>Loading prayers...</div>;
  //   return <div style={{color: 'white'}}> <img height={'30px'} src='/loading.gif'></img> Loading...</div>
  // }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div style={{ minHeight: '800px' }}>

      {loading && <div style={{color: 'white',textAlign: 'center',marginTop:'10px'}}> <img height={'30px'} src='/loading.gif'></img> Loading...</div>}
      
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
                  <td>Fajr Iqama:{getIqaamahTime(prayer.fajr_api, prayer.fajr, prayer.fajr_added_time)} 
                      &nbsp;Sunrise:{prayer.sunrise} 
                      &nbsp; Dhuhr Iqama:{getIqaamahTime(prayer.duhr_api, prayer.duhr, prayer.duhr_added_time)}
                      &nbsp; Jummah:{prayer.jummah}
                      &nbsp;Asr Iqama:{getIqaamahTime(prayer.asr_api, prayer.asr, prayer.asr_added_time)}
                      &nbsp; Magrib Iqama:{getIqaamahTime(prayer.magrib_api, prayer.magrib, prayer.magrib_added_time)} 
                      &nbsp;Isha Iqama:{getIqaamahTime(prayer.isha_api, prayer.isha, prayer.isha_added_time)} 
                      {prayer.tarawih &&
                      <span> &nbsp;Tarawih: {getTarawihTime(getIqaamahTime(prayer.isha_api,prayer.isha,prayer.isha_added_time),prayer.tarawih)}</span> 
                      }

                      &nbsp; <WhatsAppShare prayer={prayer} />
                  </td>
                </tr>
                <tr>
                  <td>Hadis1</td>
                  <td style={{textAlign: 'center',  whiteSpace: "pre-wrap"}}>{prayer.hadis1}</td>
                </tr>
                <tr>
                  <td>Hadis2</td>
                  <td style={{textAlign: 'center',  whiteSpace: "pre-wrap"}}>{prayer.hadis2}</td>
                </tr>
                <tr>
                  <td>Hadis3</td>
                  <td style={{textAlign: 'center',  whiteSpace: "pre-wrap"}}>{prayer.hadis3}</td>
                </tr>
                <tr>
                  <td>Hadis4</td>  
                  <td style={{textAlign: 'center',  whiteSpace: "pre-wrap"}}>{prayer.hadis4}</td>
                </tr>
                <tr>
                  <td>Hadis5</td>
                  <td style={{textAlign: 'center',  whiteSpace: "pre-wrap"}}>{prayer.hadis5}</td>
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
                <tr>
                  <td>Auto-update at:</td>
                  <td>&nbsp;  {prayer.updated_at}</td>
                </tr>
                
              </tbody>
            </table>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default PrayerList;
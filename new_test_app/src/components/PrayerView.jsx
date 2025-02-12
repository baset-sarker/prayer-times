import axios from 'axios';
import React, { useState, useEffect } from 'react';
import WhatsAppShare from './WhatsAppShare';

const PrayerView = () => {
    const apiUrl = '/api/prayer'; // Make sure this path is correct relative to your frontend
    
    const [prayer, setPrayer] = useState({
      fajr_api: "",
      fajr_added_time: 0,
      fajr: "",
      sunrise: "",
      duhr_api: "",
      duhr_added_time: 0,
      duhr: "",
      jummah: "",
      asr_api: "",
      asr_added_time: 0,
      asr: "",
      magrib_api: "",
      magrib_added_time: 0,
      magrib: "",
      isha_api: "",
      isha_added_time: 0,
      isha: "",
      hadis1: "",
      hadis2: "",
      hadis3: "",
      hadis4: "",
      hadis5: "",
      notice_head_line: "",
      notice_first_line: "",
      notice_second_line: ""
    });
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const fetchPrayer = async () => {
        setLoading(true); // Set loading to true before fetching
        setError(null);    // Clear any previous errors
    
        try {
          const response = await axios.get(apiUrl); // No need for template literal if it's already a string
    
          if (response.status !== 200) {  // Check for successful response
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          setPrayer(response.data[0]);

          console.log("Prayer Data:", prayer); // Keep this for debugging
    
        } catch (err) {
          console.error("Error fetching prayer:", err); // Log the full error for debugging
    
          // More robust error handling:
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || err.message || 'Error fetching prayer'); // Prioritize server message
          } else {
            setError(err.message || 'An unexpected error occurred.');
          }
        } finally {
          setLoading(false); // Set loading to false after fetch, regardless of success/failure
        }
      };
    
      fetchPrayer(); // No need for isEditing condition if you always want to fetch on mount.
    }, []);  // Empty dependency array ensures this runs only once on mount

  return (
    <div>
        <section className="py-4" style={{ backgroundColor: '#04383F'}} >
            <div className="container" >
                <div className="align-items-center">
                  {prayer.notice_head_line && (
                    <div className="row">
                      <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                        <h1 style={{ textAlign: 'center'}}>{prayer.notice_head_line}</h1>
                        <h2 style={{ textAlign: 'center'}}>{prayer.notice_first_line}</h2>
                        {prayer.notice_second_line && (<h3 style={{ textAlign: 'center'}}>{prayer.notice_second_line}</h3> )}
                        <hr />
                      </div>
                    </div>
                  )}

                    <div className="row">
                    <h1 style={{ textAlign: 'center', height:"2rem", color: '#d4af37'}}>Prayer Time</h1>
                    </div>

                    {loading && <div>Loading prayer times...</div>}
                    {error && <div style={{ color: 'red' }}>Error: {error}</div>}
                    {!loading && !error && (
                    
                    <div className='row'>
                        <div className="col-lg-6 my-3 my-lg-0" >
                            <h2 className="shiny-gold-text" style={{ textAlign: 'center' }}>Prayer gathering at the masjid</h2>
                            <ul class="list-group">
                                <li className="golden-card shiny-gold-text">Fajr: {prayer.fajr}</li>
                                <li className="golden-card shiny-gold-text">Sunrise: {prayer.sunrise}</li>
                                <li className="golden-card shiny-gold-text">Dhuhr: {prayer.duhr}</li>
                                <li className="golden-card shiny-gold-text">Jummah: {prayer.jummah}</li>
                                <li className="golden-card shiny-gold-text">Asr: {prayer.asr}</li>
                                <li className="golden-card shiny-gold-text">Magrib: {prayer.magrib}</li>
                                <li className="golden-card shiny-gold-text">Isha: {prayer.isha}</li>
                            </ul>
                            <p className='py-2 text-white'>*These are not prayer times, these are times we gather at our masjid for salat. 
                            {prayer ? <WhatsAppShare prayer={prayer} /> : <p>Loading prayer...</p>}

                            </p>
                            
                            
                            
                        </div>
                        <div className="col-lg-6">
                            <h2 className='shiny-gold-text' style={{ textAlign: 'center' }}>Prayer time</h2>
                            <ul className="list-group">
                                <li className="golden-card shiny-gold-text">Fajr: {prayer.fajr_api}</li>
                                <li className="golden-card shiny-gold-text">Sunrise: {prayer.sunrise}</li>
                                <li className="golden-card shiny-gold-text">Dhuhr: {prayer.duhr_api}</li>
                                <li className="golden-card shiny-gold-text">Jummah: {prayer.duhr_api}</li>
                                <li className="golden-card shiny-gold-text">Asr: {prayer.asr_api}</li>
                                <li className="golden-card shiny-gold-text">Magrib: {prayer.magrib_api}</li>
                                <li className="golden-card shiny-gold-text">Isha: {prayer.isha_api}</li>
                            </ul>
                            <p className='py-2 text-white'> *Prayer time is taken from API (https://aladhan.com/), please check before follow. </p>
                        </div> 
                    </div>
                    )}

                </div>
            </div>
        </section>
    </div>
  );
};

export default PrayerView;
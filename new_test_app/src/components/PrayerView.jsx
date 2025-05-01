import axios from 'axios';
import React, { useState, useEffect } from 'react';
import WhatsAppShare from './WhatsAppShare';
import ContactForm from './ContactForm';
import Calendar from './Calendar';
import { getIqaamahTime, getTarawihTime} from './helper';

const PrayerView = () => {
    const apiUrl = '/api/prayer/homepage'; // Make sure this path is correct relative to your frontend
    
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
      tarawih: "",
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


    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour12: false,
      }).format(date);
    };

    // function getUpdatedTime(timeString, change) {
    //   change = parseInt(change) || 0;
    
    //   let [time, period] = timeString.split(" ");
    //   let [hours, minutes] = time.split(":").map(Number);
    
    //   // Convert to 24-hour format for easier calculations
    //   if (period === "PM" && hours !== 12) hours += 12;
    //   if (period === "AM" && hours === 12) hours = 0;
    
    //   // Adjust time
    //   let totalMinutes = hours * 60 + minutes + change;
    //   totalMinutes = (totalMinutes + 1440) % 1440; // Handle negative values and wrap around
    
    //   // Convert back to hours and minutes
    //   hours = Math.floor(totalMinutes / 60);
    //   minutes = totalMinutes % 60;
    
    //   // Convert back to 12-hour format
    //   period = hours >= 12 ? "PM" : "AM";
    //   hours = hours % 12 || 12; // Convert 0 -> 12 for AM
    
    //   // Format output
    //   return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
    // }

  //   function timeToMinutes(time) {
  //     try {
  //       const [timePart, period] = time.split(" ");
  //       let [hours, minutes] = timePart.split(":").map(Number);
    
  //       if (period === "PM" && hours !== 12) hours += 12; // Convert PM hours to 24-hour format
  //       if (period === "AM" && hours === 12) hours = 0;   // Convert 12 AM to 0
    
  //       return hours * 60 + minutes; // Return total minutes since midnight
  //     } catch (error) {
  //       console.error("Error converting time to minutes:", error);
  //       return null;
  //     }
      
  // }



  return (
    <div>
        <section className="py-4" style={{ backgroundColor: '#04383F'}} >
            <div className="" >
                <div className="align-items-center">
                    <div className="row">
                      <h1 id="bismillah_text">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>
                    </div>
    
                  {prayer.notice_head_line && (
                    <div className="row">
                      <div style={{marginTop: '40px', marginBottom: '40px' }}>
                        <h1 style={{ textAlign: 'center'}} className="shiny-gold-text">{prayer.notice_head_line}</h1>
                        <h2 style={{ textAlign: 'center'}} className="shiny-gold-text">{prayer.notice_first_line}</h2>
                        {prayer.notice_second_line && (<h3 style={{ textAlign: 'center'}} className="shiny-gold-text">{prayer.notice_second_line}</h3> )}
                        <hr />
                      </div>
                    </div>
                  )}


                    {loading && <div style={{color: 'white', textAlign: 'center',marginTop:'10px'}}> <img height={'30px'} src='/loading.gif'></img> Loading prayer times...</div>}

                    {error && <div style={{ color: 'red' }}>Error: {error}</div>}
                    {!loading && !error && (
                    <div className="row w-100 d-flex flex-column justify-content-center align-items-center pt-4">
                      <div className="text-center" id="div1">  
                          <div class="row justify-content-center">
                              <h1 className="text-white pt-4" id="pt">Prayer Gathering At The Masjid</h1>
                              <h4 className="text-white">{formatDate(prayer.updated_at)}</h4>
                          </div>              
                          <div className="row justify-content-center">
                                  

                                  <div class="col-lg-4 col-sm-6 col-xs-6">
                                      <div class="golden-card" id="fajr_card">
                                          <div class="prayer_text shiny-gold-text">(الفجر)</div>
                                          <div class="prayer_text shiny-gold-text" id="fajr_api">Fajr {prayer.fajr_api}</div>
                                          <div class="prayer_text shiny-gold-text" id="fajr">Iqama {getIqaamahTime(prayer.fajr_api,prayer.fajr,prayer.fajr_added_time)}</div>
                                          <div class="prayer_text shiny-gold-text" id="sunrise">Sunrise {prayer.sunrise}</div>   
                                      </div>
                                  </div>
                                  
                                  <div class="col-lg-4 col-sm-6 col-xs-6">
                                      <div class="golden-card" id="dhuhr_card">
                                          <div class="prayer_text shiny-gold-text">(الظهر)</div>
                                          <div class="prayer_text shiny-gold-text" id="dhuhr_api">Dhuhr {prayer.duhr_api}</div>
                                          <div class="prayer_text shiny-gold-text" id="dhuhr">Iqama {getIqaamahTime(prayer.duhr_api,prayer.duhr,prayer.duhr_added_time)}</div>
                                          <div class="prayer_text shiny-gold-text" id="jummah">Jummah {prayer.jummah}</div>  
                                      </div>
                                  </div>
                                  <div class="col-lg-4 col-sm-6 col-xs-6">
                                      <div class="golden-card" id="asr_card">
                                          <div class="prayer_text shiny-gold-text">(العصر)</div>
                                          <div class="prayer_text shiny-gold-text" id="asr_api"> Asr {prayer.asr_api}</div>
                                          <div class="prayer_text shiny-gold-text" id="asr">Iqama {getIqaamahTime(prayer.asr_api,prayer.asr,prayer.asr_added_time)} </div>
                                      </div>
                                  </div>
                                  
                          </div>
                          <div class="row justify-content-center">
                            <div class="col-lg-4 col-sm-6 col-xs-6">
                                      <div class="golden-card" id="magrib_card">
                                          <div class="prayer_text shiny-gold-text">(المغرب)</div>
                                          <div class="prayer_text shiny-gold-text" id="magrib_api">Magrib {prayer.magrib_api}</div>
                                          <div class="prayer_text shiny-gold-text" id="magrib">Iqama {getIqaamahTime(prayer.magrib_api,prayer.magrib,prayer.magrib_added_time)}</div>
                                          
                                      </div>
                              </div>
                              <div class="col-lg-4 col-sm-6 col-xs-6">
                                      <div class="golden-card" id="isha_card">
                                          <div class="prayer_text shiny-gold-text">(العشاء)</div>
                                          <div class="prayer_text shiny-gold-text" id="isha_api">Isha {prayer.isha_api}</div>
                                          <div class="prayer_text shiny-gold-text" id="isha">Iqama {getIqaamahTime(prayer.isha_api,prayer.isha,prayer.isha_added_time)}</div>
                                          {prayer.tarawih && <div class="prayer_text shiny-gold-text" id="tarawih">
                                            Taraweeh {getTarawihTime(getIqaamahTime(prayer.isha_api,prayer.isha,prayer.isha_added_time),prayer.tarawih)}
                                            </div> 
                                          }
                                      </div>
                              </div>
                              
                          </div>
                  
                          </div> 
                          <p className='py-4 text-white text-center text-justify'> *Prayer times are taken from API <a href='https://www.islamicfinder.us/'>islamicfinder.us</a>, 
                                                           method: ISNA - Islamic Society of North America, adjustment: OneSeventh, juristic: Standard (Shafi, Hanbli, Maliki), Place: Potsdam, NY, USA. 
                                                           please check before follow. <br />


                                                           {prayer ? <WhatsAppShare prayer={prayer} /> : <p>Loading prayer...</p>}
                                                           
                          </p>
                        </div>
                      
                    
                    )}

                    <div className="container">
                          <div className="text-center">
                              <h2 className="text-white">Useful links</h2>
                              <p className="text-white text-center">Youtube channel, helps to memorize quran</p>
                              <a target='blank' style={{"textDecoration": "none"}} href='https://www.youtube.com/@Worldofpeace-vm4bc' className="text-white">
                              <img height={'40px'} src='youtube.webp'></img> &nbsp; World of peace</a>
                          </div>
                    </div>

                </div>
            </div>
        </section>
      
          <Calendar/>
  
        <ContactForm/>
    </div>
  );
};

export default PrayerView;
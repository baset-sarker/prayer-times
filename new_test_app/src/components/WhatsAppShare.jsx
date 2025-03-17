import React from "react";
import PropTypes from "prop-types";
import { getIqaamahTime } from "./helper";

const WhatsAppShare = ({ prayer }) => {
  if (!prayer) return null; // Don't render if message is empty
  let FormatedTextForWhatsapp= `السلام عليكم ورحمة الله تعالى وبركاته
Please inform others
These are not prayer times, these are times we gather at our masjid for salat:
                                  
Fajr Iqama: ${getIqaamahTime(prayer.fajr_api, prayer.fajr, prayer.fajr_added_time)}
Dhuhr Iqama: ${getIqaamahTime(prayer.duhr_api, prayer.duhr, prayer.duhr_added_time)}
Jummah Iqama: ${prayer.jummah}
Asr Iqama: ${getIqaamahTime(prayer.asr_api, prayer.asr, prayer.asr_added_time)}
Magrib Iqama: ${getIqaamahTime(prayer.magrib_api, prayer.magrib, prayer.magrib_added_time)}
Isha Iqama: ${getIqaamahTime(prayer.isha_api, prayer.isha, prayer.isha_added_time)}`;

  if(prayer.tarawih !== ''){
    FormatedTextForWhatsapp += `
Tarawih: ${prayer.tarawih}
`;
  }

  FormatedTextForWhatsapp += `For update visit: https://potsdammasjid.netlify.app/`;
                                                                     
                                  
  const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(FormatedTextForWhatsapp)}`;

  return (
    <a href={whatsappURL} target="_blank" rel="noopener noreferrer" className="whatsapp-btn text-white" style={{ display: 'block', textAlign: 'center', marginTop: '10px', height: '30px' }}>
      <i className="fab fa-whatsapp"></i> Share on WhatsApp
    </a>
  );
};

// Define PropTypes
WhatsAppShare.propTypes = {
  message: PropTypes.string.isRequired,
};

export default WhatsAppShare;

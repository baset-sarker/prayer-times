import React from "react";
import PropTypes from "prop-types";

const WhatsAppShare = ({ prayer }) => {
  if (!prayer) return null; // Don't render if message is empty
  // const FormatedTextForWhatsapp= `السلام عليكم ورحمة الله تعالى وبركاته
  const FormatedTextForWhatsapp=`Please inform others
                                  These are not prayer times, these are times we gather at our masjid for salat:
                                  
                                  Fajr Iqama: ${prayer.fajr}
                                  Dhuhr Iqama: ${prayer.duhr}
                                  Jummah Iqama: ${prayer.jummah}
                                  Asr Iqama: ${prayer.asr}
                                  Magrib Iqama: ${prayer.magrib}
                                  Isha Iqama: ${prayer.isha}
                                  Tarawih Iqama: ${prayer.tarawih}
                                  For update visit: https://potsdammasjid.netlify.app/`;
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

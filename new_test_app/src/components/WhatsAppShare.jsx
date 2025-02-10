import React from "react";
import PropTypes from "prop-types";

const WhatsAppShare = ({ prayer }) => {
  if (!prayer) return null; // Don't render if message is empty
  const FormatedTextForWhatsapp= `Fajr: ${prayer.fajr}\nSunrise: ${prayer.sunrise}\nDuhr: ${prayer.duhr}\nJummah: ${prayer.jummah}\nAsr: ${prayer.asr}\nMagrib: ${prayer.magrib}\nIsha: ${prayer.isha}`;
  const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(FormatedTextForWhatsapp)}`;

  return (
    <a href={whatsappURL} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}>
      <i className="fab fa-whatsapp"></i> Share on WhatsApp
    </a>
  );
};

// Define PropTypes
WhatsAppShare.propTypes = {
  message: PropTypes.string.isRequired,
};

export default WhatsAppShare;

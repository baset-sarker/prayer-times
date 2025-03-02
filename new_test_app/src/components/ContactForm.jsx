import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    access_key:'e03378a8-c5cb-4c06-8c6a-cb47738584e6',
    subject:'Potsdam Masjid Website New Message'
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("Please wait...");

    const baseUrl = window.location.origin;
    const formDataObj = {
      ...formData,
      website_url: baseUrl
    };

    const json = JSON.stringify(formDataObj);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });

      const responseJson = await response.json();
      if (response.status === 200) {
        setResult("Message submitted successfully");
      } else {
        setResult(responseJson.message);
      }
    } catch (error) {
      console.log(error);
      setResult("Something went wrong!");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setResult('');
      }, 3000);
    }
  };

  return (
    <section className="page-section" id="contact">
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading text-uppercase">Contact</h2>
          <br/>
        </div>
        <form onSubmit={handleSubmit} id="contactForm">

          <div className="row align-items-stretch mb-5">
            <div className="col-md-6">
              <div className="form-group">
                <input
                  className="form-control"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback" data-sb-feedback="name:required">A name is required.</div>
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback" data-sb-feedback="email:required">An email is required.</div>
                <div className="invalid-feedback" data-sb-feedback="email:email">Email is not valid.</div>
              </div>
              <div className="form-group mb-md-4">
                <input
                  className="form-control"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Your Phone *"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback" data-sb-feedback="phone:required">A phone number is required.</div>
              </div>
                <div className="form-group form-group-textarea mb-md-0">
                  <textarea
                    className="form-control"
                    name="message"
                    id="message"
                    placeholder="Your Message *"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <div className="invalid-feedback" data-sb-feedback="message:required">A message is required.</div>
                </div>
                <div className="text-center">
                  <br/>
                  {result && <h3 id="contact_success" className="section-subheading text-white">{result}</h3>}
                  <button className="btn btn-xl text-uppercase" style={{backgroundColor: '#f3a32c', color: 'white'}} type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
            </div>

            <div className="col-md-6 text-center" id="map_section">
                    <a href="https://www.google.com/maps?q=44.67031633145772,-74.96599605289967" target="_blank">
                             <img src="/masjid_location.png" id="map" alt="Potsdam Masjid Location" className="img-fluid mx-auto" />
                    </a> 
                    <br/>
                    <br/>
                    <h3 className="section-subheading text-white">
                             Email: masjid110@hotmail.com <br></br>
                             Address: 110 Elm St, Potsdam, NY 13676
                    </h3>
                     
            </div>
          </div>
          {/* <div className="text-center">
            {result && <h3 id="contact_success" className="section-subheading text-white">{result}</h3>}
            <button className="btn btn-primary btn-xl text-uppercase" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div> */}
        </form>
      </div>
    </section>
  );
}

export default ContactForm;

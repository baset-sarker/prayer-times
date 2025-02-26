import React from 'react';

const Contact = () => {
  return (

        <section className="page-section" id="contact" >
            <div className="container">
                <div className="row my-5">
                    <div className="col-lg-6  col-md-6  text-center">
                        <h2 className="section-heading text-uppercase">Contact</h2>
                        <h3 className="section-subheading text-white">
                            Email: masjid110@hotmail.com <br></br>
                            Address: 110 Elm St, Potsdam, NY 13676
                        </h3>
                        <br></br>
                    </div>
                   <div className="col-lg-6 col-md-6 text-center">
                        <a href="https://www.google.com/maps?q=44.67031633145772,-74.96599605289967" target="_blank">
                            <img src="/masjid_location.png" alt="Potsdam Masjid Location" className="img-fluid mx-auto" />
                        </a>
                    </div>

                </div>
            </div>
        </section>
    
  );
};

export default Contact;
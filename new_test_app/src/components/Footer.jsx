import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div>


        <footer className="footer mb-0 py-4 text-white" style={{backgroundColor: '#04383F' , 
                                                                backgroundImage: 'url(/map-image.png)', 
                                                                backgroundRepeat: 'no-repeat', 
                                                                backgroundPosition: 'center', 
                                                                fontFamily: 'Times New Roman, Times, serif',
                                                                backgroundSize: 'contain'}}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-6 text-center">
                        <h2 className="section-heading text-uppercase">Contact</h2>
                         <h3 className="section-subheading text-white">
                             Email: masjid110@hotmail.com <br></br>
                             Address: 110 Elm St, Potsdam, NY 13676
                         </h3>
                    </div>
                    <div className="col-lg-6 col-md-6 text-center">
                            <a href="https://www.google.com/maps?q=44.67031633145772,-74.96599605289967" target="_blank">
                             <img src="/masjid_location.png" alt="Potsdam Masjid Location" className="img-fluid mx-auto" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>

        <footer class="footer mb-0 py-4 text-white" style={{backgroundColor: '#04383F' , borderTop: '1px solid #f3a32c'}}>
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-4 text-lg-start">Copyright &copy; Potsdam Masjid {currentYear}</div>
                    <div class="col-lg-4 my-3 my-lg-0">
                         Address: 110 Elm St, Potsdam, NY 13676
                        {/* <a class="btn btn-dark btn-social mx-2" href="#!" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a class="btn btn-dark btn-social mx-2" href="#!" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a class="btn btn-dark btn-social mx-2" href="#!" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a> */}
                    </div>
                    {/* <div class="col-lg-4 text-lg-end">
                        <a class="link-dark text-decoration-none me-3" href="#!">Privacy Policy</a>
                        <a class="link-dark text-decoration-none" href="#!">Terms of Use</a>
                    </div> */}
                </div>
            </div>
        </footer>
    </div>
  );
};

export default Footer;
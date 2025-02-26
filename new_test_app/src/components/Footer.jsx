import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div>
        {/* <div className='row'>
           <div className="flex justify-center items-center h-screen">
            <img 
                src="/web_link_qr_code.png" 
                alt="Potsdam Masjid" 
                className="img-fluid" 
                style={{width: '150px'}}
            />
            </div>
        </div> */}

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
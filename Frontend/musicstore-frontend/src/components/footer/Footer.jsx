import './style/Footer.scss';
function Footer() {

    return (
      <div className="footer-wrapper">
          <div className="footer">
              <div className="left-container">
                  <h5>About us</h5>
                  <p>
                      We are a project dedicated to bachelor&apos;s<br/>
                      degree thesis, focused on microservices web<br/>
                      appications.
                  </p>
              </div>
              <div className="right-container">
                  <h5>Contact</h5>
                  <p>E-mail: fancystrings@gmail.com</p>
              </div>
          </div>
      </div>
    );
}

export default Footer;
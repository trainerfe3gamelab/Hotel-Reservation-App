import React from "react";

const Footer = () => {
  return (
    <div className="bg-primary py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <h1 className="text-white fw-bold fs-3">Hotel App</h1>
          </div>
          <div className="col-md-6">
            <div className="d-flex flex-column flex-md-row justify-content-end align-items-center">
              <p className="text-white mb-2 mb-md-0 me-md-4">Privacy Policy</p>
              <p className="text-white mb-0">Terms and Conditions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

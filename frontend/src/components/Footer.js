import React from "react";

const Footer = () => {
  return (
    <div className="bg-primary py-5 position-fixed bottom-0 w-100">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h1 className="text-white fw-bold fs-3">Hotel App</h1>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-end">
              <p className="text-white me-4">Privacy Policy</p>
              <p className="text-white">Terms and Conditions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="container dashboard-container">
      <h2 className="fw-bold fs-3 mt-4">Admin Dashboard</h2>
      <div className="row g-4 mt-4">
        <div className="col-12 col-md-6">
          <div className="card h-100 border-secondary rounded-3 shadow-sm">
            <div className="card-body d-flex flex-column justify-content-between">
              <h3 className="card-title fw-bold">Manage Users</h3>
              <p className="card-text">
                Add, edit, or remove users from the platform.
              </p>
              <Link to="/manage-users" className="btn btn-primary mt-auto">
                Go to Users
              </Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card h-100 border-secondary rounded-3 shadow-sm">
            <div className="card-body d-flex flex-column justify-content-between">
              <h3 className="card-title fw-bold">Manage Hotels</h3>
              <p className="card-text">
                Add, edit, or remove hotels and manage hotel details.
              </p>
              <Link to="/manage-hotels" className="btn btn-primary mt-auto">
                Go to Hotels
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React from "react";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { Link } from "react-router-dom";

const Header = () => {
  const { isLoggedIn, isAdmin } = useAppContext();

  return (
    <div className="bg-primary py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <span className="text-white fs-3 fw-bold">
          <Link to="/" className="text-white text-decoration-none">
            Hotel App
          </Link>
        </span>
        <span className="d-flex space-right2 gap-3">
          {isLoggedIn ? (
            <>
              <Link
                className="btn btn-light rounded-pill text-primary fw-bold"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              { isAdmin && (
                <Link
                  className="btn btn-light rounded-pill text-primary fw-bold"
                  to="/my-hotels"
                >
                  My Hotels
                </Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/login"
              className="btn btn-light rounded-pill text-primary fw-bold"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;

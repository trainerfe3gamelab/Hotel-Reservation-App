import React from "react";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
    const { isLoggedIn } = useAppContext();
  return (
    
    <div className="bg-primary py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <span className="text-white fs-3 fw-bold">
          <a href="/" className="text-white text-decoration-none">
            Hotel App
          </a>
        </span>
        <span className="d-flex align-items-center">
            {isLoggedIn ? (
                <SignOutButton />
            ) : (
                <a
                    href="/login"
                    className="btn btn-light rounded-pill text-primary fw-bold me-2"
                >
                    Sign In
                </a>
            )}
        </span>
      </div>
    </div>
  );
};

export default Header;

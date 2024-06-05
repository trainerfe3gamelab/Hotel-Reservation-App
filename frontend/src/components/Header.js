import React from "react";

const Header = () => {
    const user = false;

    const isAdmin = false;

    const isSuperAdmin = false;
  return (
    
    <div className="bg-primary py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <span className="text-white fs-3 fw-bold">
          <a href="/" className="text-white text-decoration-none">
            Hotel App
          </a>
        </span>
        <span className="d-flex align-items-center">
            {user ? (
                <a
                    href="/api/auth/logout"
                    className="btn btn-light rounded-pill text-primary fw-bold me-2"
                >
                    Sign Out
                </a>
            ) : (
                <a
                    href="/api/auth/login"
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

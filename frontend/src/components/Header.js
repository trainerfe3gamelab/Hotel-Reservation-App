import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";

const Header = () => {
  const { isLoggedIn, isAdmin } = useAppContext();
  const { showToast } = useAppContext();
  const mutation = useMutation(apiClient.signOut, {
    onSuccess: () => {
      showToast({
        message: "Sign Out Successful",
        type: "SUCCESS",
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: "ERROR",
      });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
          Hotel Reservation App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="gap-3">
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/my-bookings" className="fw-bold">
                  My Bookings
                </Nav.Link>
                {isAdmin && (
                  <>
                    <Nav.Link as={Link} to="/my-hotels" className="fw-bold">
                      My Hotels
                    </Nav.Link>
                    <Nav.Link as={Link} to="/dashboard" className="fw-bold">
                      Dashboard
                    </Nav.Link>
                  </>
                )}
                {/* Profile icon for desktop */}
                <NavDropdown
                  title={<FaUserCircle size={30} />}
                  id="profile-dropdown"
                  align="end"
                  className="fw-bold text-light d-none d-lg-block"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/my-profile"
                    className="btn btn-light rounded-pill text-primary fw-bold"
                  >
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={handleClick}
                    className="btn btn-light rounded-pill text-primary fw-bold"
                  >
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
                {/* Profile and Sign Out links for mobile */}
                <Nav.Link as={Link} to="/my-profile" className="fw-bold d-lg-none">
                  My Profile
                </Nav.Link>
                <Button
                  variant="light"
                  className="fw-bold text-primary d-lg-none"
                  onClick={handleClick}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                as={Link}
                to="/login"
                variant="light"
                className="fw-bold text-primary mt-2"
              >
                Sign In
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/Signin";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Booking from "./pages/Booking";
import Detail from "./pages/Detail";
import MyBookings from "./pages/MyBooking";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAppContext } from "./contexts/AppContext";
import MyProfile from "./pages/MyProfile";
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageHotels from "./pages/ManageHotels";

function App() {
  const { isLoggedIn } = useAppContext();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
        {isLoggedIn && (
          <>
            <Route
              path="/my-profile"
              element={
                <Layout>
                  <MyProfile />
                </Layout>
              }
            />
            <Route
              path="/hotel/:hotelId/booking"
              element={
                <Layout>
                  <Booking />
                </Layout>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <Layout>
                  <MyBookings />
                </Layout>
              }
            />
            {/* Protect the admin-only routes */}
            <Route
              path="/my-hotels"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Layout>
                    <MyHotels />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <ProtectedRoute adminOnly={true}>
                    <Dashboard />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/manage-users"
              element={
                <Layout>
                  <ProtectedRoute adminOnly={true}>
                    <ManageUsers />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/manage-hotels"
              element={
                <Layout>
                  <ProtectedRoute adminOnly={true}>
                    <ManageHotels />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/add-hotel"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Layout>
                    <AddHotel />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-hotel/:hotelId"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Layout>
                    <EditHotel />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { Link } from "react-router-dom";
import { BsMap, BsBuilding } from "react-icons/bs";
import { BiMoney, BiHotel, BiStar } from "react-icons/bi";
import "./css/MyHotel.css";

const MyHotels = () => {
  const {
    data: hotelData,
    isLoading,
    error,
  } = useQuery("fetchMyHotels", apiClient.fetchMyHotels, {
    onError: (err) => {
      console.error("Error fetching hotels:", err);
    },
  });

  // Tampilkan loading spinner atau pesan loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (error) {
    return <div>Error loading hotels. Please try again later.</div>;
  }

  // Tampilkan pesan jika tidak ada hotel yang ditemukan
  if (!hotelData || hotelData.length === 0) {
    return (
        <div className="center-container">
          <h1>No Hotel Found</h1>
          <Link to="/add-hotel" className="btn-mid btn btn-primary">Add Hotel</Link>
        </div>
      );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-md-start">My Hotels</h1>
        <Link to="/add-hotel" className="btn btn-primary">
          Add Hotel
        </Link>
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {hotelData.map((hotel) => (
          <div key={hotel.hotelId} className="col">
            <div className="card h-100 border border-secondary rounded-3 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h2 className="card-title fw-bold">{hotel.name}</h2>
                <p className="card-text">{hotel.description}</p>
                <div className="mt-3">
                  <div className="d-flex align-items-center mb-2">
                    <BsMap className="me-2" />
                    <span>
                      {hotel.city}, {hotel.country}
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <BsBuilding className="me-2" />
                    <span>{hotel.type}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <BiMoney className="me-2" />
                    <span>${hotel.pricePerNight} per night</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <BiHotel className="me-2" />
                    <span>
                      {hotel.adultCount} Adults, {hotel.childrenCount} Children
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <BiStar className="me-2" />
                    <span>{hotel.starRating} Stars</span>
                  </div>
                </div>
                <div className="mt-auto d-flex justify-content-end">
                  <Link
                    to={`/edit-hotel/${hotel.hotelId}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
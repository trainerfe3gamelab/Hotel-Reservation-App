import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { Link } from "react-router-dom";
import { BsMap, BsBuilding } from "react-icons/bs";
import { BiMoney, BiHotel, BiStar, BiTrash } from "react-icons/bi";
import Swal from "sweetalert2";
import "./css/MyHotel.css";
import LoadingSpinner from "../components/LoadingSpinner";

const MyHotels = () => {
  const queryClient = useQueryClient();

  const {
    data: hotelData,
    isLoading,
    error,
  } = useQuery("fetchMyHotels", apiClient.fetchMyHotels, {
    onError: (err) => {
      console.error("Error fetching hotels:", err);
    },
  });

  const deleteHotelMutation = useMutation(
    (hotelId) => apiClient.deleteHotel(hotelId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("fetchMyHotels");
      },
      onError: (err) => {
        console.error("Error deleting hotel:", err);
        Swal.fire("Error", "There was an error deleting the hotel.", "error");
      },
    }
  );

  const handleDelete = (hotelId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteHotelMutation.mutate(hotelId, {
          onSuccess: () => {
            Swal.fire("Deleted!", "Your hotel has been deleted.", "success");
          },
        });
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error loading hotels. Please try again later.</div>;
  }

  if (!hotelData || hotelData.length === 0) {
    return (
      <div className="center-container" style={{ marginTop: "50px" }}>
        <h1>No Hotel Found</h1>
        <Link to="/add-hotel" className="btn-mid btn btn-primary">
          Add Hotel
        </Link>
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
                <div className="mt-auto d-flex justify-content-between">
                  <Link
                    to={`/edit-hotel/${hotel.hotelId}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(hotel.hotelId)}
                  >
                    <BiTrash /> Delete
                  </button>
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

import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import Swal from "sweetalert2";
import LoadingSpinner from "../components/LoadingSpinner";

const ManageHotels = () => {
  const queryClient = useQueryClient();

  const {
    data: hotels,
    isLoading,
    error,
  } = useQuery("fetchHotels", apiClient.fetchHotels, {
    onError: (err) => {
      console.error("Error fetching hotels:", err);
    },
  });

  const deleteHotelMutation = useMutation(
    (hotelId) => apiClient.deleteHotel(hotelId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("fetchHotels");
        Swal.fire("Deleted!", "Hotel has been deleted.", "success");
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
        deleteHotelMutation.mutate(hotelId);
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error loading hotels. Please try again later.</div>;
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="text-center">
        <h1>No hotels found.</h1>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="fw-bold fs-3 mt-4">Manage Hotels</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-4">
        {hotels.map((hotel) => (
          <div key={hotel.hotelId} className="col">
            <div className="card h-100 border border-secondary rounded-3 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h3 className="card-title fw-bold">{hotel.name}</h3>
                <p className="card-text">{hotel.description}</p>
                <div className="mt-auto d-flex justify-content-between">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(hotel.hotelId)}
                  >
                    Delete
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

export default ManageHotels;

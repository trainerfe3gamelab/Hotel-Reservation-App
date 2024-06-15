import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";

const LatestDestinationCard = ({ hotel }) => {
  const imageUrls = hotel.imageUrls ? JSON.parse(hotel.imageUrls) : [];
  const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : "";

  const [averageRating, setAverageRating] = useState(null);
  const [numUsers, setNumUsers] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await apiClient.fetchHotelAverageRating(hotel.hotelId);
        setAverageRating(response.avgRating);
        setNumUsers(response.numUsers); 
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAverageRating();
  }, [hotel.hotelId]);

  const formatRating = (avgRating, numUsers) => {
    if (avgRating === null || typeof avgRating === "undefined") {
      return "No Rating yet";
    } else if (error) {
      return "Failed to fetch rating";
    } else {
      const ratingValue = avgRating.toFixed(1);
      return `Rating: ${ratingValue} ★ (${numUsers})`;
    }
  };

  return (
    <div className="card overflow-hidden rounded-md">
      <Link to={`/detail/${hotel.hotelId}`}>
        {firstImageUrl && (
          <img
            src={firstImageUrl}
            className="card-img-top"
            alt={hotel.name}
            onError={(e) => {
              e.target.src = "fallback-image-url.png";
            }}
          />
        )}
      </Link>
      <div className="d-flex flex-column justify-content-between card-body bg-dark text-white gap-2">
        <h5 className="card-title">{hotel.name}</h5>
        <p className="card-title" style={{ marginTop: "2px" }}>
          {hotel.city}, {hotel.country}
        </p>
        <p className="card-text">
          {formatRating(averageRating, numUsers)}
        </p>
      </div>
    </div>
  );
};

export default LatestDestinationCard;

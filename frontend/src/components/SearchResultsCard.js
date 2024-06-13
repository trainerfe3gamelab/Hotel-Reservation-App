import React from "react";
import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";

const SearchResultsCard = ({ hotel }) => {
  // Ensure hotel object exists and has necessary fields
  if (!hotel) {
    return <div className="alert alert-danger">Hotel data not found.</div>;
  }

  // Parse imageUrls if it's a JSON string, or use as-is if it's already an array
  const imageUrlsArray = Array.isArray(hotel.imageUrls)
    ? hotel.imageUrls
    : JSON.parse(hotel.imageUrls || '[]'); // Default to empty array if parsing fails

  // Ensure imageUrls array exists and has at least one image URL
  const imageUrl = imageUrlsArray.length > 0 ? imageUrlsArray[0] : 'https://via.placeholder.com/250x250?text=No+Image';

  return (
    <div className="row border border-secondary rounded p-3 mb-3">
      <div className="col-lg-4">
        <img
          src={imageUrl}
          className="img-fluid rounded"
          alt={hotel.name || 'Hotel Image'}
        />
      </div>
      <div className="col-lg-8 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex align-items-center mb-2">
            <span className="d-flex">
              {hotel.starRating && Array.from({ length: hotel.starRating }).map((_, index) => (
                <AiFillStar key={index} className="text-warning me-1" />
              ))}
            </span>
            <span className="text-muted ms-2">{hotel.type || 'Type not specified'}</span>
          </div>

          <Link
            to={`/detail/${hotel.hotelId}`}
            className="text-dark fs-3 fw-bold"
          >
            {hotel.name || 'Hotel Name'}
          </Link>
        </div>

        <div className="my-3">
          <p className="text-muted text-truncate-3">{hotel.description || 'No description available'}</p>
        </div>

        <div className="d-flex justify-content-between align-items-end">
          <div className="d-flex flex-wrap gap-2">
            {Array.isArray(hotel.facilities) &&
              hotel.facilities.slice(0, 3).map((facility, index) => (
                <span key={index} className="badge bg-secondary p-2 rounded">
                  {facility}
                </span>
              ))}
            {Array.isArray(hotel.facilities) && hotel.facilities.length > 3 && (
              <span className="text-muted">
                +{hotel.facilities.length - 3} more
              </span>
            )}
          </div>
          <div className="text-end">
            <span className="fw-bold d-block">
              ${hotel.pricePerNight || 'Price not available'} per night
            </span>
            <Link
              to={`/detail/${hotel.hotelId}`}
              className="btn btn-primary mt-2"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;

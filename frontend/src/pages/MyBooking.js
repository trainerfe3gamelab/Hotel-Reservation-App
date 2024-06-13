import React from 'react';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const MyBookings = () => {
  const { data: hotels, isLoading, isError } = useQuery(
    'fetchMyBookings',
    apiClient.fetchMyBookings
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error loading bookings</span>;
  }

  if (!hotels || hotels.length === 0) {
    return <span>No bookings found</span>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">My Bookings</h1>
      {hotels.map((hotel, index) => (
        <div className="row border border-secondary rounded mb-4 p-3" key={index}>
          <div className="col-lg-4 mb-3 mb-lg-0">
            <img
              src={hotel.imageUrls ? JSON.parse(hotel.imageUrls)[0] : 'https://via.placeholder.com/250x250?text=No+Image'}
              alt={hotel.name || 'Hotel image'}
              className="img-fluid rounded"
            />
          </div>
          <div className="col-lg-8">
            <h2 className="h4">{hotel.name}</h2>
            <p className="text-muted mb-3">
              {hotel.city}, {hotel.country}
            </p>
            <div className="overflow-auto mb-3" style={{ maxHeight: '200px' }}>
              {hotel.bookings && hotel.bookings.length ? (
                hotel.bookings.map((booking, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="mb-1">
                      <strong>Dates:</strong>{' '}
                      <span>
                        {new Date(booking.checkIn).toDateString()} - {new Date(booking.checkOut).toDateString()}
                      </span>
                    </div>
                    <div>
                      <strong>Guests:</strong>{' '}
                      <span>
                        {booking.adultCount} adults, {booking.childrenCount} children
                      </span>
                    </div>
                    <div className="mt-2">
                      <strong>Rating:</strong>{' '}
                      <span className="d-flex">
                        {[...Array(5)].map((_, starIndex) => (
                          starIndex < booking.rating
                            ? <AiFillStar key={starIndex} className="text-warning" />
                            : <AiOutlineStar key={starIndex} className="text-muted" />
                        ))}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <span>No bookings available</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;

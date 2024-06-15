import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import LoadingSpinner from '../components/LoadingSpinner';

const MyBookings = () => {
  const { data: hotels, isLoading, isError, refetch } = useQuery(
    'fetchMyBookings',
    apiClient.fetchMyBookings
  );

  const [ratingInput, setRatingInput] = useState({});
  const [ratingError, setRatingError] = useState({});
  const [filledRatingStatus, setFilledRatingStatus] = useState({});

  useEffect(() => {
    if (hotels) {
      const initialRatings = {};
      const initialFilledStatus = {};
      hotels.forEach(hotel => {
        hotel.bookings.forEach(booking => {
          if (booking.rating) {
            initialRatings[booking.hotelId] = booking.rating;
            initialFilledStatus[booking.hotelId] = true;
          } else {
            initialFilledStatus[booking.hotelId] = false;
          }
        });
      });
      setRatingInput(initialRatings);
      setFilledRatingStatus(initialFilledStatus);
    }
  }, [hotels]);

  const handleRatingChange = (hotelId, rating) => {
    setRatingInput({ ...ratingInput, [hotelId]: rating });
  };

  const handleRateHotel = async (hotelId) => {
    try {
      if (!ratingInput[hotelId]) {
        setRatingError({ ...ratingError, [hotelId]: 'Please provide a rating' });
        return;
      }

      await apiClient.rateHotel(hotelId, ratingInput[hotelId]);
      setRatingInput({ ...ratingInput, [hotelId]: undefined }); 
      setRatingError({ ...ratingError, [hotelId]: '' });
      await refetch();
    } catch (error) {
      setRatingError({ ...ratingError, [hotelId]: error.message });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
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
                  <div key={idx} className="mb-3">
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
                      <strong>Your Rating:</strong>{' '}
                      {filledRatingStatus[booking.hotelId] ? (
                        <span>
                          <span className="d-flex" style={{ outline: 'none' }}>
                            {[...Array(5)].map((_, starIndex) => (
                              <span
                                key={starIndex}
                                disabled 
                              >
                                {starIndex < ratingInput[booking.hotelId] ? (
                                  <AiFillStar className="text-warning" />
                                ) : (
                                  <AiOutlineStar className="text-muted" />
                                )}
                              </span>
                            ))}
                          </span>
                          <p className="mt-2">Thanks for rating our hotel!</p>
                        </span>
                      ) : (
                        <span className="d-flex">
                          {[...Array(5)].map((_, starIndex) => (
                            <button
                              key={starIndex}
                              className="btn btn-sm p-0"
                              onClick={() => handleRatingChange(booking.hotelId, starIndex + 1)}
                            >
                              {starIndex < (ratingInput[booking.hotelId] || 0) ? (
                                <AiFillStar className="text-warning" />
                              ) : (
                                <AiOutlineStar className="text-muted" />
                              )}
                            </button>
                          ))}
                        </span>
                      )}
                    </div>
                    {!filledRatingStatus[booking.hotelId] && (
                      <div className="mt-2">
                        <button className="btn btn-primary btn-sm" onClick={() => handleRateHotel(booking.hotelId)}>
                          Rate Hotel
                        </button>
                        {ratingError[booking.hotelId] && <span className="text-danger ml-2">{ratingError[booking.hotelId]}</span>}
                      </div>
                    )}
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

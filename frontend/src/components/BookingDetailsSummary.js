import React from "react";

const BookingDetailsSummary = ({
  checkIn,
  checkOut,
  adultCount,
  childrenCount,
  numberOfNights,
  hotel,
}) => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card border border-slate-300 p-5">
            <h2 className="card-title text-xl font-bold mb-4">Your Booking Details</h2>
            <div className="border-bottom py-2">
              Location:
              <div className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                Check-in
                <div className="font-bold"> {checkIn.toDateString()}</div>
              </div>
              <div>
                Check-out
                <div className="font-bold"> {checkOut.toDateString()}</div>
              </div>
            </div>
            <div className="border-top border-bottom py-2">
              Total length of stay:
              <div className="font-bold">{numberOfNights} nights</div>
            </div>

            <div>
              Guests{" "}
              <div className="font-bold">
                {adultCount} adults & {childrenCount} children
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsSummary;

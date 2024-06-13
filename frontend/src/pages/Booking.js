import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Elements } from "@stripe/react-stripe-js";
import BookingForm from "../forms/BookingForm/BookingForm";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { useSearchContext } from "../contexts/SearchContext";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";

const Booking = () => {
  const { stripePromise } = useAppContext();
  const search = useSearchContext();
  const { hotelId } = useParams();

  const [numberOfNights, setNumberOfNights] = useState(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(
        hotelId,
        numberOfNights.toString()
      ),
    {
      enabled: !!hotelId && numberOfNights > 0,
    }
  );

  const { data: hotel } = useQuery(
    "fetchHotelByID",
    () => apiClient.fetchHotelById(hotelId),
    {
      enabled: !!hotelId,
    }
  );

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  if (!hotel) {
    return null;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <BookingDetailsSummary
            checkIn={search.checkIn}
            checkOut={search.checkOut}
            adultCount={search.adultCount}
            childrenCount={search.childrenCount}
            numberOfNights={numberOfNights}
            hotel={hotel}
          />
        </div>
        <div className="col-md-6">
          {currentUser && paymentIntentData && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: paymentIntentData.client_secret,
              }}
            >
              <BookingForm
                currentUser={currentUser}
                paymentIntent={paymentIntentData}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;

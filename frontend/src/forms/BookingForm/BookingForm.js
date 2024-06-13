import { useForm } from "react-hook-form";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

const BookingForm = ({ currentUser, paymentIntent }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const search = useSearchContext();
  const { hotelId } = useParams();

  const { showToast } = useAppContext();

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved!", type: "SUCCESS" });
        navigate("/")
      },
      onError: () => {
        showToast({ message: "Error saving booking", type: "ERROR" });
      },
    }
  );

  const { handleSubmit, register } = useForm({
    defaultValues: {
      fullName: currentUser.fullName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childrenCount: search.childrenCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  const onSubmit = async (formData) => {
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.paymentIntent?.status === "succeeded") {
      bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5">
      <h1 className="text-3xl font-bold mb-5">Confirm Your Details</h1>
      <div className="mb-3 row">
        <label className="col-sm-6 col-form-label">Fullname</label>
        <div className="col-sm-6">
          <input
            className="form-control"
            type="text"
            readOnly
            disabled
            {...register("fullName")}
          />
        </div>
      </div>
      <div className="mb-3 row">
        <label className="col-sm-6 col-form-label">Email</label>
        <div className="col-sm-6">
          <input
            className="form-control"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </div>
      </div>
      <div className="mb-3">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>
        <div className="bg-blue-200 p-4 rounded-md mb-3">
          <div className="font-semibold text-lg">
            Total Cost: ${paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>
      <div className="mb-3">
        <h3 className="text-xl font-semibold">Payment Details</h3>
        <CardElement
          id="payment-element"
          className="border rounded-md p-2 text-sm form-control"
        />
      </div>
      <div className="mb-3 d-grid gap-2 d-md-flex justify-content-md-end">
        <button
          disabled={isLoading}
          type="submit"
          className="btn btn-primary btn-lg"
        >
          {isLoading ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;

import { useState } from "react";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const GuestInfoForm = ({ hotelId, pricePerNight }) => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [checkIn, setCheckIn] = useState(search.checkIn);
  const [checkOut, setCheckOut] = useState(search.checkOut);
  const [adultCount, setAdultCount] = useState(search.adultCount);
  const [childrenCount, setChildrenCount] = useState(search.childrenCount);

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignInClick = () => {
    search.saveSearchValues("", checkIn, checkOut, adultCount, childrenCount);
    navigate("/login", { state: { from: location } });
  };

  const onSubmit = () => {
    search.saveSearchValues("", checkIn, checkOut, adultCount, childrenCount);
    navigate(`/hotel/${hotelId}/booking`);
  };

  return (
    <div className="container p-4 bg-light gap-4">
      <h3 className="text-md font-bold">${pricePerNight}</h3>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="row row-cols-1 gap-4 align-items-center">
          <div className="col">
            <DatePicker
              required
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-in Date"
              className="form-control"
              wrapperClassName="w-100"
            />
          </div>
          <div className="col">
            <DatePicker
              required
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-out Date"
              className="form-control"
              wrapperClassName="w-100"
            />
          </div>
          <div className="col-12 col-lg-3 w-auto">
            <label className="d-flex align-items-center">
              Adults:
              <input
                className="form-control"
                type="number"
                min={1}
                max={20}
                value={adultCount}
                onChange={(e) => setAdultCount(e.target.value)}
              />
            </label>
          </div>
          <div className="col-12 col-lg-3 w-auto">
            <label className="d-flex align-items-center">
              Children
              <input
                className="form-control"
                type="number"
                min={0}
                max={20}
                value={childrenCount}
                onChange={(e) => setChildrenCount(e.target.value)}
              />
            </label>
          </div>
          <div className="col">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
            >
              {isLoggedIn ? "Book Now" : "Sign in to Book"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GuestInfoForm;

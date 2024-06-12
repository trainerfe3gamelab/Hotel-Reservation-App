import React, { useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();

  // Initialize state variables for input values
  const [destination, setDestination] = useState(search.destination || "");
  const [checkIn, setCheckIn] = useState(search.checkIn || new Date());
  const [checkOut, setCheckOut] = useState(search.checkOut || new Date());
  const [adultCount, setAdultCount] = useState(search.adultCount || 1);
  const [childrenCount, setChildrenCount] = useState(search.childrenCount || 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childrenCount
    );
    navigate("/search");
  };

  const handleClear = () => {
    setDestination("");
    setCheckIn(new Date());
    setCheckOut(new Date());
    setAdultCount(1);
    setChildrenCount(0);
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-warning p-3 rounded shadow-sm row align-items-center mt-3"
    >
      <div className="col-md-4 d-flex align-items-center mb-3 mb-md-0">
        <MdTravelExplore size={25} className="me-2" />
        <input
          type="text"
          placeholder="Where are you going?"
          className="form-control"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      {/* Adults and Children Count */}
      <div className="col-md-2 d-flex flex-column flex-md-row align-items-center mb-3 mb-md-0 gap-2">
        <div>
          <label className="form-label">
            Adults:
            <input
              type="number"
              className="form-control"
              min={1}
              max={20}
              value={adultCount}
              onChange={(event) => setAdultCount(parseInt(event.target.value))}
            />
          </label>
        </div>
        <div>
          <label className="form-label">
            Children:
            <input
              type="number"
              className="form-control"
              min={0}
              max={20}
              value={childrenCount}
              onChange={(event) => setChildrenCount(parseInt(event.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="col-md-2 mb-3 mb-md-0">
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in date"
          className="form-control"
        />
      </div>

      <div className="col-md-2 mb-3 mb-md-0">
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-out date"
          className="form-control"
        />
      </div>

      <div className="col-md-2 d-flex gap-2">
        <button type="submit" className="btn btn-primary w-50">
          Search
        </button>
        <button type="button" onClick={handleClear} className="btn btn-danger w-50">
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

import React, { useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();

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
    <Form onSubmit={handleSubmit} className="bg-warning p-3 rounded shadow-sm" style={{ height: "auto", marginTop: "-50px" }}>
      <Row className="g-3 align-items-center">
        <Col md={4} xs={12}>
          <InputGroup className="flex-nowrap" style={{marginTop: "33px"}}>
            <InputGroup.Text>
              <MdTravelExplore size={25} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Where are you going?"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              aria-label="Destination"
            />
          </InputGroup>
        </Col>

        {/* Adults and Children Count */}
        <Col md={2} xs={6}>
          <Form.Group controlId="formAdultCount">
            <Form.Label>Adults:</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={20}
              value={adultCount}
              onChange={(event) => setAdultCount(parseInt(event.target.value))}
              aria-label="Adult Count"
            />
          </Form.Group>
        </Col>

        <Col md={2} xs={6}>
          <Form.Group controlId="formChildrenCount">
            <Form.Label>Children:</Form.Label>
            <Form.Control
              type="number"
              min={0}
              max={20}
              value={childrenCount}
              onChange={(event) => setChildrenCount(parseInt(event.target.value))}
              aria-label="Children Count"
            />
          </Form.Group>
        </Col>

        {/* Date Pickers */}
        
        <Col md={2} xs={6}>
          <Form.Group controlId="formCheckInDate">
            <Form.Label>Check-in:</Form.Label>
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
          </Form.Group>
        </Col>

        <Col md={2} xs={6}>
          <Form.Group controlId="formCheckOutDate">
            <Form.Label>Check-out:</Form.Label>
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
          </Form.Group>
        </Col>

        <Col md={2} xs={12} className="d-flex flex-column flex-md-row gap-2 w-100 justify-content-end">
          <Button type="submit" className="btn btn-primary">
            Search
          </Button>
          <Button type="button" onClick={handleClear} className="btn btn-danger">
            Clear
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;

import React from "react";
import { useFormContext } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { HotelFormData } from "./ManageHotelForm";

const GuestSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext(HotelFormData);

  return (
    <div className="d-flex flex-column w-100 align-items-center mb-3">
      <h2 className="mb-3">Guests</h2>

      <div className="w-50">  {/* Ubah dari <Form> ke <div> */}
        <Row className="mb-3 w-100">
          <Form.Group as={Col} controlId="adultCount">
            <Form.Label>Adults</Form.Label>
            <Form.Control
              type="number"
              min={1}
              {...register("adultCount", {
                required: "This field is required",
              })}
              isInvalid={!!errors.adultCount}
            />
            <Form.Control.Feedback type="invalid">
              {errors.adultCount?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="childrenCount">
            <Form.Label>Children</Form.Label>
            <Form.Control
              type="number"
              min={0}
              {...register("childrenCount", {
                required: "This field is required",
              })}
              isInvalid={!!errors.childrenCount}
            />
            <Form.Control.Feedback type="invalid">
              {errors.childrenCount?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
      </div>
    </div>
  );
};

export default GuestSection;

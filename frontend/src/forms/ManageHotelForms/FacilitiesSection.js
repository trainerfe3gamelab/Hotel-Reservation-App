import React from "react";
import { useFormContext } from "react-hook-form";
import Form from "react-bootstrap/Form";
import { hotelFacilities } from "../../config/hotel-option-config";
import "./css/FacilitiesSection.css";

const FacilitiesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="container mt-5">
    <div className="d-flex flex-column mb-3">
      <h2 className="mb-3 align-self-center">Facilities</h2>
      <div className="pos-gr d-flex w-100 justify-content-between">
        {hotelFacilities.map((facility, index) => (
          <Form.Group className="me-3 mb-3" key={index} controlId={`facility-${facility}`}>
            <Form.Check
              type="checkbox"
              label={facility}
              value={facility}
              {...register("facilities", {
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) {
                    return true;
                  } else {
                    return "At least one facility is required";
                  }
                },
              })}
              isInvalid={!!errors.facilities}
            />
          </Form.Group>
        ))}
      </div>
      {errors.facilities && (
        <div className="text-danger font-weight-bold">
          {errors.facilities.message}
        </div>
      )}
    </div>
  </div>
  );
};

export default FacilitiesSection;

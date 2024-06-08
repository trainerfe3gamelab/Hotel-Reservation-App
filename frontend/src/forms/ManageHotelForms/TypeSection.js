import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { hotelTypes } from "../../config/hotel-option-config";
import { HotelFormData } from "./ManageHotelForm";
import "./css/TypeSection.css"; // Import custom CSS for additional styling if needed

const TypeSection = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext(HotelFormData);

  const [selectedType, setSelectedType] = useState(watch("type"));

  const handleSelect = (type) => {
    setSelectedType(type);
    setValue("type", type);
  };

  return (
    <div className="d-flex flex-column w-100 align-items-center mb-3">
      <h2 className="mb-3">Type</h2>
      <div className="button-grid w-75">
        {hotelTypes.map((type, index) => (
          <ButtonGroup key={index} className="button-grid-item">
            <Button
              variant={selectedType === type ? "primary" : "secondary"}
              className="w-100 text-sm rounded font-semibold"
              onClick={() => handleSelect(type)}
            >
              <Form.Check
                type="radio"
                value={type}
                {...register("type", {
                  required: "This field is required",
                })}
                className="d-none"
                checked={selectedType === type}
                onChange={() => handleSelect(type)}
              />
              {type}
            </Button>
          </ButtonGroup>
        ))}
      </div>
      {errors.type && (
        <div className="text-danger font-weight-bold mt-2">
          {errors.type.message}
        </div>
      )}
    </div>
  );
};

export default TypeSection;

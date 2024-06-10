import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./ImagesSection";

export const HotelFormData = {
  name: String,
  city: String,
  country: String,
  description: String,
  type: String,
  pricePerNight: Number,
  starRating: Number,
  facilities: [],
  imageFiles: FileList,
  adultCount: Number,
  childrenCount: Number,
};

const ManageHotelForm = ({ onSave, isLoading }) => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  const onSubmit = handleSubmit((formDataJson) => {
    const formData = new FormData();
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childrenCount", formDataJson.childrenCount.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append("imageFiles", imageFile);
    });

    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit} className="d-flex flex-column gap-4">
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestSection />
        <ImagesSection />

        <div className="d-flex justify-content-end m-5">
          <button
            disabled={isLoading}
            type="submit"
            className="btn btn-primary btn-lg"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;

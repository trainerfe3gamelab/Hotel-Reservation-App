import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestSection";
import ImagesSection from "./ImagesSection";

const ManageHotelForm = ({ onSave, isLoading, hotel }) => {
  const formMethods = useForm({
    defaultValues: {
      name: "",
      city: "",
      country: "",
      description: "",
      type: "",
      pricePerNight: 0,
      starRating: 0,
      facilities: [],
      imageFiles: [],
      imageUrls: [],
      adultCount: 0,
      childrenCount: 0,
    },
  });
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (hotel) {
      const normalizedHotelData = {
        ...hotel,
        facilities: Array.isArray(hotel.facilities) ? hotel.facilities : [],
      };
      reset(normalizedHotelData);
    }
  }, [hotel, reset]);

  const onSubmit = handleSubmit((formDataJson) => {
    const formData = new FormData();

    if (hotel) {
      formData.append("hotelId", hotel.hotelId); // Menambahkan hotelId jika ada
    }

    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childrenCount", formDataJson.childrenCount.toString());

    if (Array.isArray(formDataJson.facilities)) {
      formDataJson.facilities.forEach((facility, index) => {
        formData.append(`facilities[${index}]`, facility);
      });
    }

    if (Array.isArray(formDataJson.imageUrls)) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }

    if (formDataJson.imageFiles instanceof FileList) {
      Array.from(formDataJson.imageFiles).forEach((imageFile) => {
        formData.append("imageFiles", imageFile);
      });
    }

    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;

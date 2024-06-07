import { FormProvider, useForm } from "react-hook-form";
import DetailSection from "./DetailSection";
import TypeSection from "./TypeSection";

export const HotelFormData = {
  name: "",
  city: "",
  country: "",
  description: "",
  type: "",
  pricePerNight: 0,
  starRating: 0,
  facilities: [],
  imageFiles: null,
  adultCount: 0,
  childrenCount: 0,
};

const ManageHotelForm = () => {
  const formMethods = useForm(HotelFormData);
  return (
    <FormProvider {...formMethods}>
      <form className="d-flex flex-column gap-5">
        <DetailSection />
        <TypeSection />
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;

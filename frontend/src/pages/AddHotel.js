import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import ManageHotelForm from "../forms/ManageHotelForms/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";

const AddHotel = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({
        message: "Hotel Saved!",
        type: "SUCCESS",
      });
      navigate("/");
    },
    onError: () => {
      
      showToast({
        message: "Failed to save hotel!",
        type: "ERROR",
      });
    },
  });

  const handleSave = (hotelFormData) => {
    mutate(hotelFormData);
  };

  return (
    <ManageHotelForm onSave={handleSave} isLoading={isLoading} />
  );
};

export default AddHotel;

import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import LoadingSpinner from "../components/LoadingSpinner";

const Detail = () => {
  const { hotelId } = useParams();

  const {
    data: hotel,
    error,
    isLoading,
  } = useQuery(
    ["fetchHotelById", hotelId],
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (error) return <div>Error: {error.message}</div>;
  if (!hotel) return <div>No data found</div>;

  const facilities = hotel.facilities ? JSON.parse(hotel.facilities) : [];
  const imageUrls = hotel.imageUrls ? JSON.parse(hotel.imageUrls) : [];

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col">
          <span className="d-flex mb-2">
            {hotel.starRating &&
              [...Array(hotel.starRating)].map((_, index) => (
                <AiFillStar key={index} className="text-warning" />
              ))}
          </span>
          <h1 className="display-4">{hotel.name || "Hotel Name"}</h1>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-lg-3 g-4 my-4">
        {imageUrls.length > 0 &&
          imageUrls.map((image, index) => (
            <div className="col" key={index}>
              <img
                src={image}
                alt={hotel.name}
                className="img-fluid rounded"
                style={{ height: "300px", objectFit: "cover" }}
              />
            </div>
          ))}
      </div>

      <div className="row row-cols-1 row-cols-lg-4 g-2 mb-4">
        {facilities.length > 0 &&
          facilities.map((facility, index) => (
            <div className="col border rounded p-3" key={index}>
              {facility}
            </div>
          ))}
      </div>

      <div className="row row-cols-1 row-cols-lg-2 g-4">
        <div className="col">
          <p>{hotel.description || "No description available"}</p>
        </div>
        <div className="col">
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel.hotelId}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;

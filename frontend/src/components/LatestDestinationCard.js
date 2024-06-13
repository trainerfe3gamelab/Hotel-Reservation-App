import { Link } from "react-router-dom";

const LatestDestinationCard = ({ hotel }) => {
  const imageUrls = hotel.imageUrls ? JSON.parse(hotel.imageUrls) : [];

  const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : "";

  return (
    <div className="card overflow-hidden rounded-md">
      <Link to={`/detail/${hotel.hotelId}`}>
        {firstImageUrl && (
          <img
            src={firstImageUrl}
            className="card-img-top"
            alt={hotel.name}
            onError={(e) => {
              e.target.src = "fallback-image-url.png"; 
            }}
          />
        )}
      </Link>
      <div className="card-body bg-dark text-white">
        <h5 className="card-title">{hotel.name}</h5>
      </div>
    </div>
  );
};

export default LatestDestinationCard;

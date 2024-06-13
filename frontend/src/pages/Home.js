import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LatestDestinationCard";

const Home = () => {
  const { data: hotels } = useQuery("fetchQuery", () =>
    apiClient.fetchHotels()
  );

  const topRowHotels = hotels?.slice(0, 2) || [];
  const bottomRowHotels = hotels?.slice(2) || [];

  return (
    <div className="container my-5">
      <h2 className="text-3xl fw-bold">Latest Destinations</h2>
      <p className="mb-4">Most recent destinations added by our hosts</p>
      
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {topRowHotels.map((hotel, index) => (
          <div className="col" key={index}>
              <LatestDestinationCard hotel={hotel} />
          </div>
        ))}
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {bottomRowHotels.map((hotel, index) => (
          <div className="col" key={index}>
              <LatestDestinationCard hotel={hotel} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

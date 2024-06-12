import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState(1);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(undefined);
  const [sortOption, setSortOption] = useState("");
  const scrollPositionRef = useRef(null);
  const [totalHotelsFound, setTotalHotelsFound] = useState(0);

  const searchParams = {
    destination: search?.destination || "",
    checkIn: search?.checkIn?.toISOString() || "",
    checkOut: search?.checkOut?.toISOString() || "",
    adultCount: search?.adultCount?.toString() || "",
    childrenCount: search?.childrenCount?.toString() || "",
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString() || undefined,
    sortOption,
  };

  const { data: hotelData, isLoading, isError } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  useEffect(() => {
    const saveScrollPosition = () => {
      scrollPositionRef.current = window.pageYOffset;
    };

    window.addEventListener("scroll", saveScrollPosition);

    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
    };
  }, []);

  const restoreScrollPosition = () => {
    window.scrollTo(0, scrollPositionRef.current);
  };

  const handleStarsChange = (event) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleHotelTypeChange = (event) => {
    const hotelType = event.target.value;

    setSelectedHotelTypes((prevHotelTypes) =>
      event.target.checked
        ? [...prevHotelTypes, hotelType]
        : prevHotelTypes.filter((hotel) => hotel !== hotelType)
    );
  };

  const handleFacilityChange = (event) => {
    const facility = event.target.value;

    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
    );
  };

  useEffect(() => {
    if (hotelData?.data) {
      setTotalHotelsFound(hotelData.pagination.total);
    }
  }, [hotelData]);

  const filteredHotels = hotelData?.data.filter((hotel) => {
    if (
      selectedStars.length > 0 &&
      !selectedStars.includes(hotel.starRating.toString())
    ) {
      return false;
    }

    if (
      selectedHotelTypes.length > 0 &&
      !selectedHotelTypes.includes(hotel.type)
    ) {
      return false;
    }

    if (
      selectedFacilities.length > 0 &&
      !selectedFacilities.every((facility) =>
        hotel.facilities.includes(facility)
      )
    ) {
      return false;
    }

    if (selectedPrice !== undefined && hotel.pricePerNight > selectedPrice) {
      return false;
    }

    return true;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-3">
          <div className="rounded-lg border border-secondary p-3 mb-3">
            <h3 className="text-lg font-semibold border-b border-secondary pb-2 mb-3">
              Filter by:
            </h3>
            <StarRatingFilter
              selectedStars={selectedStars}
              onChange={handleStarsChange}
            />
            <HotelTypesFilter
              selectedHotelTypes={selectedHotelTypes}
              onChange={handleHotelTypeChange}
            />
            <FacilitiesFilter
              selectedFacilities={selectedFacilities}
              onChange={handleFacilityChange}
            />
            <PriceFilter
              selectedPrice={selectedPrice}
              onChange={(value) => setSelectedPrice(value)}
            />
          </div>
        </div>
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-xl font-weight-bold">
              {totalHotelsFound} Hotels found
              {search.destination ? ` in ${search.destination}` : ""}
            </span>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="form-select p-2 border rounded-md"
            >
              <option value="">Sort By</option>
              <option value="starRatingDesc">Star Rating (high to low)</option>
              <option value="starRatingAsc">Star Rating (low to high)</option>
              <option value="pricePerNightDesc">
                Price Per Night (high to low)
              </option>
              <option value="pricePerNightAsc">
                Price Per Night (low to high)
              </option>
            </select>
          </div>
          {filteredHotels.map((hotel) => (
            <SearchResultsCard key={hotel.hotelId} hotel={hotel} />
          ))}
          <Pagination
            page={hotelData?.pagination.page || 1}
            pages={hotelData?.pagination.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
          {restoreScrollPosition()}
        </div>
      </div>
    </div>
  );
};

export default Search;

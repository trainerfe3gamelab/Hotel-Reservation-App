import React, { useContext, useState } from "react";

const SearchContext = React.createContext(undefined);

export const SearchContextProvider = ({ children }) => {
  const [destination, setDestination] = useState(
    () => sessionStorage.getItem("destination") || ""
  );
  const [checkIn, setCheckIn] = useState(
    () =>
      new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
  );
  const [checkOut, setCheckOut] = useState(
    () =>
      new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
  );
  const [adultCount, setAdultCount] = useState(() =>
    parseInt(sessionStorage.getItem("adultCount") || "1")
  );
  const [childrenCount, setChildrenCount] = useState(() =>
    parseInt(sessionStorage.getItem("childrenCount") || "1")
  );
  const [hotelId, setHotelId] = useState(
    () => sessionStorage.getItem("hotelId") || ""
  );

  const saveSearchValues = (
    destination,
    checkIn,
    checkOut,
    adultCount,
    childrenCount,
    hotelId
  ) => {
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setAdultCount(adultCount);
    setChildrenCount(childrenCount);
    if (hotelId) {
      setHotelId(hotelId);
    }

    sessionStorage.setItem("destination", destination);
    sessionStorage.setItem("checkIn", checkIn.toISOString());
    sessionStorage.setItem("checkOut", checkOut.toISOString());
    sessionStorage.setItem("adultCount", adultCount.toString());
    sessionStorage.setItem("childrenCount", childrenCount.toString());

    if (hotelId) {
      sessionStorage.setItem("hotelId", hotelId);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        adultCount,
        childrenCount,
        hotelId,
        saveSearchValues,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error(
      "useSearchContext must be used within a SearchContextProvider"
    );
  }
  return context;
};

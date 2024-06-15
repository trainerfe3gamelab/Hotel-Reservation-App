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

export const SearchParams = {
 destination: String,
 checkIn: String,
 checkOut: String,
 adultCount: String,
 childrenCount: String,
 page: String,
 facilities: Array,
 types: Array,
 stars: Array,
 maxPrice: String,
 sortOption: String
};

export const HotelType = {
 hotelId: "",
 userId: "",
 name: "",
 city: "",
 country: "",
 description: "",
 type: "",
 adultCount: 0,
 childrenCount: 0,
 facilities: [],
 pricePerNight: 0,
 starRating: 0,
 imageUrls: [],
 lastUpdated: new Date(),
 bookings: []
};

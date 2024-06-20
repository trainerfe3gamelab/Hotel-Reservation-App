const API_BASE_URL = process.env.REACT_APP_API || "";

export const fetchCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

export const fetchCurrentUserAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/me/admin`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

export const register = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const SignIn = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const addMyHotel = async (hotelFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};

export const fetchMyHotels = async () => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch hotels");
  }

  return response.json();
};

export const deleteHotel = async (hotelId) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/delete/${hotelId}`, {
    method: "DELETE",  // Ensure the method is DELETE
    credentials: "include",  // Include credentials if required (cookies, auth tokens)
  });

  if (!response.ok) {
    throw new Error("Failed to delete hotel");
  }

  return response.json();
};

export const fetchMyHotelById = async (hotelId) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch hotel");
  }

  return response.json();
};

export const updateMyHotelById = async (hotelFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      credentials: "include",
      body: hotelFormData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update hotel");
  }

  return response.json();
};

export const searchHotels = async (searchParams) => {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childrenCount", searchParams.childrenCount || "");
  queryParams.append("page", searchParams.page || "");

  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await fetch(
    `${API_BASE_URL}/api/hotels/search?${queryParams}`
  );

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const fetchHotels = async () => {
  const response = await fetch(`${API_BASE_URL}/api/hotels`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
};

export const fetchHotelById = async (hotelId) => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};

export const createPaymentIntent = async (hotelId, numberOfNights) => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${hotelId}/booking/payment-intent`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfNights }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching payment intent");
  }

  return response.json();
};

export const createRoomBooking = async (formData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${formData.hotelId}/booking`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Error booking room");
  }
};

export const fetchMyBookings = async () => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch bookings");
  }

  return response.json();
};

export const rateHotel = async (hotelId, rating) => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/rating`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ rating }),
  });

  if (!response.ok) {
    throw new Error("Error rating hotel");
  }
};

export const fetchHotelAverageRating = async (hotelId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/hotels/${hotelId}/ratingAvg`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch average ratings");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching profile");
  }
  return response.json();
};

export const updateUserProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message);
  }

  return response.json();
};

export const fetchAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/profile/users`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching users");
  }
  return response.json();
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/profile/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error deleting users");
  }
  return response.json();
};

export const updateUser = async (userId, updatedData) => {
  const { fullName, email, role, password } = updatedData;
  const response = await fetch(`${API_BASE_URL}/api/profile/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ fullName, email, role, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
};

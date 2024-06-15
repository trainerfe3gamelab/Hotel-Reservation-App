import React, { createContext, useContext, useState, useEffect } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUB_KEY = "pk_test_51PPQVXP01Wr75qZsjdZI86cjawzdHYPig3Z6pwRT56hrOiA0iLMTVGkMdta510oxL1E10Nu6iHfJcKmDyKWeE3ex00cBmc0Xc8";
const stripePromise = loadStripe(STRIPE_PUB_KEY);

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [toast, setToast] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { isError: tokenError } = useQuery(
    "validateToken",
    apiClient.validateToken,
    {
      retry: false,
      onSuccess: async () => {
        try {
          const userRole = await apiClient.fetchCurrentUserAdmin();

          setIsAdmin(userRole?.role === "admin");
          setIsLoggedIn(true); 
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsAdmin(false);
        }
      },
    }
  );

  useEffect(() => {
    if (tokenError) {
      setIsLoggedIn(false);
    }
  }, [tokenError]);

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn,
        isAdmin,
        stripePromise,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

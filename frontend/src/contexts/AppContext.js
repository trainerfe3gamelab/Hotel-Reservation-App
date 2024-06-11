import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

const AppContext = React.createContext(undefined);

export const AppContextProvider = ({ children }) => {
  const [toast, setToast] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false); // Menambahkan state isAdmin

  const { isError, data } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });

  // Memeriksa apakah pengguna adalah admin dan mengatur state isAdmin
  React.useEffect(() => {
    if (!isError && data && data.email) {
      const { email } = data;
      const isAdminUser = checkAdminStatusByEmail(email); // Fungsi untuk memeriksa status admin berdasarkan email
      setIsAdmin(isAdminUser);
    }
  }, [isError, data]);

  const checkAdminStatusByEmail = (email) => {

    return email === process.env.REACT_APP_ADMIN_EMAIL;
  };

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        isAdmin: isAdmin, // Menyertakan isAdmin dalam value context
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
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

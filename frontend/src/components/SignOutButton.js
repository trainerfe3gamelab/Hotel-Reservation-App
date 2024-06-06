import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
  const { showToast } = useAppContext();
  const mutation = useMutation(apiClient.signOut, {
    onSuccess: () => {
      showToast({
        message: "Sign Out Successful",
        type: "SUCCESS",
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: "ERROR",
      });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };
  return (
    <button
      onClick={handleClick}
      className="btn btn-light rounded-pill text-primary fw-bold"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;

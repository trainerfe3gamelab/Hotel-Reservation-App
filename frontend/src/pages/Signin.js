import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

/**
 * @typedef {Object} SignInFormData
 * @property {string} email
 * @property {string} password
 */

export const SignInFormData = {
  email: "",
  password: "",
};

export const SignIn = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const mutation = useMutation(apiClient.SignIn, {
    onSuccess: async () => {
      showToast({
        message: "Sign in Successful",
        type: "SUCCESS",
      });
      navigate("/");
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: "ERROR",
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="d-flex flex-column gap-2" onSubmit={onSubmit}>
      <h2 className="fw-bold fs-3 mt-4">Sign In</h2>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && (
          <p className="text-danger">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </form>
  );
};

export default SignIn;

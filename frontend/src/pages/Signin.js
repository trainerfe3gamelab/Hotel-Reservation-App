import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export const SignInFormData = {
  email: String,
  password: String,
};

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false); 
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm(SignInFormData);

  const mutation = useMutation(apiClient.SignIn, {
    onSuccess: async () => {
      showToast({
        message: "Sign in Successful",
        type: "SUCCESS",
      });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: "ERROR",
      });
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); 
  };

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="container">
      <form
        className="d-flex flex-column gap-2 py-5 m-3 w-100"
        onSubmit={onSubmit}
      >
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
        <div className="mb-3 position-relative">
          <label className="form-label">Password</label>
          <input
            type={showPassword ? "text" : "password"} 
            className="form-control"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className={`position-absolute end-0 top-50 translate-middle-y ${showPassword ? 'text-secondary' : 'text-primary'}`}
            style={{ marginTop: "15px", marginRight: "10px", cursor: "pointer" }}
            onClick={togglePasswordVisibility}
          />
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
        </div>
        <span className="d-flex align-items-center justify-content-between">
          <span>
            Not registered yet?{" "}
            <a href="/register" className="text-primary">
              Create an account
            </a>
          </span>
          <button type="submit" className="btn btn-primary btn-lg">
            Login
          </button>
        </span>
      </form>
    </div>
  );
};

export default SignIn;

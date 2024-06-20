import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export const RegisterFormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "user", 
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: RegisterFormData, 
  });

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({
        message: "User created successfully",
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev); 
  };

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="container my-4" onSubmit={onSubmit}>
      <h2 className="text-center mb-4">Create an Account</h2>

      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          className="form-control"
          {...register("fullName", { required: "This field is required" })}
        />
        {errors.fullName && (
          <p className="text-danger">{errors.fullName.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
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

      <div className="mb-3 position-relative">
        <label className="form-label">Confirm Password</label>
        <input
          type={showConfirmPassword ? "text" : "password"} 
          className="form-control"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "This field is required";
              } else if (watch("password") !== val) {
                return "Passwords do not match";
              }
            },
          })}
        />
        <FontAwesomeIcon
          icon={showConfirmPassword ? faEyeSlash : faEye}
          className={`position-absolute end-0 top-50 translate-middle-y ${showConfirmPassword ? 'text-secondary' : 'text-primary'}`}
          style={{ marginTop: "15px", marginRight: "10px", cursor: "pointer" }}
          onClick={toggleConfirmPasswordVisibility}
        />
        {errors.confirmPassword && (
          <p className="text-danger">{errors.confirmPassword.message}</p>
        )}
      </div>

      <input
        type="hidden"
        {...register("role")}
        value="user"
      />

      <span className="d-flex items-center justify-content-between">
        <span>
          Already have an account?{" "}
          <a href="/login" className="text-primary">
            Login here
          </a>
        </span>

        <button type="submit" className="btn btn-primary btn-lg">
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;

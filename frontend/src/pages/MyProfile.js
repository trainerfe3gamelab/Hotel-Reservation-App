import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { fetchUserProfile, updateUserProfile } from '../api-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const MyProfile = () => {
  const formMethods = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit, reset, watch, setError, clearErrors, formState: { errors } } = formMethods;
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);  

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  useEffect(() => {
    if (password !== confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
    } else {
      clearErrors('confirmPassword');
    }
  }, [password, confirmPassword, setError, clearErrors]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        reset({
          fullName: profileData.fullName,
          email: profileData.email,
          role: profileData.role,
          password: '',
          confirmPassword: '',
        });
      } catch (error) {
        setServerError("Failed to fetch profile data.");
      }
    };

    loadProfile();
  }, [reset]);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const { confirmPassword, ...profileData } = data;

      const filteredData = {};
      Object.keys(profileData).forEach((key) => {
        if (profileData[key] !== '' && key !== 'password' && key !== 'confirmPassword') {
          filteredData[key] = profileData[key];
        }
      });

      if (password) {
        filteredData.password = password;
      }

      const updatedProfile = await updateUserProfile(filteredData);

      reset({
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
        role: updatedProfile.role,
        password: '',
        confirmPassword: '',
      });

      setIsProfileUpdated(true); 

    } catch (error) {
      setServerError(error.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="container mt-5">
      <h2>My Profile</h2>
      <FormProvider {...formMethods}>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
              {...formMethods.register('fullName', { required: 'Full Name is required' })}
            />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...formMethods.register('email', { required: 'Email is required' })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="role">Role</label>
            <input
              id="role"
              name="role"
              readOnly
              className={`form-control ${errors.role ? 'is-invalid' : ''}`}
              {...formMethods.register('role', { required: 'Role is required' })}
            />
            {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
          </div>

          <div className="form-group mb-3 position-relative">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...formMethods.register('password', {
                minLength: { value: 6, message: 'Password must be at least 6 characters long' },
              })}
            />
            <button
              type="button"
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
              onClick={() => setShowPassword(!showPassword)}
              style={{ textDecoration: 'none' }}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className={showPassword ? 'text-secondary' : 'text-primary'} style={{marginTop: "25px"}} />
            </button>
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <div className="form-group mb-3 position-relative">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              {...formMethods.register('confirmPassword', {
                validate: value => value === password || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ textDecoration: 'none' }}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className={showPassword ? 'text-secondary' : 'text-primary'} style={{marginTop: "25px"}} />
            </button>
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
          </div>

          {serverError && <div className="alert alert-danger">{serverError}</div>}

          {isProfileUpdated && (
            <div className="alert alert-success mt-3">
              Profile updated successfully!
            </div>
          )}

          <div className="d-flex justify-content-end mt-4">
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? 'disabled' : ''} py-2 px-4`}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default MyProfile;

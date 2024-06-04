import { useForm } from "react-hook-form";

const Register = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="container mt-5" onSubmit={onSubmit}>
      <h2 className="text-center mb-4">Create an Account</h2>
      <div className="row mb-3">
        <div className="col">
          <label className="form-label">First Name</label>
          <input
            className="form-control"
            {...register("firstName", { required: "This field is required" })}
          />
          {errors.firstName && (
            <p className="text-danger">{errors.firstName.message}</p>
          )}
        </div>
        <div className="col">
          <label className="form-label">Last Name</label>
          <input
            className="form-control"
            {...register("lastName", { required: "This field is required" })}
          />
          {errors.lastName && (
            <p className="text-danger">{errors.lastName.message}</p>
          )}
        </div>
      </div>
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
      <div className="mb-3">
        <label className="form-label">Confirm Password</label>
        <input
          type="password"
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
        {errors.confirmPassword && (
          <p className="text-danger">{errors.confirmPassword.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-lg"
      >
        Create Account
      </button>
    </form>
  );
};

export default Register;

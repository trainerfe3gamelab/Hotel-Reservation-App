import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const DetailsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext(HotelFormData);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold">Add Hotel</h1>

      <div className="row">
        <div className="col-md-6">
          <label className="form-label">
            Name
            <input
              type="text"
              className={`form-control ${errors.name && "is-invalid"}`}
              {...register("name", { required: "This field is required" })}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </label>
        </div>
        <div className="col-md-6">
          <label className="form-label">
            City
            <input
              type="text"
              className={`form-control ${errors.city && "is-invalid"}`}
              {...register("city", { required: "This field is required" })}
            />
            {errors.city && (
              <div className="invalid-feedback">{errors.city.message}</div>
            )}
          </label>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <label className="form-label">
            Country
            <input
              type="text"
              className={`form-control ${errors.country && "is-invalid"}`}
              {...register("country", { required: "This field is required" })}
            />
            {errors.country && (
              <div className="invalid-feedback">{errors.country.message}</div>
            )}
          </label>
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Price Per Night
            <input
              type="number"
              min="0"
              step="0.01"
              className={`form-control ${errors.pricePerNight && "is-invalid"}`}
              {...register("pricePerNight", {
                required: "This field is required",
              })}
            />
            {errors.pricePerNight && (
              <div className="invalid-feedback">
                {errors.pricePerNight.message}
              </div>
            )}
          </label>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <label className="form-label">
            Description
            <textarea
              rows={5}
              className={`form-control ${errors.description && "is-invalid"}`}
              {...register("description", {
                required: "This field is required",
              })}
            />
            {errors.description && (
              <div className="invalid-feedback">
                {errors.description.message}
              </div>
            )}
          </label>
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Star Rating
            <select
              className={`form-control ${errors.starRating && "is-invalid"}`}
              {...register("starRating", {
                required: "This field is required",
              })}
            >
              <option value="">Select Star Rating</option>
              {[1, 2, 3, 4, 5].map((num, index) => (
                <option key={index} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {errors.starRating && (
              <div className="invalid-feedback">
                {errors.starRating.message}
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;

import { useFormContext } from "react-hook-form";
import { HotelFormData } from "../../shared/type.js";

const DetailsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext(HotelFormData);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-3">Add Hotel</h1>

      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && <p className="text-danger">{errors.name.message}</p>}
      </div>
      <div className="d-flex gap-3">
        <div className="mb-3 w-100">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            {...register("city", { required: "This field is required" })}
          />
          {errors.city && <p className="text-danger">{errors.city.message}</p>}
        </div>
        <div className="mb-3 w-100">
          <label className="form-label">Country</label>
          <input
            type="text"
            className="form-control"
            {...register("country", { required: "This field is required" })}
          />
          {errors.country && (
            <p className="text-danger">{errors.country.message}</p>
          )}
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          rows={10}
          className="form-control"
          {...register("description", { required: "This field is required" })}
        />
        {errors.description && (
          <p className="text-danger">{errors.description.message}</p>
        )}
      </div>
      <div className="mb-3">
        <label className="form-label">Price per Night</label>
        <input
          type="number"
          min={1}
          className="form-control"
          {...register("pricePerNight", { required: "This field is required" })}
        />
        {errors.pricePerNight && (
          <p className="text-danger">{errors.pricePerNight.message}</p>
        )}
      </div>
      <div className="mb-3">
        <label className="form-label">Star Rating</label>
        <select
          {...register("starRating", { required: "This field is required" })}
          className="form-select"
        >
          <option value="" className="text-muted">
            Select Star Rating
          </option>
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
        {errors.starRating && (
          <p className="text-danger">{errors.starRating.message}</p>
        )}
      </div>
    </div>
  );
};

export default DetailsSection;

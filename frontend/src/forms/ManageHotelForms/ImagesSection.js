import React from "react";
import { useFormContext } from "react-hook-form";
import { Form } from "react-bootstrap";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const existingImageUrls = watch("imageUrls");

  const handleDelete = (event, imageUrl) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl)
    );
  };

  return (
    <div>
      <h2 className="h2 mb-3">Images</h2>
      <div className="border rounded p-4 d-flex flex-column gap-4">
        {existingImageUrls && (
          <div className="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-4">
            {existingImageUrls.map((url, index) => (
              <div key={index} className="col position-relative">
                <img src={url} className="img-fluid rounded" alt={`Image ${index + 1}`} />
                <button
                  onClick={(event) => handleDelete(event, url)}
                  className="btn btn-danger position-absolute top-50 start-50 translate-middle"
                  style={{ opacity: '0.8' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label>Upload Images</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            {...register("imageFiles", {
              validate: (imageFiles) => {
                const totalLength = imageFiles.length + (existingImageUrls?.length || 0);

                if (totalLength === 0) {
                  return "At least one image should be added";
                }

                if (totalLength > 6) {
                  return "Total number of images cannot be more than 6";
                }

                return true;
              },
            })}
          />
        </Form.Group>
      </div>
      {errors.imageFiles && (
        <div className="text-danger mt-2">
          {errors.imageFiles.message}
        </div>
      )}
    </div>
  );
};

export default ImagesSection;

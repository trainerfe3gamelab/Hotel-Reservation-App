import React from "react";
import { useFormContext } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="d-flex flex-column w-100 align-items-center mb-3">
      <h2 className="mb-3">Images</h2>

      <Form.Group className="border rounded p-4 w-50">
        <Form.Label htmlFor="imageFiles" className="form-label">
          Upload Images
        </Form.Label>
        <Form.Control
          id="imageFiles"
          type="file"
          multiple
          accept="image/*"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              if (imageFiles.length === 0) {
                return "Please add at least one image";
              }
              if (imageFiles.length > 6) {
                return "Total images cannot be more than 6";
              }
              return true;
            },
          })}
          isInvalid={!!errors.imageFiles}
        />
        {errors.imageFiles && (
          <Alert variant="danger" className="mt-2">
            {errors.imageFiles.message}
          </Alert>
        )}
      </Form.Group>
    </div>
  );
};

export default ImagesSection;

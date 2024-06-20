import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import Swal from "sweetalert2";
import LoadingSpinner from "../components/LoadingSpinner";

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
  });

  const {
    data: users,
    isLoading,
    error,
  } = useQuery("fetchUsers", apiClient.fetchAllUsers, {
    onError: (err) => {
      console.error("Error fetching users:", err);
    },
  });

  const editUserMutation = useMutation(
    (updatedData) => apiClient.updateUser(editedUser.userId, updatedData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("fetchUsers");
        Swal.fire("Updated!", "User has been updated.", "success");
        setEditMode(false);
        setEditedUser(null);
        setFormData({ fullName: "", email: "", role: "", password: "" });
      },
      onError: (err) => {
        console.error("Error updating user:", err);
        Swal.fire("Error", "There was an error updating the user.", "error");
      },
    }
  );

  const deleteUserMutation = useMutation(
    (userId) => apiClient.deleteUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("fetchUsers");
        Swal.fire("Deleted!", "User has been deleted.", "success");
      },
      onError: (err) => {
        console.error("Error deleting user:", err);
        Swal.fire("Error", "There was an error deleting the user.", "error");
      },
    }
  );

  const handleEdit = (user) => {
    setEditedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      password: "",
    });
    setEditMode(true);
  };

  const handleSave = () => {
    const dataToUpdate = {
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
    };
    // Only include password if it's not empty
    if (formData.password.trim() !== "") {
      dataToUpdate.password = formData.password;
    }
    editUserMutation.mutate(dataToUpdate);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedUser(null);
    setFormData({ fullName: "", email: "", role: "", password: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate(userId);
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error loading users. Please try again later.</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="fw-bold fs-3 mt-4">Manage Users</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-4">
        {users.map((user) => (
          <div key={user.userId} className="col">
            <div className="card h-100 border border-secondary rounded-3 shadow-sm">
              <div className="card-body d-flex flex-column">
                {editMode && editedUser && editedUser.userId === user.userId ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <input
                        type="text"
                        className="form-control"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-primary" onClick={handleSave}>
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="card-title fw-bold">{user.fullName}</h3>
                    <p className="card-text">{user.email}</p>
                    <p className="card-text">{user.role}</p>
                    <div className="mt-auto d-flex justify-content-between">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(user.userId)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;

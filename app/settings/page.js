"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/languagecontext";
import axios from "axios";

const UserProfilePage = () => {
  const [data, setData] = useState([]);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const { language, translations } = useLanguage();

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/users"
      );
      const responseData = response.data;
      setData(responseData.data);

      const user = responseData.data.find((user) => user.qnews === email);
      if (user) {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phoneNumber: user.phoneNumber || "",
          email: user.qnews || "",
        });
      }
    } catch (error) {
      console.error("Unable to fetch user data:", error);
    }
  }, [email]);

  useEffect(() => {
    if (email) {
      fetchData();
    }
  }, [email, fetchData]);

  const updateUser = async () => {
    try {
      const { firstName, lastName, phoneNumber } = formData;
      const response = await axios.put(
        `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/users/${email}`,
        {
          firstName,
          lastName,
          phoneNumber,
        }
      );

      if (response.data.success) {
        alert("User information updated successfully");
      } else {
        alert("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Error updating user data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail || "");
  }, []);

  return (
    <div className="max-w-lg min-h-screen mx-auto p-6 my-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {translations.profile}
      </h1>
      {formData && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            updateUser();
          }}
        >
          <div className="flex flex-col">
            <label className="mb-2 font-medium">
              {translations.firstName}:
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">{translations.lastName}:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">
              {translations.phoneNumber}:
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">
              {translations.emailAddress}:
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              disabled
              className="p-3 border rounded bg-gray-100"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition"
          >
            {translations.updateProfile}
          </button>
        </form>
      )}
      <button
        type="button"
        onClick={async () => {
          const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
          );
          if (!confirmDelete) return;

          try {
            const response = await axios.delete(
              `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/users/${email}`
            );

            if (response.data.success) {
              alert("Account deleted successfully.");
              localStorage.clear();
              window.location.href = "/"; // or redirect to login page
            } else {
              alert("Failed to delete account. Please try again.");
            }
          } catch (error) {
            console.error("Error deleting account:", error);
            alert("An error occurred while deleting your account.");
          }
        }}
        className="w-full py-3 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition mt-5"
      >
        Delete Account
      </button>
    </div>
  );
};

export default UserProfilePage;

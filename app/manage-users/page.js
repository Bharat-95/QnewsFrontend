"use client";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../context/languagecontext";

const Page = () => {
  const { translations } = useLanguage();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/users");
      const responseData = await response.json();
      setData(responseData.data);
    } catch (error) {
      console.log("Unable to fetch Users information", error);
    }
  };

  const deleteUser = async (qnews) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/${qnews}`, {
        method: "DELETE",
      });

      const responseData = await response.json();
      if (responseData.success) {
        setData((prevData) => prevData.filter((user) => user.qnews !== qnews));
        alert("User deleted successfully!");
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  const toggleBlockUser = async (qnews, currentStatus) => {
    const action = currentStatus === "Blocked" ? "Unblock" : "Block";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const newStatus = currentStatus === "Blocked" ? "Active" : "Blocked";

      const response = await fetch(`https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/users/${qnews}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        setData((prevData) =>
          prevData.map((user) =>
            user.qnews === qnews ? { ...user, status: newStatus } : user
          )
        );
        alert(`User successfully ${action === "Block" ? "blocked" : "unblocked"}!`);
      } else {
        alert(`Failed to ${action.toLowerCase()} user`);
      }
    } catch (error) {
      console.log(`Error ${action.toLowerCase()}ing user:`, error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <div className="text-white text-2xl font-bold underline flex justify-center py-10">
        {translations.userlist}
      </div>
      <div className="grid grid-cols-3 text-black gap-10 m-20">
        {data
          .filter((user) => user.role === "User")
          .map((user) => (
            <div
              key={user.qnews}
              className="bg-white hover:transform duration-500 hover:translate-x-2 hover:-translate-y-2 cursor-pointer space-y-2 px-10 py-4 shadow-md rounded-md shadow-gray-500 w-[100%]"
            >
              <div className="flex gap-2">
                <div className="font-bold">{translations.name} : </div>
                {user.firstName} {user.lastName}
              </div>
              <div className="flex gap-2">
                <div className="font-bold">{translations.email} : </div>
                {user.qnews}
              </div>
              <div className="flex gap-2">
                <div className="font-bold">{translations.phoneNumber}:</div>
                {user.phoneNumber}
              </div>
              <div className="flex gap-2">
                <div className="font-bold">{translations.status}:</div>
                {user.status}
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => deleteUser(user.qnews)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => toggleBlockUser(user.qnews, user.status)}
                  className={`px-4 py-2 rounded-md text-white ${
                    user.status === "Blocked"
                      ? "bg-green-500 hover:bg-green-700"
                      : "bg-yellow-500 hover:bg-yellow-700"
                  }`}
                >
                  {user.status === "Blocked" ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Page;

"use client";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../context/languagecontext";

const Page = () => {
  const { translations } = useLanguage();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees
  const fetchData = async () => {
    try {
      const response = await fetch("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/users");
      const responseData = await response.json();
      setData(responseData.data);
    } catch (error) {
      console.log("Unable to fetch Users information", error);
    }
  };

  // Delete user
  const deleteUser = async (qnews) => {
    try {
      const response = await fetch(`https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/users/${qnews}`, {
        method: "DELETE",
      });
      const responseData = await response.json();
      if (responseData.success) {
        setData((prevData) => prevData.filter((user) => user.qnews !== qnews));
      } else {
        console.log("Failed to delete user");
      }
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  // Handle modal open
  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  // Handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  // Handle employee update
  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/users/${selectedEmployee.qnews}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedEmployee),
      });

      const responseData = await response.json();
      if (responseData.success) {
        alert("Employee details uploaded successfully")
        setData((prevData) =>
          prevData.map((user) =>
            user.qnews === selectedEmployee.qnews ? selectedEmployee : user
          )
        );
        closeModal();
      } else {
        console.log("Failed to update user");
      }
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="py-10">
      <div className="text-black text-2xl font-bold underline flex justify-center pb-4">
        {translations.employeelist}
      </div>
      <div className="lg:grid lg:grid-cols-3 md:grid md:grid-cols-2 text-black gap-10 lg:p-20 p-4 space-y-5 md:space-y-0 lg:space-y-0">
        {data
          .filter((user) => user.role === "Employee")
          .map((user) => (
            <div
              key={user.qnews}
              className="bg-orange-200 lg:hover:transform duration-500 lg:hover:translate-x-2 lg:hover:-translate-y-2  p-4 shadow-md space-y-2 rounded-md shadow-gray-500 cursor-pointer"
              
            >
              <div onClick={() => openModal(user)}>
              <div className="flex gap-2">
                <div className="font-bold">Name :</div>
                {user.firstName} {user.lastName}
              </div>
              <div className="flex gap-2">
                <div className="font-bold">Email:</div> {user.qnews}
              </div>
              <div className="flex gap-2">
                <div className="font-bold">Phone Number:</div> {user.phoneNumber}
              </div>
              <div className="flex gap-2">
                <div className="font-bold">Role:</div> {user.role}
              </div>
              <div>
             
            </div>
            </div>
            <button
              onClick={() => deleteUser(user.qnews)}
              className="mt-4 flex justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
           
            </div>
            
          ))}
          
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white lg:w-[40%] w-[80%] p-8 rounded-md shadow-md space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">Edit Employee</h2>
            <div className="space-y-2">
              <div>
                <label className="block font-bold">First Name</label>
                <input
                  type="text"
                  value={selectedEmployee.firstName}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      firstName: e.target.value,
                    })
                  }
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold">Last Name</label>
                <input
                  type="text"
                  value={selectedEmployee.lastName}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      lastName: e.target.value,
                    })
                  }
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold">Email</label>
                <input
                  type="email"
                  value={selectedEmployee.qnews}
                  className="border p-2 w-full rounded-md"
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-bold">Phone Number</label>
                <input
                  type="text"
                  value={selectedEmployee.phoneNumber}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold">Role</label>
                <select
              className="w-[90%] h-10 rounded-md p-2 text-black"
              value={selectedEmployee.role}
              onChange={(e) => setSelectedEmployee({ ...selectedEmployee, role: e.target.value, }) }
            >
              <option value="">{translations.selectRole}</option>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

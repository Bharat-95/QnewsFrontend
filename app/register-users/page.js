"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/languagecontext";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

const Page = () => {
  const { translations } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); 
  const [phoneNumber, setPhoneNumber] = useState("+91 ");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const cleanedPhoneNumber = phoneNumber.replace("+91", "").trim().replace(/\s+/g, "");
  
    if (cleanedPhoneNumber.length !== 10 || !/^\d{10}$/.test(cleanedPhoneNumber)) {
      setError("Phone number must be 10 digits, excluding the country code.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, including uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    const emailInLowerCase = email.trim().toLowerCase();
  
    try {
      const response = await fetch("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInLowerCase,
          password,
          firstName,
          lastName,
          phoneNumber: `+91 ${cleanedPhoneNumber}`,
          role,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Employee has been registered successfully');
        router.push('/');
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (error) {
      setError("Network error, please try again");
    }
  };
  
  return (
    <div className="text-black px-4 my-10 flex items-center justify-center ">
      <div className="rounded-md p-[50px] bg-orange-200 space-y-10 lg:w-[40%] md:w-[80%]">
        <div className="text-2xl flex justify-center font-bold underline">
          {translations.registeremployee}
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-semibold">
            {translations.createAccount}
          </div>
          <div className="font-semibold">{translations.enterCredentials}</div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <div>{translations.firstName}</div>
            <input
              type="text"
              placeholder={translations.enterFirstName}
              className="w-[90%] bg-orange-50 h-10 rounded-md p-2 text-black"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div>{translations.lastName}</div>
            <input
              type="text"
              placeholder={translations.enterLastName}
              className="w-[90%] bg-orange-50 h-10 rounded-md p-2 text-black"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div>{translations.phoneNumber}</div>
            <input
              type="tel"
              placeholder={translations.enterPhoneNumber}
              className="w-[90%] bg-orange-50 h-10 rounded-md p-2 text-black"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {error && error.includes("Phone number") && (
            <div className="text-red-400 font-bold text-[14px]">{error}</div>
          )}

          <div className="space-y-1">
            <div>{translations.emailAddress}</div>
            <input
              type="email"
              placeholder={translations.enterEmail}
              className="w-[90%] bg-orange-50 h-10 rounded-md p-2 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div>{translations.role}</div>
            <select
              className="w-[90%] h-10 rounded-md p-2 bg-orange-50 text-black"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">{translations.selectRole}</option>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          <div className="space-y-1 relative">
            <div>{translations.password}</div>
            <div className="w-[90%] bg-white justify-between rounded-md flex items-center px-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={translations.password}
                className="w-[90%] h-10 rounded-md p-2 bg-orange-50 text-black pr-10 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash color="black" />
                ) : (
                  <FaEye color="black" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1 relative">
            <div>{translations.confirmPassword}</div>
            <div className="w-[90%] bg-white justify-between rounded-md flex items-center px-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={translations.confirmPassword}
                className="w-[90%] h-10 rounded-md p-2 bg-orange-50 text-black pr-10 focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash color="black" />
                ) : (
                  <FaEye color="black" />
                )}
              </button>
            </div>
          </div>

          {error && !error.includes("Phone number") && (
            <div className="text-red-400 font-bold text-[14px]">{error}</div>
          )}

          <div className="py-4">
            <button
              type="submit"
              className="flex justify-center  bg-orange-500 hover:bg-orange-600 text-white font-bold  rounded-md h-10 w-[90%] items-center shadow-md  hover:transform hover:translate-x-[1px] hover:-translate-y-[1px] duration-200"
            >
              {translations.registerusers}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;

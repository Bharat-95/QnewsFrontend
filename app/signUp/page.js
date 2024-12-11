"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/languagecontext";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

const SignUpPage = () => {
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

  const userRole = "User"; 

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
  
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
  
  
    const phoneNumberWithoutCountryCode = phoneNumber.replace("+91 ", "").trim();
    if (phoneNumberWithoutCountryCode.length !== 10 || isNaN(phoneNumberWithoutCountryCode)) {
      setError("Phone number must be 10 digits long.");
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
          phoneNumber: `+91 ${phoneNumberWithoutCountryCode}`,
          role: userRole,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("role", data.user.role); 
        localStorage.setItem("firstName", data.user.firstName);
        localStorage.setItem("lastName", data.user.lastName);
  
        router.push("/");
        window.location.href = "/";
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (error) {
      setError("Network error, please try again");
    }
  };
  
  

  return (
    <div className="text-black p-4 flex items-center justify-center ">
      <div className="rounded-md lg:p-[50px] md:p-20 p-6 bg-orange-200 space-y-10 lg:w-[40%] md:w-[80%]">
        <div className="text-2xl flex justify-center font-bold underline">
          {translations.signUp}
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

          <div className="space-y-1">
            <div>{translations.emailAddress}</div>
            <input
              type="email"
              placeholder={translations.enterEmail}
              className="w-[90%] h-10 bg-orange-50 rounded-md p-2 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1 relative">
            <div>{translations.password}</div>
            <div className="w-[90%] bg-orange-50 justify-between rounded-md flex items-center px-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={translations.password}
                className="w-[90%] h-10 bg-orange-50 rounded-md p-2 text-black pr-10 focus:outline-none"
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
            <div className="w-[90%] bg-orange-50 justify-between rounded-md flex items-center px-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={translations.confirmPassword}
                className="w-[90%] h-10 bg-orange-50 rounded-md p-2 text-black pr-10 focus:outline-none"
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

          {error && <div className="text-black text-[10px]">{error}</div>}

          <div className="flex gap-2">
            <input type="checkbox" required />
            <div className="lg:text-[14px] md:text-[14px] text-[10px]">{translations.acceptTerms}</div>
          </div>

          <div className="py-4">
            <button
              type="submit"
              className="flex justify-center  bg-orange-500 text-white font-bold  rounded-md h-10 w-[90%] items-center shadow-md hover:bg-orange-600 hover:transform hover:translate-x-[1px] hover:-translate-y-[1px] duration-200"
            >
              {translations.signUp}
            </button>
          </div>

          <div className="flex justify-center gap-2">
            {translations.haveAccount}
            <Link href="/Login">{translations.logIn}</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;

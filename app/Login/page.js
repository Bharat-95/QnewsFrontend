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
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
        if (response.status === 401) {
            setError("Incorrect username or password");
          } else {
            setError(data.message || "An error occurred");
          }
      }
    } catch (error) {
      setError("Network error, please try again");
    }
  };

  return (
    <div className="text-white p-4 flex items-center justify-center ">
      <div className="rounded-md p-[50px]  bg-[#737373] space-y-10 lg:w-[40%] md:w-[60%]">
        <div className="text-2xl font-bold flex justify-center underline">{translations.logIn}</div>

        <form className="space-y-4 " onSubmit={handleSubmit}>
          <div className="space-y-1">
            <div>{translations.emailAddress}</div>
            <input
              type="email"
              placeholder={translations.enterEmail}
              className="w-[90%] h-10 rounded-md p-2 text-black focus:outline-none" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1 relative">
            <div>{translations.password}</div>
            <div className="w-[90%] bg-white justify-between rounded-md flex items-center px-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={translations.password}
                className="w-[90%] h-10 rounded-md p-2 text-black pr-10 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} 
              >
                {showPassword ? <FaEyeSlash color="black" /> : <FaEye color="black" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between text-[10px] px-12">
            <div></div>
            <div>
              <Link href="/" className="hover:">
                {translations.forgotPassword}
              </Link>
            </div>
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <div className="flex gap-2">
            <input type="checkbox" required/>
            <div className="lg:text-[14px] md:text-[14px] text-[8px]">{translations.acceptTerms}</div>
          </div>
          <div className="py-4">
            <button
              type="submit"
              className="flex justify-center  bg-black text-white rounded-md font-bold h-10 w-[90%] items-center shadow-md hover:text-white/80 hover:transform hover:translate-x-[1px] hover:-translate-y-[1px] duration-200"
            >
              {translations.logIn}
            </button>
          </div>
          <div className="flex justify-center gap-2 lg:text-[14px] md:text-[14px] text-[10px]">
            {translations.noAccount}
            <Link href="/signUp">{translations.signUp}</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;

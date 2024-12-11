"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Logo from "../public/Logo.png";
import Link from "next/link";
import { MdDownload } from "react-icons/md";
import { TiWeatherCloudy } from "react-icons/ti";
import { useLanguage } from "../context/languagecontext";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [temperature, setTemperature] = useState(null);
  const { translations, toggleLanguage, language } = useLanguage();
  const [menu, setMenu] = useState(false);
  const [data, setData] = useState([]);
  const [userRole, setUserRole] = useState("");
  const menuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getActiveClass = (href) => {
    return router.pathname === href ? "active-tab" : "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/users"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();

        const users = responseData.data;

        if (!Array.isArray(users)) {
          throw new Error("Invalid data format: Expected an array in 'data'.");
        }

        setData(users);

        const storedEmail = localStorage.getItem("email");
        const loggedInUser = users.find((user) => user.qnews === storedEmail);

        if (loggedInUser) {
          setUserRole(loggedInUser.role);
        } else {
          console.log("No matching user found for the logged-in session.");
        }
      } catch (error) {
        console.log("Unable to fetch the data from the database", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      const now = new Date();
      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setCurrentTime(now.toLocaleTimeString("en-US", timeOptions));

      const day = now.getDate();
      const month = now.toLocaleString("en-US", { month: "long" });
      const year = now.getFullYear();
      setCurrentDate(`${day} ${month}, ${year}`);
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=17.3850&longitude=78.4867&current_weather=true"
        );
        const data = await response.json();
        if (data?.current_weather?.temperature) {
          setTemperature(data.current_weather.temperature);
        } else {
          console.warn("Weather data missing or incomplete");
        }
      } catch (error) {
        console.log("Error fetching weather:", error);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  


  const handleMenu = (event) => {
    event.stopPropagation();
    setMenu(!menu);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  if (isLoggedIn === null) {
    return null;
  }

  const handleLinkClick = () => {
    setMenu(false);
  };

  
  const navItems = [
    { path: "/", label: translations.home },
    { path: "/hyderabad", label: translations.hyderabad },
    { path: "/telangana", label: translations.telangana },
    { path: "/india", label: translations.india },
    { path: "/world", label: translations.world },
    { path: "/politics", label: translations.politics },
    { path: "/sports", label: translations.sports },
    { path: "/film", label: translations.film },
    { path: "/others", label: translations.others },
  ];

  const smallScreenNavItems = navItems // Home, Telangana, Hyderabad


  return (
    <div className="bg-black shadow-md  rounded-b-md fixed w-[100%] z-50 lg:px-28 md:px-10 px-4 lg:py-5 md:py-2 py-2 lg:space-y-4 md:space-y-1">
      <div className="flex justify-between items-center">
        <div>
          <Image
            src={Logo}
            alt="No Logo Found"
            className="lg:w-28 md:w-20 w-12"
          />
        </div>

        <div>
          <ul className="flex lg:space-x-4 md:space-x-2 space-x-2 lg:text-[14px] md:text-[14px] text-[8px]">
            <li>
              <button
                onClick={toggleLanguage}
                className="text-white lg:w-40 md:w-32 lg:text-[14px] md:text-[10px] text-[8px] w-14 h-8 lg:h-10 md:h-10 border border-1 hover:transform duration-150 hover:translate-x-1 hover:-translate-y-1 border-white lg:p-2 md:p-2 p-1 font-semibold"
              >
                {language === "en"
                  ? translations.switchTo
                  : translations.switchTo}
              </button>
            </li>

            <li className="text-white lg:w-40 md:w-32 w-14 h-8 lg:h-10 md:h-10 border border-1 hover:transform duration-150 hover:translate-x-1 hover:-translate-y-1 border-white lg:p-2 md:p-2 p-1 font-semibold flex justify-center items-center">
              <Link href="/e-paper" className="flex items-center gap-x-2 lg:text-[14px] md:text-[10px] text-[8px]">
                <MdDownload /> {translations.epaper}
              </Link>
            </li>

            {isLoggedIn && (
              <ul className="flex lg:gap-10 md:gap-4 gap-4 items-center">
                {userRole === "Admin" && (
                 <li className="lg:space-x-10 md:space-x-2 space-x-2 flex justify-center items-center relative">
                 <button
                   className="text-white border lg:w-40 md:w-32 w-20 h-8 lg:h-10 md:h-10 border-1 lg:text-[14px] md:text-[10px] text-[8px] hover:transform duration-150 hover:translate-x-1 hover:-translate-y-1 border-white lg:p-2 md:p-2 p-1 font-semibold"
                   onClick={() => setDropdownOpen((prev) => !prev)}
                 >
                   {translations.approve}
                   <span className="ml-2">&#x25BC;</span>
                 </button>
               
                 {/* Dropdown Menu */}
                 {dropdownOpen && (
                   <ul className="absolute top-full left-0 mt-1 lg:w-36 md:w-32 w-32 bg-gray-800 text-white rounded shadow-lg">
                     <li>
                       <button
                         onClick={() => router.push("/approve-news")}
                         className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                       >
                         {translations.approvenews}
                         
                       </button>
                     </li>
                     <li>
                       <button
                         onClick={() => router.push("/approve-video")}
                         className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                       >
                         {translations.approveVideo}
                       </button>
                     </li>
                   </ul>
                 )}
               </li>
               
                )}

                {userRole === "Employee" && (
                  <li className="lg:space-x-4 md:space-x-5 space-x-4">
                    {/* Dropdown for small and medium devices */}
                    <div className="lg:hidden relative">
                      <button
                        className="text-white lg:w-40 md:w-40 w-16 h-8 lg:h-10 md:h-10 border border-1 border-white p-1 font-semibold flex items-center justify-center"
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        {translations.add}
                        <span className="ml-2">&#x25BC;</span>
                        {/* Down arrow symbol */}
                      </button>
                      {showDropdown && (
                        <div className="absolute w-28 md:w-40 bg-gray-800 text-white border border-white mt-1 rounded  z-10">
                          <button
                            onClick={() => router.push("/add-news")}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                          >
                            {translations.addnews}
                          </button>
                          <button
                            onClick={() => router.push("/add-video")}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                          >
                            {translations.addVideo}
                          </button>
                          <button
                            onClick={() => router.push("/add-paper")}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                          >
                            {translations.addPaper}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Buttons for large screens */}
                    <div className="hidden lg:flex space-x-4">
                      <button
                        onClick={() => router.push("/add-news")}
                        className="text-white lg:w-40 md:w-40 w-16 h-8 lg:h-10 md:h-10 border border-1 hover:transform duration-150 hover:translate-x-1 hover:-translate-y-1 border-white lg:p-2 md:p-2 p-1 font-semibold"
                      >
                        {translations.addnews}
                      </button>
                      <button
                        onClick={() => router.push("/add-video")}
                        className="text-white lg:w-40 md:w-40 w-16 h-8 lg:h-10 md:h-10 border border-1 hover:transform duration-150 hover:translate-x-1 hover:-translate-y-1 border-white lg:p-2 md:p-2 p-1 font-semibold"
                      >
                        {translations.addVideo}
                      </button>
                      <button
                        onClick={() => router.push("/add-paper")}
                        className="text-white lg:w-40 md:w-40 w-16 h-8 lg:h-10 md:h-10 border border-1 hover:transform duration-150 hover:translate-x-1 hover:-translate-y-1 border-white lg:p-2 md:p-2 p-1 font-semibold"
                      >
                        {translations.addPaper}
                      </button>
                    </div>
                  </li>
                )}

                <li style={{ position: "relative" }}>
                  <GiHamburgerMenu
                    size={24}
                    color="white"
                    onClick={(event) => {
                      handleMenu(event);
                    }}
                    className="cursor-pointer"
                  />
                  {menu && (
                    <div className="relative flex justify-center">
                      <ul
                        ref={menuRef}
                        className="text-black absolute lg:mt-6 md:mt-4 lg:w-60 md:w-56 w-32 font-bold space-y-4 p-4 right-0 flex flex-col items-center bg-white shadow-md rounded-md"
                      >
                        {userRole === "Admin" && (
                          <>
                            <li className="hover:text-black/70 hover:transform hover:translate-x-[1px] hover:translate-y-[1px] duration-200">
                              <Link
                                href="/register-users"
                                onClick={handleLinkClick}
                              >
                                {translations.registeremployee}
                              </Link>
                            </li>
                            <li className="hover:text-black/70 hover:transform hover:translate-x-[1px] hover:translate-y-[1px] duration-200">
                              <Link
                                href="/manage-employee"
                                onClick={handleLinkClick}
                              >
                                {translations.manageemployees}
                              </Link>
                            </li>
                            <li className="hover:text-black/70 hover:transform hover:translate-x-[1px] hover:translate-y-[1px] duration-200">
                              <Link
                                href="/manage-users"
                                onClick={handleLinkClick}
                              >
                                {translations.manageusers}
                              </Link>
                            </li>
                          </>
                        )}

                        <li className="hover:text-black/70 hover:transform hover:translate-x-[1px] hover:translate-y-[1px] duration-200">
                          <Link href="/" onClick={handleLinkClick}>
                            {translations.settings}
                          </Link>
                        </li>
                        <li
                          className="hover:text-black/70 cursor-pointer hover:transform hover:translate-x-[1px] hover:translate-y-[1px] duration-200"
                          onClick={handleSignOut}
                        >
                          {translations.signout}
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              </ul>
            )}
            {!isLoggedIn && (
              <>
                <li className="text-white hover:transform duration-150 lg:text-[14px] md:text-[10px] text-[8px] lg:w-40 md:w-32 w-14 lg:h-10 md:h-10 h-8  hover:translate-x-1 hover:-translate-y-1 border border-1 border-white bg-red-600 lg:p-2 md:p-2 p-1 font-semibold flex justify-center items-center">
                  <Link href="/signUp">{translations.register}</Link>
                </li>
                <li className="text-white hover:transform duration-150 hover:translate-x-1 lg:text-[14px] md:text-[10px] text-[8px] hover:-translate-y-1 border border-1 border-white lg:p-2 md:p-2 p-1 font-semibold lg:w-40 md:w-32 w-14 lg:h-10 md:h-10 h-8 flex justify-center items-center">
                  <Link href="/Login">{translations.login}</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="lg:px-20 py-2">
  <ul className="text-white flex flex-wrap justify-evenly font-bold items-center lg:text-[14px] md:text-[12px] text-[12px]">
    <div className="flex lg:hidden md:hidden w-full overflow-x-auto" style={{
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE and Edge
  }}>
      <div className="flex w-max whitespace-nowrap">
        {smallScreenNavItems.map((item) => (
          <li
            key={item.path}
            className={`inline-block p-2 hover:rounded-md hover:bg-gray-700 hover:translate-x-1 hover:-translate-y-1 duration-150 ${
              pathname === item.path
                ? "bg-gray-700 rounded-md text-yellow-300"
                : ""
            }`}
          >
            <Link href={item.path}>{item.label}</Link>
          </li>
        ))}
      </div>
    </div>

    {/* For Medium and Large Screens, Same Items */}
    {navItems.map((item) => (
      <li
        key={item.path}
        className={`hidden lg:flex md:flex justify-center p-2 hover:rounded-md hover:bg-gray-700 hover:translate-x-1 hover:-translate-y-1 duration-150 ${
          pathname === item.path
            ? "bg-gray-700 rounded-md text-yellow-300"
            : ""
        }`}
      >
        <Link href={item.path}>{item.label}</Link>
      </li>
    ))}

    {/* Additional Info */}
    <li className="lg:flex md:hidden hidden space-x-1 text-gray-400 text-[14px]">
      <TiWeatherCloudy size={20} />
      <div>{temperature ? `${temperature}°C` : ""}</div>
    </li>
    <li className="lg:flex md:hidden hidden">{currentTime}</li>
    <li className="lg:flex md:hidden hidden">{currentDate}</li>
  </ul>
</div>



    </div>
  );
};

export default Header;

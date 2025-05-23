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
import { Ramaraja } from "next/font/google";
import { FaAngleDown } from "react-icons/fa";

const ramaraja = Ramaraja({
  subsets: ["latin", "telugu"],
  weight: "400",
});

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
  const [districtsOpen, setDistrictsOpen] = useState(false);

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

  {
    /*useEffect(() => {
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
  }, []);*/
  }

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
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    router.push("/");
  };

  if (isLoggedIn === null) {
    return null;
  }

  const handleLinkClick = () => {
    setMenu(false);
  };

  const handleDistricts = () => {
    setDistrictsOpen(!districtsOpen);
  };

  const navItems = [
    { path: "/", label: translations.home },
    { path: "/hyderabad", label: translations.hyderabad },
    { path: "/telangana", label: translations.telangana },
    { path: "/india", label: translations.india },
    { path: "/world", label: translations.world },
    { path: "/politics", label: translations.politics },
    { path: "/business", label: translations.business },
    { path: "/health", label: translations.health },
    { path: "/sports", label: translations.sports },
    { path: "/film", label: translations.film },
    { path: "/others", label: translations.others },
  ];

  const Districts = [
    { path: "/Adilabad", label: translations.adilabad },
    { path: "/Bhadradri Kothagudem", label: translations.bhadradri },
    { path: "/Hanumakonda", label: translations.hanumakonda },
    { path: "/Hyderabad", label: translations.hyderabad },
    { path: "/Jagitial", label: translations.jagitial },
    { path: "/Janagam", label: translations.jangoan },
    { path: "/Jayashankar Bhupalpally", label: translations.bupalpally },
    { path: "/Jogulamba Gadwal", label: translations.gadwal },
    { path: "/Kamareddy", label: translations.kamareddy },
    { path: "/Karimnagar", label: translations.karimnagar },
    { path: "/Khammam", label: translations.khammam },
    { path: "/Komaram Bheem Asifabad", label: translations.bheem },
    { path: "/Mahabubabad", label: translations.mahabubabad },
    { path: "/Mahabubnagar", label: translations.mahabubnagar },
    { path: "/Mancherial", label: translations.mancherial },
    { path: "/Medak", label: translations.medak },
    { path: "/Medchal Malkajgiri", label: translations.malkajgiri },
    { path: "/Mulugu", label: translations.mulugu },
    { path: "/Nagarkurnool", label: translations.nagarkurnool },
    { path: "/Nalgonda", label: translations.nalgonda },
    { path: "/Narayanpet", label: translations.narayanpet },
    { path: "/Nirmal", label: translations.nirmal },
    { path: "/Nizamabad", label: translations.nizamabad },
    { path: "/Peddapalli", label: translations.peddapalli },
    { path: "/Rajanna Sircilla", label: translations.sircilla },
    { path: "/Rangareddy", label: translations.rangareddy },
    { path: "/Sangareddy", label: translations.sangareddy },
    { path: "/Siddipet", label: translations.siddipet },
    { path: "/Suryapet", label: translations.suryapet },
    { path: "/Vikarabad", label: translations.vikarabad },
    { path: "/Wanaparthy", label: translations.wanaparthy },
    { path: "/Warangal", label: translations.warangal },
    { path: "/Yadadri Bhuvanagiri", label: translations.yadadri },
  ];

  const smallScreenNavItems = navItems;

  return (
    <div className="bg-gradient-to-r from-orange-400  to-orange-600  bg-orange-300 shadow-md  rounded-b-md fixed w-[100%] z-50 lg:px-10 md:px-5 px-4 lg:py-5 md:py-2 py-2 lg:space-y-2 md:space-y-1">
      <div className="flex justify-between">
        <div className="bg-white rounded-md shadow-md">
          <Image
            src={Logo}
            alt="No Logo Found"
            className="lg:w-16 md:w-14 w-10"
          />
        </div>

        <div>
          <ul className="flex lg:space-x-4 md:space-x-2 space-x-2 lg:text-[14px] md:text-[14px] text-[8px] ">
            <li>
              <button
                onClick={toggleLanguage}
                className="text-orange-600 bg-white shadow-md rounded-md lg:w-40 md:w-32 lg:text-[14px] md:text-[10px] text-[8px] w-14 h-8 lg:h-10 md:h-10 border border-1 hover:transform duration-150 hover:translate-x-1 hover:-translate-y-1 border-orange-600 lg:p-2 md:p-2 p-1 font-semibold"
              >
                {language === "en"
                  ? translations.switchTo
                  : translations.switchTo}
              </button>
            </li>

            <li className="text-orange-600 bg-white shadow-md rounded-md lg:w-40 md:w-32 w-14 h-8 lg:h-10 md:h-10 border border-1 hover:transform duration-150 hover:translate-x-1 hover:-translate-y-1 border-orange-600 lg:p-2 md:p-2 p-1 font-semibold flex justify-center items-center">
              <Link
                href="/e-paper"
                className="flex  items-center gap-x-2 lg:text-[14px] md:text-[10px] text-[8px]"
              >
                <MdDownload /> {translations.epaper}
              </Link>
            </li>

            {isLoggedIn && (
              <ul className="flex lg:gap-10 md:gap-4 gap-4 items-center">
                {userRole === "Admin" && (
                  <li className="lg:space-x-10 md:space-x-2 space-x-2 flex justify-center items-center relative">
                    <button
                      className="text-orange-600 bg-white shadow-md rounded-md border lg:w-40 md:w-32 w-20 h-8 lg:h-10 md:h-10 border-1 lg:text-[14px] md:text-[10px] text-[8px] hover:transform duration-150 hover:translate-x-1 hover:-translate-y-1 border-orange-600 lg:p-2 md:p-2 p-1 font-semibold"
                      onClick={() => setDropdownOpen((prev) => !prev)}
                    >
                      {translations.approve}
                      <span className="ml-2">&#x25BC;</span>
                    </button>

                    {dropdownOpen && (
                      <ul
                        className={`absolute top-full left-0 mt-1 bg-white text-orange-600 rounded shadow-lg ${
                          language === "en"
                            ? ` lg:w-36 md:w-32 w-32`
                            : `lg:w-40 md:w-40 w-32`
                        }`}
                      >
                        <li>
                          <button
                            onClick={() => router.push("/approve-news")}
                            className="block w-full text-left px-4 py-2 hover:bg-orange-100"
                          >
                            {translations.approvenews}
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => router.push("/approve-video")}
                            className="block w-full text-left px-4 py-2 hover:bg-orange-100"
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
                    <div className="relative">
                      <button
                        className="text-orange-600 bg-white shadow-md rounded-md lg:w-40 md:w-40 w-16 h-8 lg:h-10 md:h-10 border border-1 border-orange-600 p-1 font-semibold flex items-center justify-center"
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        {translations.add}
                        <span className="ml-2">&#x25BC;</span>
                      </button>

                      {showDropdown && (
                        <div
                          className={`absolute bg-white text-orange-600 border border-orange-600 mt-1 rounded z-10 ${
                            language === "en"
                              ? `lg:w-36 md:w-32 w-32`
                              : `lg:w-40 md:w-40 w-32`
                          }`}
                        >
                          <button
                            onClick={() => router.push("/add-news")}
                            className="block w-full text-left px-4 py-2 hover:bg-orange-100"
                          >
                            {translations.addnews}
                          </button>
                          <button
                            onClick={() => router.push("/add-video")}
                            className="block w-full text-left px-4 py-2 hover:bg-orange-100"
                          >
                            {translations.addVideo}
                          </button>
                          <button
                            onClick={() => router.push("/add-paper")}
                            className="block w-full text-left px-4 py-2 hover:bg-orange-100"
                          >
                            {translations.addPaper}
                          </button>
                          <button
                            onClick={() => router.push("/add-greetings")}
                            className="block w-full text-left px-4 py-2 hover:bg-orange-100"
                          >
                            {translations.addGreeting || "Add Greeting"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Buttons for large screens */}
                    <div className="hidden space-x-4">
                      <button
                        onClick={() => router.push("/add-news")}
                        className="text-black lg:w-40 md:w-40 w-16 h-8 lg:h-10 md:h-10 border border-orange-600 lg:p-2 md:p-2 p-1 font-semibold hover:transform hover:translate-x-1 hover:-translate-y-1 duration-150"
                      >
                        {translations.addnews}
                      </button>
                      <button
                        onClick={() => router.push("/add-video")}
                        className="text-black lg:w-40 md:w-40 w-16 h-8 lg:h-10 md:h-10 border border-orange-600 lg:p-2 md:p-2 p-1 font-semibold hover:transform hover:translate-x-1 hover:-translate-y-1 duration-150"
                      >
                        {translations.addVideo}
                      </button>
                      <button
                        onClick={() => router.push("/add-paper")}
                        className="text-black lg:w-40 md:w-40 w-16 h-8 lg:h-10 md:h-10 border border-orange-600 lg:p-2 md:p-2 p-1 font-semibold hover:transform hover:translate-x-1 hover:-translate-y-1 duration-150"
                      >
                        {translations.addPaper}
                      </button>
                      <button
                        onClick={() => router.push("/add-greetings")}
                        className="text-black lg:w-40 md:w-40 w-16 h-8 lg:h-10 md:h-10 border border-orange-600 lg:p-2 md:p-2 p-1 font-semibold hover:transform hover:translate-x-1 hover:-translate-y-1 duration-150"
                      >
                        {translations.addGreeting}
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
                        className={`text-orange-600 absolute lg:mt-6 md:mt-4 lg:w-60 md:w-56 w-32 font-bold space-y-4 p-4 right-0 flex flex-col items-center bg-white border border-orange-300 shadow-md rounded-md ${
                          language === "te"
                            ? ` lg:text-[16px] md:text-[14px] ${ramaraja.className}`
                            : ``
                        } `}
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
                          <Link href="/settings">{translations.settings}</Link>
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
                <li className="text-orange-600 bg-white shadow-md rounded-md  hover:transform duration-150 lg:text-[14px] md:text-[10px] text-[8px] lg:w-40 md:w-32 w-14 lg:h-10 md:h-10 h-8  hover:translate-x-1 hover:-translate-y-1 border border-1 border-orange-600 lg:p-2 md:p-2 p-1 font-semibold flex justify-center items-center">
                  <Link href="/signUp">{translations.register}</Link>
                </li>
                <li className="text-orange-600 bg-white rounded-md shadow-md hover:transform duration-150 hover:translate-x-1 lg:text-[14px] md:text-[10px] text-[8px] hover:-translate-y-1 border border-1 border-orange-600 lg:p-2 md:p-2 p-1 font-semibold lg:w-40 md:w-32 w-14 lg:h-10 md:h-10 h-8 flex justify-center items-center">
                  <Link href="/Login">{translations.login}</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="lg:px-20 lg:py-0 md:py-4 py-4 ">
        <ul
          className={`text-white flex flex-wrap justify-evenly font-bold items-center ${
            language === "en"
              ? "lg:text-[14px] md:text-[12px] text-[12px]"
              : `lg:text-[17px] md:text-[14px] text-[14px] ${ramaraja.className}`
          }`}
        >
          <div
            className="flex lg:hidden md:justify-center  w-full overflow-x-auto scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex items-center w-max p-1 whitespace-nowrap">
              <div
                className="flex items-center gap-2"
                onClick={handleDistricts}
              >
                {translations.districts} <FaAngleDown /> {"|"}
              </div>
              {smallScreenNavItems.map((item, index) => (
                <React.Fragment key={item.path}>
                  <li
                    className={`inline-block lg:p-2 md:p-2 py-1 px-2 mx-1 hover:rounded-md hover:bg-white hover:text-orange-600 lg:hover:translate-x-1 lg:hover:-translate-y-1 duration-150 ${
                      pathname === item.path
                        ? "bg-white rounded-md text-orange-600"
                        : ""
                    }`}
                  >
                    <Link href={item.path}>{item.label}</Link>
                  </li>
                  {index < smallScreenNavItems.length - 1 && (
                    <span className="inline-block px-2 text-white">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 ml-2">
              {navItems.map((item, index) => (
                <React.Fragment key={item.path}>
                  <li
                    className={`hidden lg:flex md:hidden justify-between p-2 hover:rounded-md hover:bg-white hover:text-orange-600 hover:translate-x-[1px] hover:-translate-y-[1px] duration-150 ${
                      pathname === item.path
                        ? "bg-white rounded-md text-orange-600"
                        : ""
                    }`}
                  >
                    <Link href={item.path} className="flex gap-2 items-center">
                      {item.label}
                    </Link>
                  </li>
                  {index < navItems.length && (
                    <span className="hidden lg:flex md:hidden px-2 text-white">
                      |
                    </span>
                  )}
                </React.Fragment>
              ))}
              <div
                className="lg:flex items-center gap-2 md:hidden hidden relative"
                onClick={handleDistricts}
              >
                {translations.districts} <FaAngleDown />
              </div>

              {districtsOpen && (
                <div className="absolute top-full right-0 w-72 bg-white text-black opacity-90  overflow-scroll scrollbar-hide h-screen pb-40 pt-4">
                  <div className="flex flex-col ">
                    {Districts.map((item) => (
                      <div key={item.path} className="py-2">
                        <Link
                          href={`/districts/${item.path}`}
                          className={`px-10 hover:text-orange-600 font-semibold block w-full ${
                            language === "te" ? "text-[16px]" : "text-[14px]"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/*<div className="flex space-x-4 items-center">
              <li className="lg:flex md:hidden hidden space-x-1 text-white text-[14px]">
                <TiWeatherCloudy size={20} />
                <div>{temperature ? `${temperature}°C` : ""}</div>
              </li>
              <li className="lg:flex md:hidden justify-between items-center gap-2 hidden text-white">
                <span>{currentTime}</span>
                <span>{currentDate}</span>
              </li>
            </div>*/}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Header;

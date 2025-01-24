"use client"
import React, { createContext, useState, useContext } from "react";
import en from "../locales/en"; 
import te from "../locales/te"; 

const LanguageContext = createContext();


export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("te"); 
  const translations = language === "en" ? en : te;

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "en" ? "te" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language,setLanguage, translations, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => useContext(LanguageContext);

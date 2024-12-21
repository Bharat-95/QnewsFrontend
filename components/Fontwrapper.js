"use client";

import { useLanguage } from "@/context/languagecontext";
import { Poppins } from "next/font/google";
import { Ramabhadra } from "next/font/google";
import { Ramaraja } from "next/font/google";
import { Mandali } from "next/font/google";
import { Noto_Sans_Telugu } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ramabhadra = Ramabhadra({
  subsets: ["latin", "telugu"],
  weight: ["400"],
});

const mandali = Mandali({
    subsets: ['telugu'],
    weight:["400"]
}) 



const ramaraja = Ramaraja({
    subsets: ["latin", "telugu"], // Specify subsets
    weight: "400", // Specify font weight
  });
  

export default function FontWrapper({ children }) {
  const { language } = useLanguage();
  const fontClass =
    language === "te" ? mandali.className : poppins.className;

  return <div className={`${fontClass}`}>{children}</div>;
}

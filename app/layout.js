import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/context/languagecontext";
import Header from "@/components/Header";
import Footer from "@/components/Footer"
import { Poppins } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';




const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Q News",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-orange-50">
      <body className={`${poppins.className} font-sans`}>
        <LanguageProvider>
          <Header/>
          <div className="lg:pt-[10%] md:pt-[20%] pt-[35%] ">{children}</div>
          <Footer />

        </LanguageProvider>
        <Analytics/>
      
        
      </body>
    </html>
  );
}

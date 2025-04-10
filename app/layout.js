import localFont from "next/font/local";
import Script from "next/script"; // Import next/script
import "./globals.css";
import { LanguageProvider } from "@/context/languagecontext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Poppins } from "next/font/google";
import FontWrapper from "@/components/Fontwrapper";

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
  description: "Voice of People",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-orange-50">
      <head></head>
      <body className="font-sans">
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-REH7Y6Y3XH"
          strategy="afterInteractive"
        />

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5147970592590624"
          crossorigin="anonymous"
          strategy="afterInteractive"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-REH7Y6Y3XH');
            `,
          }}
        />

        {/* Clicky Analytics Script */}
        <Script
          async
          data-id="101474780"
          src="https://static.getclicky.com/js"
          strategy="afterInteractive"
        />

        <LanguageProvider>
          <FontWrapper>
            <Header />

            <div className="lg:pt-[10%] md:pt-[20%] pt-[35%]">{children}</div>

            <Footer />
          </FontWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}

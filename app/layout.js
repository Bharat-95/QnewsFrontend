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
        {/* Google Analytics */}
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
        
        <LanguageProvider>
          <FontWrapper>
            {/* Header with Ad */}
            <Header />
            <div className="ad-container">
              {/* Example: Ad unit in the header */}
              <ins className="adsbygoogle"
                  style={{display: 'block', width: '100%', height: '90px'}}
                  data-ad-client="ca-pub-5147970592590624"
                  data-ad-slot="XXXXXXXXX"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
            </div>
            
            {/* Main content */}
            <div className="lg:pt-[10%] md:pt-[20%] pt-[35%]">{children}</div>

            {/* Ad Container: Can be placed anywhere like between sections */}
            <div className="ad-main">
              {/* Example: Sidebar or any space you want to fill */}
              <ins className="adsbygoogle"
                  style={{display: 'block', width: '300px', height: '250px'}}
                  data-ad-client="ca-pub-5147970592590624"
                  data-ad-slot="XXXXXXXXX"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
            </div>
            
            {/* Footer with Ad */}
            <Footer />
            <div className="ad-footer">
              {/* Footer Ad */}
              <ins className="adsbygoogle"
                  style={{display: 'block', width: '100%', height: '90px'}}
                  data-ad-client="ca-pub-5147970592590624"
                  data-ad-slot="XXXXXXXXX"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
            </div>
          </FontWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}

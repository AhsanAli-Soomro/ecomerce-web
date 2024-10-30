import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ProductProvider } from "../contexts/ProductContext";
import Navbar from "./components/Navbar";
import { CartProvider } from "@/contexts/CartContext";
import Footer from "./components/Footer";

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
  title: "Royal Hunt",
  description: "Royal Hunt Life Style",
};

export default function RootLayout({ children }) {
  
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ProductProvider>
            <CartProvider>
              <Navbar />
              <div className=" bg-gray-100 px-4 pt-28">
                {children}
              </div>
              <Footer/>
            </CartProvider>
          </ProductProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

import Footer from "@/components/Footer/Footer";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/redux/ReduxProvider";
import Stickyfooter from "@/components/Stickyfooter";

export const metadata = {
  title: "Buyer Registration | Get Quotes from Verified Suppliers | Inquiry Bazaar",
  description: "Create your buyer account on Inquiry Bazaar to submit product and service requirements, compare quotations from verified suppliers, and connect with trusted manufacturers across India for hassle-free B2B sourcing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">


        <ReduxProvider>
          <Stickyfooter />
          <Navbar />
          <Toaster position="top-center" />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
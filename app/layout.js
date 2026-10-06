
import "./globals.css";
import Navbar from "../components/Navbar/Navbar.jsx";
import "./mobile.css";
import { AuthProvider } from "../context/AuthContext.jsx";

export const metadata = {
  title: "GiftGenie",
  description: "Find the perfect gift for every occasion",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
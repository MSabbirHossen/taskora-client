import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const RootLayout = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <Navbar />
    <main className="pt-20">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default RootLayout;

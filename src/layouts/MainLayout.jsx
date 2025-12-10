import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
      <Navbar />

      {/* Page Content */}
      <div className="min-h-[70vh]">
        <Outlet />
      </div>

      <Footer />
    </>
  );
};

export default MainLayout;

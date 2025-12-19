import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";

const MainLayout = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-[70vh]">
        <Outlet />
      </div>

      <Footer />
    </>
  );
};

export default MainLayout;

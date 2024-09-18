import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home, CreditCard, LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  return (
    <nav className="bg-gray-800 p-4 shadow-md fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-gray-200 text-2xl font-bold">Credit-Sea</h1>
        <div className="flex space-x-6">
          <Link to="/user/dashboard" className="flex items-center text-gray-300 hover:text-gray-100 transition">
            <Home className="mr-2" />
            Home
          </Link>

          <Link to="/user/dashboard/payment" className="flex items-center text-gray-300 hover:text-gray-100 transition">
            <CreditCard className="mr-2" />
            Payments
          </Link>
        </div>
        <button onClick={handleLogout} className="flex items-center text-gray-300 hover:text-gray-100 transition">
          <LogOut className="mr-2" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

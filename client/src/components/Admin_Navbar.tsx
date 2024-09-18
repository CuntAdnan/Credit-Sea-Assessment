import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { DollarSign, LogOut, Landmark, Contact, BarChart } from "lucide-react";

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
    <nav className="bg-gray-900 p-4 shadow-md fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-gray-100 text-2xl font-bold">Credit-Sea</h1>
        <div className="flex space-x-6">
          <Link to="/admin/dashboard" className="flex items-center text-gray-300 hover:text-gray-100 transition">
            <BarChart className="mr-2" />
            Dashboard
          </Link>

          <Link to="/admin/dashboard/borrowers" className="flex items-center text-gray-300 hover:text-gray-100 transition">
            <Contact className="mr-2" />
            Borrowers
          </Link>

          <Link to="/admin/dashboard/repayments" className="flex items-center text-gray-300 hover:text-gray-100 transition">
            <DollarSign className="mr-2" />
            Repayments
          </Link>

          <Link to="/admin/dashboard/loans" className="flex items-center text-gray-300 hover:text-gray-100 transition">
            <Landmark className="mr-2" />
            Loans
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

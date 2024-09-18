import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInForm from "./components/Signin";
import SignUpForm from "./components/SignupForm";
import User_DashBoard from "./pages/User_DashBoard";
import Admin_DashBoard from "./pages/Admin_DashBoard";
import BorrowerLoanList from "./admin_components/BorrowerLoanList";
import LoanList from "./admin_components/LoanList";
import Payments from "./components/Payments"; 
import Repayments from "./admin_components/Repayments";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignInForm isAdmin={false} />} />
        <Route path="/login/admin" element={<SignInForm isAdmin={true} />} />
        <Route path="/signup" element={<SignUpForm isAdmin={false} />} />
        <Route path="/signup/admin" element={<SignUpForm isAdmin={true} />} />
        <Route path="/user/dashboard" element={<User_DashBoard />} />
        <Route path="/admin/dashboard" element={<Admin_DashBoard />} />
        <Route path="/user/dashboard/payment" element={<Payments />} />
        <Route path="/admin/dashboard/borrowers" element={<BorrowerLoanList />} />
        <Route path="/admin/dashboard/repayments" element={<Repayments />} /> 
        <Route path="/admin/dashboard/loans" element={<LoanList />} />
      </Routes>
    </Router>
  );
}

export default App;

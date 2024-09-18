import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import LoanBox from "@/components/LoanBox";
import { useNavigate } from "react-router-dom";

function User_DashBoard() {
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [loanData, setLoanData] = useState({
    name: "",
    tenure: 12,
    reason: "",
    employmentStatus: "",
    amount: 10000,
    repaymentDueDate: "",
  });
  const [paymentData, setPaymentData] = useState({
    loan_id: "",
    amount: "",
  });
  const navigate = useNavigate();

  // Check for token
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    // Fetch loans when token is present
    fetchLoans();
  }, [token, loading, navigate]);

  // Fetch loans from the server
  const fetchLoans = async () => {
    try {
      if (!token) {
        toast.error("You must be logged in to view loans");
        return;
      }
      const response = await axios.get("http://localhost:5000/user/loans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoans(response.data.loans);
    } catch (error: any) {
      console.error("Error fetching loans:", error);
      toast.error("An error occurred while fetching loans.");
    }
  };

  // Refresh loans after successful loan application or payment
  const refreshLoans = async () => {
    setLoading(true);
    await fetchLoans();
    setLoading(false);
  };

  const createLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token) {
        toast.error("You must be logged in to apply for a loan");
        setLoading(false);
        return;
      }

      await axios.post("http://localhost:5000/user/apply-loan", loanData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Loan application submitted successfully!");
      setLoanData({
        name: "",
        tenure: 12,
        reason: "",
        employmentStatus: "",
        amount: 10000,
        repaymentDueDate: "",
      });
      setShowLoanForm(false);
      await refreshLoans();
    } catch (error: any) {
      console.error("Error applying for loan:", error);
      toast.error("An error occurred while applying for the loan.");
    } finally {
      setLoading(false);
    }
  };

  const makePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token) {
        toast.error("You must be logged in to make a payment");
        setLoading(false);
        return;
      }

      await axios.post("http://localhost:5000/user/make-payment", paymentData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Payment made successfully!");
      setPaymentData({ loan_id: "", amount: "" });
      setShowPaymentForm(false);
      await refreshLoans();
    } catch (error: any) {
      console.error("Error making payment:", error);
      toast.error("An error occurred while making the payment.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null; // Render nothing if token is not found
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-16 space-y-8 bg-gray-900 text-white p-8 min-h-screen">
        <div className="flex space-x-4">
          <Button
            onClick={() => setShowLoanForm(true)}
            className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 py-2 px-6 rounded-lg shadow-lg"
          >
            Apply for a Loan
          </Button>
          <Button
            onClick={() => setShowPaymentForm(true)}
            className="bg-green-600 text-white hover:bg-green-700 transition-all duration-300 py-2 px-6 rounded-lg shadow-lg"
          >
            Make a Payment
          </Button>
        </div>

        <LoanBox loans={loans} />

        {showLoanForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-sm max-h-[85vh] overflow-y-auto">
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Apply for a Loan
              </h3>
              <form onSubmit={createLoan} className="space-y-4">
                {/* Name Field */}
                <div className="flex flex-col space-y-2">
                  <label className="font-medium text-gray-300">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={loanData.name}
                    onChange={(e) =>
                      setLoanData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter your name"
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Tenure Field */}
                <div className="flex flex-col space-y-2">
                  <label className="font-medium text-gray-300">
                    Tenure (in months)
                  </label>
                  <input
                    type="number"
                    name="tenure"
                    value={loanData.tenure}
                    onChange={(e) =>
                      setLoanData((prev) => ({
                        ...prev,
                        tenure: Number(e.target.value),
                      }))
                    }
                    placeholder="Loan tenure in months"
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Reason Field */}
                <div className="flex flex-col space-y-2">
                  <label className="font-medium text-gray-300">
                    Reason for Loan
                  </label>
                  <input
                    type="text"
                    name="reason"
                    value={loanData.reason}
                    onChange={(e) =>
                      setLoanData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    placeholder="Reason for the loan"
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Employment Status Field */}
                <div className="flex flex-col space-y-2">
                  <label className="font-medium text-gray-300">
                    Employment Status
                  </label>
                  <input
                    type="text"
                    name="employmentStatus"
                    value={loanData.employmentStatus}
                    onChange={(e) =>
                      setLoanData((prev) => ({
                        ...prev,
                        employmentStatus: e.target.value,
                      }))
                    }
                    placeholder="Employment status (e.g., Employed, Unemployed, etc.)"
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Loan Amount Field */}
                <div className="flex flex-col space-y-2">
                  <label className="font-medium text-gray-300">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={loanData.amount}
                    onChange={(e) =>
                      setLoanData((prev) => ({
                        ...prev,
                        amount: Number(e.target.value),
                      }))
                    }
                    placeholder="Enter loan amount"
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Repayment Due Date Field */}
                <div className="flex flex-col space-y-2">
                  <label className="font-medium text-gray-300">
                    Repayment Due Date
                  </label>
                  <input
                    type="date"
                    name="repaymentDueDate"
                    value={loanData.repaymentDueDate}
                    onChange={(e) =>
                      setLoanData((prev) => ({
                        ...prev,
                        repaymentDueDate: e.target.value,
                      }))
                    }
                    placeholder="Select repayment due date"
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoanForm(false)}
                    className="bg-red-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Make a Payment
              </h3>
              <form onSubmit={makePayment} className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="font-medium text-gray-300">Loan ID</label>
                  <input
                    type="text"
                    name="loan_id"
                    value={paymentData.loan_id}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        loan_id: e.target.value,
                      }))
                    }
                    placeholder="Loan ID"
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-medium text-gray-300">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={paymentData.amount}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="Payment Amount"
                    className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="bg-red-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Toaster position="top-center" />
      </div>
    </>
  );
}

export default User_DashBoard;

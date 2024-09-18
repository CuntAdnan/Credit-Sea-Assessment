import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Admin_Navbar";

interface Loan {
  loanId: string;
  borrowerName: string;
  amount: number;
  status: string;
  applicationDate: string;
}

const LoansList: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/loans");
        setLoans(response.data);
      } catch (error) {
        setError("Failed to fetch loans");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleApproveLoan = async (loanId: string) => {
    try {
      const response = await axios.post(`http://localhost:5000/admin/approveLoan/${loanId}`);
      if (response.status === 200) {
        // Update the status of the loan in the state
        setLoans(loans.map((loan) =>
          loan.loanId === loanId ? { ...loan, status: "approved" } : loan
        ));
      }
    } catch (error) {
      setError("Failed to approve loan");
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-900 min-h-screen p-4">
        <div className="container mx-auto mt-10 p-4 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-gray-100">Loans List</h1>
          <table className="min-w-full bg-gray-700 border border-gray-600 rounded-lg shadow-md">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Loan ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Borrower Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Application Date
                </th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.loanId} className="border-b border-gray-600">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {loan.loanId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {loan.borrowerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    ${loan.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loan.status === "pending" ? (
                      <button
                        onClick={() => handleApproveLoan(loan.loanId)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Pending
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                        disabled
                      >
                        Approved
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {new Date(loan.applicationDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default LoansList;

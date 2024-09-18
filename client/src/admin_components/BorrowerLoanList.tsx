import React, { useEffect, useState } from "react";
import axios from "axios";
import Admin_Navbar from '../components/Admin_Navbar';

interface Loan {
  borrowerName: string;
  amount: number;
  loanTakenDate: string;
}

const BorrowerLoanList: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/loanDetails");
        setLoans(response.data);
      } catch (error: any) {
        setError("Failed to fetch loan details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Loading loan details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <Admin_Navbar />
      <div className="bg-gray-900 min-h-screen p-6">
        <div className="container mx-auto mt-10 p-4 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-100 text-center">
            Borrower Loan Details
          </h1>
          <table className="min-w-full bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-600 text-gray-300">
              <tr>
                <th className="w-1/3 py-2 text-left px-4">Borrower Name</th>
                <th className="w-1/3 py-2 text-left px-4">Amount</th>
                <th className="w-1/3 py-2 text-left px-4">Loan Taken Date</th>
              </tr>
            </thead>
            <tbody>
              {loans.length > 0 ? (
                loans.map((loan, index) => (
                  <tr key={index} className="border-b border-gray-600">
                    <td className="py-4 px-4 text-gray-200">{loan.borrowerName}</td>
                    <td className="py-4 px-4 text-gray-200">${loan.amount.toFixed(2)}</td>
                    <td className="py-4 px-4 text-gray-200">{loan.loanTakenDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-center text-gray-400">
                    No loans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BorrowerLoanList;

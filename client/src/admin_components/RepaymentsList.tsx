import React, { useEffect, useState } from "react";
import axios from "axios";

interface Repayment {
  borrowerName: string;
  amount: number;
  repaymentDate: string;
}

const RepaymentsList: React.FC = () => {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepayments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/paidLoans");
        setRepayments(response.data);
      } catch (error) {
        setError("Failed to fetch repayments");
      } finally {
        setLoading(false);
      }
    };

    fetchRepayments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Repayments List</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repayment Date</th>
          </tr>
        </thead>
        <tbody>
          {repayments.map((repayment, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-6 py-4 whitespace-nowrap">{repayment.borrowerName}</td>
              <td className="px-6 py-4 whitespace-nowrap">${repayment.amount.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(repayment.repaymentDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RepaymentsList;

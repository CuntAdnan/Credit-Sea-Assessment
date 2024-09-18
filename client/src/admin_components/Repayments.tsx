import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '@/components/Admin_Navbar';

interface Repayment {
  amount: number;
  repaymentDueDate: string;
  borrowerId: string;
}

const Repayments: React.FC = () => {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepayments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/paidLoans');
        setRepayments(response.data);
      } catch (error) {
        setError('Failed to fetch repayments');
      } finally {
        setLoading(false);
      }
    };

    fetchRepayments();
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  
  console.log(repayments);

  return (
    <>
      <AdminNavbar />
      <div className="bg-gray-900 min-h-screen p-4">
        <div className="container mx-auto mt-10 p-4 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-gray-100">Repayments</h1>
          <table className="min-w-full bg-gray-700 border border-gray-600 rounded-lg shadow-md">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Repayment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Loan ID
                </th>
              </tr>
            </thead>
            <tbody>
              {repayments.map((repayment, index) => (
                <tr key={index} className="border-b border-gray-600">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    ${repayment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {new Date(repayment.repaymentDueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {repayment.borrowerId}
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

export default Repayments;

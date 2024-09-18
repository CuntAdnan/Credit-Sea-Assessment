import React from "react";
import toast from 'react-hot-toast';

interface Loan {
  _id: string;
  name: string;
  amount: number;
  repaymentDueDate: string;
  status: string;
  amountRemaining: number;
}

interface LoanBoxProps {
  loans: Loan[];
}

const LoanBox: React.FC<LoanBoxProps> = ({ loans }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Loan ID copied to clipboard!");
    }).catch((err) => {
      toast.error("Failed to copy text.");
      console.error("Failed to copy text: ", err);
    });
  };

  if (loans.length === 0) {
    return (
      <div className="text-center text-gray-300">
        <p>No loans found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-200">
          Your Loans
        </h2>
        <table className="table-auto w-full border-collapse bg-gray-900 text-gray-300">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 px-4 py-2">Loan ID</th>
              <th className="border border-gray-600 px-4 py-2">Loan Name</th>
              <th className="border border-gray-600 px-4 py-2">Amount</th>
              <th className="border border-gray-600 px-4 py-2">Amount Remaining</th>
              <th className="border border-gray-600 px-4 py-2">Repayment Due Date</th>
              <th className="border border-gray-600 px-4 py-2">Status</th>
              
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const statusStyle =
                loan.status === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white";

              return (
                <tr key={loan._id} className="text-center bg-gray-800 hover:bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2">
                    <div className="flex items-center justify-between">
                      <span>{loan._id}</span>
                      <button
                        onClick={() => copyToClipboard(loan._id)}
                        className="ml-2 text-blue-400 hover:text-blue-300"
                        aria-label="Copy Loan ID"
                      >
                        📋
                      </button>
                    </div>
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{loan.name}</td>
                  <td className="border border-gray-600 px-4 py-2">${loan.amount}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    ${loan.amountRemaining}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {new Date(loan.repaymentDueDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    <span className={`py-1 px-3 rounded ${statusStyle} text-xs`}>
                      {loan.status}
                    </span>
                  </td>
                  
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanBox;

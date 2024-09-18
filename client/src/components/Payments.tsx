import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

interface Payment {
  _id: string;
  loan_id: string;
  amount: number;
  payment_date: string;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/user/user-payments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPayments(response.data.payments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <div className="text-center text-gray-300">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 px-4 mt-11 bg-gray-900 text-gray-300">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Your Payments
          </h2>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="border px-4 py-2">Loan ID</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="border px-4 py-2 text-center">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="text-center bg-gray-800 hover:bg-gray-700"
                  >
                    <td className="border px-4 py-2">{payment.loan_id}</td>
                    <td className="border px-4 py-2">${payment.amount}</td>
                    <td className="border px-4 py-2">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Payments;

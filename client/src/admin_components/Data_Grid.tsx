import { useState, useEffect } from 'react';
import axios from 'axios';
import DataCard from '@/admin_components/DataCard';
import { CircleUser, CreditCard, Bitcoin, Worm, HandCoins } from 'lucide-react';

function Data_Grid() {
  const [borrowersCount, setBorrowersCount] = useState<number | null>(null);
  const [loanCount, setLoanCount] = useState<number | null>(null);
  const [repaymentsCount, setRepaymentsCount] = useState<number | null>(null);
  const [disbursedAmount, setDisbursedAmount] = useState<number | null>(null);
  const [totalPayments, setTotalPayments] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [borrowersRes, loanRes, repaymentsRes, disbursedRes, paymentsRes] = await Promise.all([
        axios.get('http://localhost:5000/admin/borrowers'),
        axios.get('http://localhost:5000/admin/loanCount'),
        axios.get('http://localhost:5000/admin/repayments'),
        axios.get('http://localhost:5000/admin/disbursed'),
        axios.get('http://localhost:5000/admin/payments'),
      ]);

      setBorrowersCount(borrowersRes.data.count);
      setLoanCount(loanRes.data.count);
      setRepaymentsCount(repaymentsRes.data.count);
      setDisbursedAmount(disbursedRes.data.totalAmount);
      setTotalPayments(paymentsRes.data.totalAmount);

    } catch (error: any) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 60000); // Fetch data every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-900">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-3xl">
        {borrowersCount !== null && (
          <DataCard
            firstPartitionContent={<CircleUser className="h-12 text-gray-100 mx-auto" />}
            secondPartitionContent={{
              top: <span className="text-lg font-semibold text-gray-300 block text-center">Borrowers Count</span>,
              bottom: <span className="text-xl font-bold text-gray-100 block text-center">{borrowersCount}</span>
            }}
          />
        )}
        {loanCount !== null && (
          <DataCard
            firstPartitionContent={<CreditCard className="h-12 text-gray-100 mx-auto" />}
            secondPartitionContent={{
              top: <span className="text-lg font-semibold text-gray-300 block text-center">Total Loans</span>,
              bottom: <span className="text-xl font-bold text-gray-100 block text-center">{loanCount}</span>
            }}
          />
        )}
        {repaymentsCount !== null && (
          <DataCard
            firstPartitionContent={<Bitcoin className="h-12 text-gray-100 mx-auto" />}
            secondPartitionContent={{
              top: <span className="text-lg font-semibold text-gray-300 block text-center">Repayments Count</span>,
              bottom: <span className="text-xl font-bold text-gray-100 block text-center">{repaymentsCount}</span>
            }}
          />
        )}
        {disbursedAmount !== null && (
          <DataCard
            firstPartitionContent={<Worm className="h-12 text-gray-100 mx-auto" />}
            secondPartitionContent={{
              top: <span className="text-lg font-semibold text-gray-300 block text-center">Total Disbursed Amount</span>,
              bottom: <span className="text-xl font-bold text-gray-100 block text-center">${disbursedAmount.toFixed(2)}</span>
            }}
          />
        )}
        {totalPayments !== null && (
          <DataCard
            firstPartitionContent={<HandCoins className="h-12 text-gray-100 mx-auto" />}
            secondPartitionContent={{
              top: <span className="text-lg font-semibold text-gray-300 block text-center">Total Payments</span>,
              bottom: <span className="text-xl font-bold text-gray-100 block text-center">${totalPayments.toFixed(2)}</span>
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Data_Grid;

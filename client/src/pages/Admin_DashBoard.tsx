import axios from 'axios';
import AdminNavbar from '@/components/Admin_Navbar';
import Data_Grid from '@/admin_components/Data_Grid';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Loan {
  name: string;
  amount: string;
  applicationStatus: string;
  applicationDate: string;
}

function Admin_DashBoard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Adjust key if needed

    if (!token) {
      // Redirect to admin login if token is not found
      navigate('/login/admin');
      return;
    }

    const fetchLoans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/loans', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoans(response.data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      }
    };

    fetchLoans();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <AdminNavbar />
      <div className="container mx-auto p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <Data_Grid />
        </div>
        
      </div>
    </div>
  );
}

export default Admin_DashBoard;

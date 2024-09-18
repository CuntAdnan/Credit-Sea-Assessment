import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import { useState } from "react";

const SignInForm = ({ isAdmin }: { isAdmin: boolean }) => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event:React.FormEvent)=>{
    event.preventDefault();
    try{
      const data = {
        email:email,
        password:password
      }
      const response = await axios.post('http://localhost:5000/user/signin',data);
      localStorage.setItem("token", response.data.token);
      
      if(isAdmin){
        navigate('/admin/dashboard');
      }else{
        navigate('/user/dashboard');
      }
    
    }catch(error:any){
      console.log(error);
      throw error;
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-100">
          {isAdmin ? "Admin Login" : "User Login"}
        </h2>
        <p className="text-center text-gray-400">
          {isAdmin ? "Welcome back, Admin" : "Welcome back, User"}
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
            type="email"
            value={email}
            onChange={(e)=>{
              setEmail(e.target.value)
            }}
            placeholder="Enter your email"
            required
          />
          <Input
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
            type="password"
            value={password}
            onChange={(e)=>{
              setPassword(e.target.value)
            }}
            placeholder="Enter your password"
            required
          />
          <Button className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300">
            {isAdmin ? "Admin Sign In" : "User Sign In"}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-400">
          {isAdmin ? (
            <>
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:underline">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </p>
       
        {!isAdmin && (
          <p className="text-sm text-center text-gray-400">
            <Link to="/login/admin" className="text-blue-400 hover:underline">
              Admin Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignInForm;

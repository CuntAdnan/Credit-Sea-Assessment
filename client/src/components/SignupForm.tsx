import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const SignUpForm = ({ isAdmin }: { isAdmin: boolean }) => {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
  const navigate = useNavigate();


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const data = {
        name:name,
        email:email,
        password:password,
        isAdmin:isAdmin
      };
      console.log(data);
      const response= await axios.post("http://localhost:5000/user/signup",data);
      localStorage.setItem('token',response.data.token);
      
      if(isAdmin){
        navigate('/login/admin');
      }else{
        navigate('/login');
      }

    } catch (error: any) {

      console.error("Error during signup:", error.response?.data || error.message);
      
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-100">
          {isAdmin ? "Admin Sign Up" : "User Sign Up"}
        </h2>
        <p className="text-center text-gray-400">
          {isAdmin ? "Join our Admin team" : "Join our User community"}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <label className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div
                className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600"
                style={{
                  backgroundImage: `url(${avatar as string})`,
                  backgroundSize: "cover",
                }}
              >
                {!avatar && <span className="text-gray-400">Upload</span>}
              </div>
            </label>
          </div>
          <Input
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
          />
          <Input
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <Input
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
          <Button className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300">
            {isAdmin ? "Admin Sign Up" : "User Sign Up"}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-400">
          {isAdmin ? (
            <>
              Already have an account?{" "}
              <Link to="/login/admin" className="text-blue-400 hover:underline">
                Sign In
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Sign In
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

export default SignUpForm;

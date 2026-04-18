import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("API:", import.meta.env.VITE_API_URL);
  }, []);

  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/reset-password`,
        {
          email,
          new_password: password,
        }
      );


      setMessage(res.data.message);

       // ✅ REMOVE OLD TOKEN
      localStorage.removeItem("token");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err: any) {
      setMessage(err?.response?.data?.error || "Error ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-6 rounded-xl w-[320px]">
        <h2 className="text-xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        <input
          className="w-full p-2 border mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 border mb-3"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-purple-600 text-white py-2 rounded"
          onClick={handleReset}
        >
          Update Password
        </button>

        {message && (
          <p className="text-center mt-3 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}
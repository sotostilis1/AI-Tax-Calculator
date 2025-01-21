import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api.js';

const LogIn = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showMessage = (msg, type = "error") => {
    setMessage({ text: msg, type });
    setTimeout(() => {
      setMessage(null); // Clear the message after 3 seconds
    }, 2000);
  };

  const login = async () => {
    try {
      setLoading(true);
      const response = await api.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );

      //console.log("Login response:", response.data);

      setUser({
        id:response.data.id,
        username: response.data.username,
        role: response.data.role,
      });

      setLoading(false);
      showMessage("Login successful!", "success");
      setTimeout(() => {
        navigate("/main");
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error("Login error details:", error.response ? error.response.data : error.message);
      if (error.response?.status === 401) {
        showMessage("Wrong credentials.", "error");
      } else {
        showMessage("Error logging in.", "error");
      }
    }
  };

  const submitCredentials = () => {
    if (!username || !password) {
      showMessage("Username or password cannot be empty.", "error");
    } else {
      login();
    }
  };

  return (
    <div className="flex p-20 justify-center items-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="m-4 text-center">
          <div className="text-2xl font-semibold text-gray-700">Loading...</div>
          <div className="loader border-t-4 border-gray-500 rounded-full w-12 h-12 mx-auto mt-4"></div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 relative">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
          <p className="text-center text-gray-600 mb-6">
            Please enter your username and password to continue.
          </p>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={submitCredentials}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-blue-600 transition"
            >
              Login
            </button>
            <span className="mx-2 text-gray-500">or</span>
            <button
              onClick={() => navigate("/registration")}
              className="bg-green-500 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-green-600 transition"
            >
              Register
            </button>
          </div>
          {message && (
            <div
              className={`mt-6 p-4 text-center rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogIn;

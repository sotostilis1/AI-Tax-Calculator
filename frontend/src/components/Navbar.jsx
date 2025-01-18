import React, { useState } from "react";
import menu from "../assets/menu.svg";
import search from "../assets/search.svg";
import api from '../api.js';
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Error state
  const [searchUsername, setSearchUsername] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null); // Clear user state in the frontend
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const handleHistory = async () => {
    try {
      const response = await api.get("/chat/", { withCredentials: true });
      const chatHistory = response.data;
      const usernm = user.username

      // Navigate to /history and pass the chatHistory as state
      navigate("/history", { state: { chatHistory, usernm } });
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleSearch = async () => {
    const usernm = searchUsername.trim();
  
    if (!usernm) {
      setError("Please enter a valid username."); // Set the error message
      return;
    }
  
    setError(""); // Clear the error if input is valid
    console.log("Search for:", searchUsername);
  
    try {
      const response = await api.get(`/chat/usr/${usernm}`, { withCredentials: true });
      const chatHistory = response.data;
  
      if (!chatHistory || chatHistory.length === 0) {
        // If no chat history, clear the input and set the error
        setSearchUsername("");
        setError("No chat history found.");
        return;
      }
  
      navigate("/history", { state: { chatHistory, usernm } }); // Navigate with data
    } catch (error) {
      setError("Failed to fetch chat history. Please try again."); // Set a generic error
      if (error.response) {
        console.error(
          `Error fetching chat history: ${error.response.status} ${error.response.statusText}`,
          error.response.data
        );
      } else {
        console.error("Error fetching chat history:", error.message);
      }
    }
  };
  
  
  
  

  return (
    <div className="w-full fixed top-0 z-50 bg-white shadow-md h-[50px] flex items-center"> {/* Increased height */}
      <div className="flex justify-between items-center w-full md:max-w-[1240px] m-auto px-4">
        {/* Left Section: Mobile Menu Button */}
        <div className="flex items-center">
          <button onClick={toggleMenu} className="block sm:hidden mr-4">
            <img src={menu} alt="menu" className="w-6 h-6 cursor-pointer" />
          </button>
          <Link
            to="/main"
            className="text-black text-lg font-medium cursor-pointer hidden sm:block"
          >
            Home
          </Link>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="block sm:hidden absolute top-full left-0 w-[40%] bg-white shadow-md">
            <ul className="flex flex-col items-start p-4">
              <li className="cursor-pointer mb-2">
                <Link to="/main">Home</Link>
              </li>
              {!user && (
                <li className="cursor-pointer mb-2">
                  <Link to="/login">Login</Link>
                </li>
              )}
              {user && (
                <>
                  <li className="cursor-pointer" onClick={handleLogout}>
                    Logout
                  </li>
                </>
              )}
            </ul>
          </div>
        )}

        {/* Right Section: User Actions */}
        <div className="hidden sm:flex sm:mr-10 md:mr-10 items-center">
          {/* Conditional Search Bar for Admin Role */}
          {user?.role === "admin" && (
            <div className="flex items-center mr-4">
            <input
      type="text"
      placeholder={error || "Search..."} // Show error if present, otherwise default placeholder
      value={searchUsername}
      onChange={(e) => {
        setSearchUsername(e.target.value); // Update input value
        setError(""); // Clear error when user types
      }}
      onFocus={() => setError("")} // Clear error when input gains focus
      onBlur={() => {
        // Reset placeholder and clear error when input loses focus
        setError("");
        if (!searchUsername.trim()) {
          setSearchUsername(""); // Reset to empty string if the field is empty
        }
      }}
      className={`border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 ${
        error ? "border-red-500 ring-red-500 placeholder-red-500" : "border-gray-300 focus:ring-blue-500"
      }`}
    />
    <button
      onClick={handleSearch}
      className="ml-2 text-white p-2 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2"
    >
              <img src={search} alt="Search" className="w-5 h-5" />
            </button>
          </div>
          
          
          
          
          )}

          {user ? (
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
            >
              <span className="text-black text-lg font-medium cursor-pointer mr-4">
                {user.username}
              </span>
              {dropdownVisible && (
                <div className="absolute top-full right-0 bg-white shadow-md rounded-lg">
                  
                  <ul className="flex flex-col text-sm text-gray-800">
                  <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={handleHistory}
                    >
                      History
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="text-black text-lg font-medium cursor-pointer mr-4">Login</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

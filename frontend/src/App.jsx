import { Navbar, LogIn, CenterPage, Registration, ShowHistory, ProtectedRoutes } from "./components";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState(null); // Store the user data

  // Log the current user state whenever it changes
  useEffect(() => {
    console.log("Current user state:", user);
  }, [user]);

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LogIn setUser={setUser} />} />
        <Route path="/login" element={<LogIn setUser={setUser} />} />
        <Route path="/registration" element={<Registration />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes user={user} />}>
          <Route path="/main" element={<CenterPage/>} />
          <Route path="/history" element={<ShowHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

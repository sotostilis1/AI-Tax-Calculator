import React, { useState } from "react";
import api from "../api";

const CenterPage = () => {
  const [income, setIncome] = useState("");
  const [residency, setResidency] = useState(""); // For selected country
  const [taxClass, setTaxClass] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorField, setErrorField] = useState(""); // Field with error
  const [isResidencyValid, setIsResidencyValid] = useState(false); // Track residency validation

  
  const handleResidencyBlur = async () => {
    if (!residency.trim()) {
      setErrorField("residency");
      setIsResidencyValid(false);
      return;
    }

    setLoading(true);
    setErrorField("");

    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${residency.trim()}`);

      if (!response.ok) {
        if (response.status === 404) {
          setErrorField("residency");
          setIsResidencyValid(false); // Mark as invalid
          throw new Error("Country not found. Please check the name and try again.");
        } else {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      const countryName = data[0]?.name?.common;

      if (countryName) {
        setResidency(String(countryName));
        setIsResidencyValid(true);
      } else {
        setErrorField("residency");
        setIsResidencyValid(false);
        throw new Error("Country not found. Please check the name and try again.");
      }
    } catch (error) {
      console.error("Error fetching country:", error.message);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSubmit = async () => {
    // Validate inputs
    setErrorField("");
    if (loading || !isResidencyValid) {
      setErrorField("residency");
      return;
    }

    const parsedIncome = parseFloat(income);
    const sanitizedResidency = residency.trim();
    const sanitizedTaxClass = taxClass.trim();

    if (isNaN(parsedIncome) || parsedIncome <= 0) {
      setErrorField("income");
      return;
    }

    if (!sanitizedTaxClass) {
      setErrorField("taxClass");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/chat/create",
        { income: parsedIncome, residency: sanitizedResidency, tax_class: sanitizedTaxClass },
        { withCredentials: true }
      );
      setAiResponse(response.data);
    } catch (error) {
      console.error("Error calculating tax:", error);
      setAiResponse("Failed to calculate tax. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        {/* Explanation Text */}
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to the Tax Calculator!</h1>
        <p className="text-gray-600 text-center mb-8">
          With the help of AI, you can calculate your tax easily.
        </p>

        {/* Input Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 mb-6 mt-4 sm:mt-8">
          {/* Income Input */}
          <div className="w-64">
            <label htmlFor="income" className="block text-gray-700 font-semibold mb-2">
              Annual Income
            </label>
            <input
              id="income"
              type="text"
              value={income}
              onChange={(e) =>
                setIncome(e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"))
              }
              placeholder="Enter your annual income"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errorField === "income" ? "border-red-500 ring-red-500 placeholder-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>

          {/* Residency Input */}
          <div className="w-64 relative">
            <label htmlFor="residency" className="block text-gray-700 font-semibold mb-2">
              Residency
            </label>
            <input
              id="residency"
              type="text"
              value={residency}
              onChange={(e) => {
                setResidency(e.target.value);
                setErrorField("");
                setIsResidencyValid(false);
              }}
              onBlur={handleResidencyBlur}
              placeholder="Type your country"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errorField === "residency" ? "border-red-500 ring-red-500 placeholder-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>

          {/* Tax Classification Input */}
          <div className="w-64">
            <label htmlFor="taxClass" className="block text-gray-700 font-semibold mb-2">
              Tax Classification
            </label>
            <input
              id="taxClass"
              type="text"
              value={taxClass}
              onChange={(e) => setTaxClass(e.target.value)}
              placeholder="Enter your tax classification"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errorField === "taxClass" ? "border-red-500 ring-red-500 placeholder-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {loading ? "Calculating..." : "Submit"}
          </button>
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
            <h3 className="font-semibold text-gray-700 mb-2">AI Response:</h3>
            <p className="text-gray-800">{aiResponse}</p>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-sm text-gray-500 mt-6">
          Please note: Always consult a certified tax professional before making any tax payments
          or decisions. This tool is for informational purposes only.
        </p>
      </div>
    </div>
  );
};

export default CenterPage;

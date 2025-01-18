import React from "react";
import { useLocation } from "react-router-dom";

const ShowHistory = () => {
  const location = useLocation();
  const chatHistory = location.state?.chatHistory || []; // Get chat history from navigation state
  const username = location.state?.usernm || "Unknown User";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" my-16 w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Chat History of {username} </h1>

        {chatHistory.length === 0 ? (
          <p className="text-center text-gray-500">No chat history available.</p>
        ) : (
          <div className="space-y-4">
            {/* Display user's chats */}
            {chatHistory.map((chat, index) => (
              <div
                key={chat.id || index}
                className="p-4 border border-gray-300 rounded-lg shadow-sm"
              >
                <p className="text-lg font-semibold">Chat #{index + 1}</p>
                <p><strong>Income:</strong> {chat.income}</p>
                <p><strong>Residency:</strong> {chat.residency}</p>
                <p><strong>Tax Class:</strong> {chat.tax_class}</p>
                <p><strong>Response:</strong> {chat.response}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowHistory;

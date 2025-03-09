import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import ChatBackground from "../assets/ChatBackground.png";

function AiChat() {
    const { toggleSidebar } = useOutletContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const userMessage = { sender: "user", text: newMessage };
        setMessages((prev) => [...prev, userMessage]);
        setNewMessage("");

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/message/gemini`, {
                params: { question: newMessage }
            });

            const aiMessage = { sender: "ai", text: response.data.response };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error sending AI message:", error);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="w-full h-screen flex items-center bg-blue-400">
            <div
                className="w-full h-full flex flex-col bg-cover bg-center relative"
                style={{ backgroundImage: `url(${ChatBackground})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/60 to-blue-800/90 z-0"></div>

                {/* Header */}
                <div className="bg-white/90 backdrop-blur-md w-full h-14 flex-shrink-0 flex items-center px-6 shadow-lg sticky top-0 z-10">
                    <FaArrowLeft
                        className="mr-4 sm:hidden block cursor-pointer text-blue-500"
                        onClick={toggleSidebar}
                    />
                    <h2 className="text-xl font-bold text-gray-800">Chat with AI</h2>
                </div>

                {/* Messages Area */}
                <div className="flex-grow w-full overflow-y-auto px-6 py-4 flex flex-col space-y-4 z-10">
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex w-full ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-4 py-2 shadow-lg max-w-xs rounded-2xl transition-all duration-300 ${
                                        message.sender === "user"
                                            ? "bg-blue-600 text-white rounded-bl-none transform hover:scale-105"
                                            : "bg-gray-200 text-gray-800 rounded-br-none transform hover:scale-105"
                                    }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-300 text-center">No messages yet</p>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white/90 backdrop-blur-md w-full h-20 flex-shrink-0 flex items-center px-6 shadow-lg sticky bottom-0 z-10">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-grow border border-gray-300 rounded-full px-4 py-3 mr-4 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AiChat;

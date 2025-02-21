import React, { useEffect, useState, useRef } from "react";
import ChatBackground from "../assets/ChatBackground.png";
import { FaArrowLeft } from "react-icons/fa";
import { useOutletContext, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeMessagesByIds } from "../Features/Socket/SocketSlice";
import useFetchMessage from "../hooks/useFetchMessage";
import { sendMessage } from "../Services/api";
import { useSearchParams } from "react-router-dom";

function Chat() {
    const [searchParams] = useSearchParams();
    const { toggleSidebar } = useOutletContext();
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const { user } = useSelector((state) => state.auth);
    const { message: newMessages } = useSelector((state) => state.socket);
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (newMessages && newMessages.length > 0) {
            const filteredMessages = newMessages.filter(
                (msg) => msg.senderId === id || msg.receiverId === id
            );

            if (filteredMessages.length > 0) {
                setMessages((prev) => [...prev, ...filteredMessages]);
                const idsToRemove = filteredMessages.map((msg) => msg._id);
                dispatch(removeMessagesByIds(idsToRemove));
            }
        }
    }, [newMessages, id, dispatch]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useFetchMessage({ id, setMessages });
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    
    return (
        <div className="w-full h-screen flex items-center bg-blue-400">
            <div
                className="w-full h-full flex flex-col bg-cover bg-center relative"
                style={{ backgroundImage: `url(${ChatBackground})` }}
            >

                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/60 to-blue-800/90 z-0"></div>


                <div className="bg-white/90 backdrop-blur-md w-full h-14 flex-shrink-0 flex items-center px-6 shadow-lg sticky top-0 z-10">
                    <FaArrowLeft
                        className="mr-4 sm:hidden block cursor-pointer text-blue-500"
                        onClick={toggleSidebar}
                    />
                    <img src={searchParams.get("profilepic")} alt="" className="w-8 h-8 rounded-full mr-2" />
                    <h2 className="text-xl font-bold text-gray-800">{searchParams.get("name")}</h2>
                </div>


                <div className="flex-grow w-full overflow-y-auto px-6 py-4 flex flex-col space-y-4 z-10">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div
                                key={message._id}
                                className={`flex w-full ${message.senderId === user._id ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-4 py-2 shadow-lg max-w-xs rounded-2xl transition-all duration-300 ${message.senderId === user._id
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


                <div className="bg-white/90 backdrop-blur-md w-full h-20 flex-shrink-0 flex items-center px-6 shadow-lg sticky bottom-0 z-10">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-grow border border-gray-300 rounded-full px-4 py-3 mr-4 outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        onClick={() =>
                            sendMessage({ id, newMessage, setNewMessage, setMessages })
                        }
                        className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;

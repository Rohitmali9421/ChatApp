import React from "react";
import ChatBackground from "../assets/ChatBackground.png";

function Start() {
    return (
        <div className="w-full h-screen bg-blue-400 flex items-center justify-center">
            <div
                className="w-full h-full flex flex-col bg-cover bg-center relative"
                style={{ backgroundImage: `url(${ChatBackground})` }}
            >

                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/60 to-blue-800/90"></div>


                <div className="bg-white/80 backdrop-blur-md w-full h-14 flex items-center px-6 shadow-md sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-800">Start Conversation</h2>
                </div>


                <div className="flex flex-col items-center justify-center flex-grow text-white text-center z-10">
                    <h1 className="text-4xl font-extrabold mb-4">
                        Welcome to the Chat App
                    </h1>
                    <p className="text-lg mb-8">
                        Start a conversation and stay connected with your friends!
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Start;

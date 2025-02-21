import React, { useEffect, useState, useRef } from "react";
import UserList from "../Components/UserList";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { logoutUser } from "../Features/Auth/AuthSlice";

function Home() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [users, setUsers] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null); // Reference for dropdown menu
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const onlineUsers = useSelector((state) => state.socket.onlineUsers);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/user/users`,
                {
                    withCredentials: true, // Allows cookies to be sent
                }
            );

            setUsers(response.data);
            setFilteredUsers(response.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch users.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleLogout = async () => {
        dispatch(logoutUser());
        navigate("/");
    };

    // Search Functionality
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredUsers(users); // Reset to full list if search is empty
        } else {
            setFilteredUsers(
                users?.filter((user) =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, users]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="h-screen w-full flex">
            <div
                className={`bg-gray-50 shadow-lg h-screen sm:w-80 w-full sm:block ${isSidebarVisible ? "block" : "hidden"
                    }`}
            >
                <div className="flex items-center justify-between bg-white h-14 sticky top-0 px-4 shadow-md z-10">
                    <FaBars
                        onClick={toggleSidebar}
                        className="cursor-pointer sm:hidden text-gray-600 hover:text-gray-800 transition"
                    />
                    <div className="w-full flex items-center bg-gray-200 h-10 mx-2 rounded-full overflow-hidden">
                        <IoIosSearch className="text-xl text-gray-500 ml-3" />
                        <input
                            className="outline-none bg-transparent text-sm w-full px-2 placeholder-gray-500"
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative" ref={menuRef}>
                        <BsThreeDotsVertical
                            className="text-gray-600 hover:text-gray-800 transition cursor-pointer"
                            onClick={() => setMenuOpen((prev) => !prev)}
                        />
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-20">
                                <button
                                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200"
                                    onClick={() => navigate("/edit-profile")}
                                >
                                    Edit Profile
                                </button>
                                <button
                                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-[calc(100%-3.5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {loading && <p className="text-gray-500 text-center py-4">Loading users...</p>}
                    {error && <p className="text-red-500 text-center py-4">{error}</p>}
                    {filteredUsers &&
                        filteredUsers.map((user) => (
                            <Link
                                key={user._id}
                                to={`/home/chat/${user._id}?name=${user.name}&profilepic=${user.profilePic?.url}`}
                                onClick={() => setIsSidebarVisible(false)}
                            >
                                <UserList
                                    name={user.name}
                                    image={user.profilePic?.url || "default-profile-pic.png"}
                                    isOnline={onlineUsers.includes(user._id)}
                                />
                            </Link>
                        ))}
                    {filteredUsers?.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No users found.</p>
                    )}
                </div>
            </div>

            <div className={`h-screen w-full bg-gray-100 ${isSidebarVisible ? "hidden sm:block" : "block"}`}>
                <Outlet context={{ toggleSidebar }} />
            </div>
        </div>
    );
}

export default Home;

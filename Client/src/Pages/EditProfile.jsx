import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { update } from "../Features/Auth/AuthSlice";

function EditProfile() {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name: user?.name || "",
        profilePic: user?.profilePic?.url || "",
    });
    const [imagePreview, setImagePreview] = useState(user?.profilePic?.url || "");

    useEffect(() => {
        if (!user) {
            navigate("/"); // Redirect to home if not logged in
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, name: e.target.value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, profilePic: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = new FormData();
        updatedData.append("name", formData.name);
        if (formData.profilePic instanceof File) {
            updatedData.append("image", formData.profilePic);
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/edit`, updatedData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(response.data);

            dispatch(update(response.data))
            navigate("/home"); // Redirect after update
        } catch (error) {
            console.error("Profile update failed", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center">
                        <label className="cursor-pointer">
                            <img
                                src={imagePreview || "/default-profile-pic.png"}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border"
                            />
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                        <p className="text-sm text-gray-500">Click to change</p>
                    </div>

                    {/* Name Field */}
                    <div>
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;

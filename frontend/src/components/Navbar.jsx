import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faCog } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState([]);
    const [isSideBoxOpen, setIsSideBoxOpen] = useState(false); // Step 1

    useEffect(() => {
        const fetchAuthenticationStatus = async () => {
            try {
                const response = await axios.post("/api/v1/auth/status", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setIsAuthenticated(response.data.data.isAuthenticated);
            } catch (error) {
                console.log("Error fetching authentication status:", error);
            }
        };

        fetchAuthenticationStatus();
    }, []);

    useEffect(() => {
        axios.get("/api/v1/users/current-user")
            .then((result) => {
                setUser(result.data.data);
            }).catch((err) => {
                console.log("error while finding user in navbar ", err)
            });
    }, [isAuthenticated]); // Fix the dependency array

    const handleLogout = async () => {
        try {
            localStorage.removeItem('accessToken');
            const ress = await axios.post("/api/v1/users/logout");
            const response = await axios.post("/api/v1/auth/status");
            setIsAuthenticated(response.data.data.isAuthenticated);
        } catch (error) {
            console.error("Error in logging out user:", error);
        }
    };

    const toggleSideBox = () => {
        setIsSideBoxOpen(!isSideBoxOpen); // Step 2
    };

    return (
        <>
            <div className='text-white px-7 py-7 flex items-center justify-between'>
                <div className='flex items-center'>
                    <img src="https://cdn.create.vista.com/api/media/small/411025630/stock-vector-logo-design-white-letter-letter-logo-design-initial-letter-linked"
                        alt="Logo" className='h-28 rounded-full' />
                </div>
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <div className="flex gap-x-8">
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md focus:outline-none" style={{ height: '55px', marginTop: '10px' }}>
                                Logout
                            </button>
                            <div className="h-20 w-20" onClick={toggleSideBox}>
                                <img src={user.avatar} alt={user.fullName} className="h-full w-full rounded-full cursor-pointer" />
                            </div>
                            {isSideBoxOpen && (
                                <div className="absolute top-0 mt-36 sm:right-0 md:right-5 lg:right-10 xl:right-20 w-50 bg-white shadow-lg rounded-lg" style={{ zIndex: 100 }}>
                                    <div id="header" className="style-scope ytd-multi-page-menu-renderer bg-gray-900" style={{ color: 'white', padding: '10px', height: '250px', width: '250px', transform: 'scale(1.2)' }}>
                                        <div className="flex flex-row ml-4">
                                            <img src={user.avatar} alt={user.fullName} className="rounded-full cursor-pointer" style={{ height: '40px', width: '40px' }} />
                                            <div id="channel-container" className="ml-3">
                                                <p className="mb-1">{user.fullName}</p>
                                                <p className="mb-1">{`@${user.username}`}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 ml-6">
                                            <div className="mb-4">
                                                <Link to="/user-channel" className="text-gray-100">
                                                    <FontAwesomeIcon icon={faEye} className="mr-2" /> View your channel
                                                </Link>
                                            </div>

                                            <div className="mb-4">
                                                <Link to="/EditPersonalInfo" className="text-gray-100">
                                                    <FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit Profile
                                                </Link>
                                            </div>

                                            <div className="mb-4">
                                                <Link to="/EditChannelInfo" className="text-gray-100">
                                                    <FontAwesomeIcon icon={faCog} className="mr-2" /> Edit Channel Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to='/login' className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md focus:outline-none">
                                Login
                            </Link>
                            <Link to='/register' className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md focus:outline-none">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Navbar;

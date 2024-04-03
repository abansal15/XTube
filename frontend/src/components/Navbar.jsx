import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState([]);

    useEffect(() => {
        const fetchAuthenticationStatus = async () => {
            try {
                // Fetch authentication status from the backend
                const response = await axios.get("/api/v1/auth/status", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                console.log("res status  ", response)
                setIsAuthenticated(response.data.data.isAuthenticated);
            } catch (error) {
                console.error("Error fetching authentication status:", error);
            }
        };

        fetchAuthenticationStatus();
    }, []);


    // if (isAuthenticated) 
    // {
    useEffect(() => {

        axios.get("/api/v1/users/current-user")
            .then((result) => {
                setUser(result.data.data);
                console.log("user detais are : ", result.data.data)
            }).catch((err) => {
                console.log("error while finding user in navbar ", err)
            });

    }, isAuthenticated)
    // }


    const handlelogout = async () => {
        try {
            // Remove access token from local storage
            localStorage.removeItem('accessToken');

            const ress = await axios.post("/api/v1/users/logout")
            console.log("res status after logout : ", ress)

            // Fetch authentication status after removing access token
            const response = await axios.get("/api/v1/auth/status");
            setIsAuthenticated(response.data.data.isAuthenticated);
            console.log("auth status is", response.data.data.isAuthenticated);
        } catch (error) {
            console.error("Error in logging out user:", error);
        }
    };

    console.log("auth status is  ", isAuthenticated)

    return (
        <>
            {/* Header Section */}
            <div className='text-white px-7 py-7 flex items-center justify-between'>
                <div className='flex items-center'>
                    <img src="https://cdn.create.vista.com/api/media/small/411025630/stock-vector-logo-design-white-letter-letter-logo-design-initial-letter-linked"
                        alt="Logo" className='h-28 rounded-full' />
                    <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'red', alignItems: 'center', marginLeft: isAuthenticated ? '10%' : '250%' }}>
                        <input
                            type="text"
                            placeholder="Search"
                            className="px-4 py-2 rounded-md focus:outline-none"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {/* If authenticated, display logout button, otherwise display login and signup links */}
                    {isAuthenticated ? (
                        <div className="flex gap-x-8">

                            <button onClick={handlelogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md focus:outline-none" style={{ height: '55px', marginTop: '10px' }}>
                                Logout
                            </button>

                            <div className="h-20 w-20">
                                <img src={user.avatar} alt={user.fullName} className="h-full w-full rounded-full cursor-pointer" />
                            </div>

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

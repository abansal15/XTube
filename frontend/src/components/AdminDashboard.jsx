import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

function AdminDashboard() {

    const [user, setUser] = useState([]);
    const [stats,setStats] = useState([]);

    useEffect(() => {

        axios.get("/api/v1/users/current-user")
            .then((result) => {
                setUser(result.data.data);
                console.log("user detais are : ", result.data.data)
            }).catch((err) => {
                console.log("error while finding user in navbar ", err)
            });

    }, [])

    useEffect(() => {

        axios.get("/api/v1/dashboard/stats")
        .then((result) => {
            console.log("dashboard stats are : ", result.data.data)
        }).catch((err) => {
            
            console.log("error while finding dashboard stats : ", err)
        });

    }, [])

    return (
        <>
            <Navbar />

            <div style={{marginLeft:'2%', marginRight:'2%'}}>
                <div className="mb-12">
                    <h1>Welcome Back, {user.fullName}</h1>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-9">
                    <div className="border p-4">
                        <div className="mb-4 block">
                            <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path>
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </span>
                        </div>
                        <h6 className="text-gray-300">Total views</h6>
                        <p className="text-3xl font-semibold">221,234</p>
                    </div>
                    <div className="border p-4">
                        <div className="mb-4 block">
                            <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>
                                </svg>
                            </span>
                        </div>
                        <h6 className="text-gray-300">Total subscribers</h6>
                        <p className="text-3xl font-semibold">4,053</p>
                    </div>
                    <div className="border p-4">
                        <div className="mb-4 block">
                            <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path>
                                </svg>
                            </span>
                        </div>
                        <h6 className="text-gray-300">Total likes</h6>
                        <p className="text-3xl font-semibold">63,021</p>
                    </div>
                </div>

            </div>
        </>
    )
}

export default AdminDashboard
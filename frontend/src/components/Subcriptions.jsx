import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

function Subcriptions() {
    const [collapsed, setCollapsed] = useState(true);
    const [Subcriptions, setSubcriptions] = useState([]);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        axios.get("/api/v1/subscriptions/u")
            .then((result) => {
                // console.log("Subcription channel are ", result.data.data);
                setSubcriptions(result.data.data);
            }).catch((err) => {
                console.log("Error while getting subcripton channels ", err);
            });
    }, []);

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />

            <div className='md:hidden block' style={{ marginLeft: '8%', width: '500%', height: '200px', background: 'linear-gradient(to right, #2d2d2d, #444444)' }}>
                <div className='mt-9 ml-10'>
                    <h2 style={{ fontSize: '2.2rem' }}>Subcriptions </h2>
                </div>
                <div className='mt-8 ml-10'>
                    {/* {Subcriptions[0]?.OwnerDetails[0]?.fullName} */}
                    <h4 className=''>{Subcriptions?.length} channels</h4>
                </div>
            </div>

            <div className='flex'>
                <div className='sidebar ml-7 mt-5'>
                    <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
                </div>

                <div className='flex flex-row'>

                    <div className='md:block hidden' style={{ height: '100%', width: '400px', background: 'linear-gradient(to right, #1a1a1a, #333)' }}>
                        <div className='mt-9 ml-10'>
                            <h2 style={{ fontSize: '2.2rem' }}>Subcriptions </h2>
                        </div>
                        <div className='mt-8 ml-10'>
                            {/* {Subcriptions[0]?.OwnerDetails[0]?.fullName} */}
                            <h4 className=''>{Subcriptions?.length || 0} channels</h4>
                        </div>
                    </div>

                    <div className='ml-14' style={{ width: '400px' }}>
                        {/* Content */}

                        {Subcriptions.length === 0 ? (
                            <div className="flex justify-center p-4 mt-11">
                                <div className="w-full max-w-sm text-center">
                                    <p className="mb-3 w-full">
                                        <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path>
                                            </svg>
                                        </span>
                                    </p>
                                    <h5 className="mb-2 font-semibold">No Subcriptions</h5>
                                    {/* <p>This page has yet to upload a video. Search another page in order to find more Subcriptions.</p> */}
                                </div>
                            </div>
                        ) : (
                            <div className='mt-14'>

                                <div className='mainsection flex flex-wrap flex-col gap-3' style={{ marginLeft: '5%', display: 'flex', flexWrap: 'wrap', gap: '20px', zoom: '1.2' }}>
                                    {/* Mapping over Subcriptions array to render video cards */}
                                    {Subcriptions.map((sub) => (
                                        <div className='flex flex-wrap flex-col gap-3'>

                                            <div key={sub._id} className="flex gap-3 border-b border-gray-700 py-4 last:border-b-transparent">
                                                <div className="h-14 w-14 shrink-0">
                                                    <img src={sub.userDetails.avatar} alt={sub.userDetails.fullName} className="h-full w-full rounded-full" />
                                                </div>
                                                <div className="w-full">

                                                    <h4 className="mb-1 flex items-center gap-x-2">
                                                        <Link to={`/@${sub.userDetails.username}`}>
                                                            <span className="font-semibold text-gray-300">{sub.userDetails.fullName}</span>
                                                        </Link>

                                                    </h4>
                                                    <p className="text-sm text-gray-400">@{sub.userDetails.username}</p>
                                                </div>

                                            </div>

                                        </div>

                                    ))}
                                </div>

                            </div>
                        )}


                    </div>

                </div>
            </div>
        </div>
    );
}

export default Subcriptions;

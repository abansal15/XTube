import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function WatchHistory() {
    const [collapsed, setCollapsed] = useState(true);
    const [WatchHistory, setWatchHistory] = useState([]);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        axios.get("/api/v1/users/history")
            .then((result) => {
                // console.log("Watch history Videos are ", result.data.data);
                setWatchHistory(result.data.data);
            }).catch((err) => {
                console.log("Error while getting liked videos", err);
            });
    }, []);

    function formatDuration(duration) {
        if (duration > 3600) {
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            return `${hours}h ${minutes}m`;
        } else if (duration > 60) {
            const minutes = Math.floor(duration / 60);
            return `${minutes}m`;
        } else {
            return `${duration}s`;
        }
    }

    function formatCreatedAt(created) {
        const currentTime = new Date();
        const createdAt = new Date(created);
        const elapsed = currentTime - createdAt;
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        const msPerMonth = msPerDay * 30;
        const msPerYear = msPerMonth * 12;

        if (elapsed < msPerMinute) {
            return (Math.round(elapsed / 1000) + ' seconds ago');
        } else if (elapsed < msPerHour) {
            return (Math.round(elapsed / msPerMinute) + ' minutes ago');
        } else if (elapsed < msPerDay) {
            return (Math.round(elapsed / msPerHour) + ' hours ago');
        } else if (elapsed < msPerMonth) {
            return (Math.round(elapsed / msPerDay) + ' days ago');
        } else if (elapsed < msPerYear) {
            return (Math.round(elapsed / msPerMonth) + ' month ago');
        } else {
            return (Math.round(elapsed / msPerYear) + ' year ago');
        }
    }

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />

            <div className='md:hidden block' style={{ marginLeft: '8%', width: '500%', height: '200px', background: 'linear-gradient(to right, #1a1a1a, #333)' }}>
                <div className='mt-9 ml-10'>
                    <h2 style={{ fontSize: '2.2rem' }}>Watch History</h2>
                </div>
                <div className='mt-8 ml-10'>
                    {/* {WatchHistory[0]?.OwnerDetails[0]?.fullName} */}
                    <h4 className=''>{WatchHistory?.length} videos</h4>
                </div>
            </div>

            <div className='flex'>
                <div className='sidebar ml-7 mt-5'>
                    <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
                </div>

                <div className='flex flex-row'>

                    <div className='md:block hidden' style={{ height: '100%', width: '500px', background: 'linear-gradient(to right, #2d2d2d, #444444)' }}>
                        <div className='mt-9 ml-10'>
                            <h2 style={{ fontSize: '2.2rem' }}>Watch History</h2>
                        </div>
                        <div className='mt-8 ml-10'>
                            {/* {WatchHistory[0]?.OwnerDetails[0]?.fullName} */}
                            <h4 className=''>{WatchHistory?.length || 0} videos</h4>
                        </div>
                    </div>

                    <div className='md:w-full'>

                        {WatchHistory.length === 0 ? (
                            <div className="flex justify-center p-4 mt-11">
                                <div className="w-full max-w-sm text-center">
                                    <p className="mb-3 w-full">
                                        <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path>
                                            </svg>
                                        </span>
                                    </p>
                                    <h5 className="mb-2 font-semibold">No Videos</h5>
                                    {/* <p>This page has yet to upload a video. Search another page in order to find more Subcriptions.</p> */}
                                </div>
                            </div>
                        ) : (

                            <div className='mt-8 ml-10'>
                                {WatchHistory.map((video, index) => (
                                    <div key={index} className="w-full max-w-3xl gap-x-4 md:flex mb-12">
                                        <div className="relative mb-2 w-full md:mb-0 md:w-7/12">
                                            <div className="w-full" style={{ width: '35rem', height: '220px' }}>
                                                <div className="absolute inset-0 w-100">
                                                    <img src={video.thumbnail} alt={video.title} className="h-full w-full" />
                                                </div>
                                                <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">{formatDuration(video.duration)}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-x-2 md:w-7/12">
                                            <div className="h-10 w-10 shrink-0 md:hidden">
                                                <img src={video.owner.avatar} alt={video.owner.fullName} className="h-full w-full rounded-full" />
                                            </div>
                                            <div className="w-full">
                                                <h6 className="mb-1 font-semibold md:max-w-[75%]">{video.title}</h6>
                                                <p className="flex text-sm text-gray-200 sm:mt-3">{video.views} Views · {formatCreatedAt(video.createdAt)}</p>
                                                <div className="flex items-center gap-x-4">
                                                    <div className="mt-4 hidden h-10 w-10 shrink-0 md:block">
                                                        <img src={video.owner.avatar} alt={video.owner.fullName} className="h-full w-full rounded-full" />
                                                    </div>
                                                    <p className="mt-4 text-sm text-gray-200">{video.owner.fullName}</p>
                                                </div>
                                                <p className="mt-4 hidden text-sm md:block">{video.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default WatchHistory;

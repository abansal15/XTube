import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get('/api/v1/')
            .then((response) => {
                console.log(response.data.data);
                setVideos(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            {/* Header Section */}
            <div className='text-white px-7 py-7 flex items-center justify-between'>
                <div className='flex items-center'>
                    <img src="https://cdn.create.vista.com/api/media/small/411025630/stock-vector-logo-design-white-letter-letter-logo-design-initial-letter-linked"
                        alt="Logo" className='h-28 rounded-full' />
                    <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'red', alignItems: 'center', marginLeft: '250%' }}>
                        <input
                            type="text"
                            placeholder="Search"
                            className="px-4 py-2 rounded-md focus:outline-none"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md focus:outline-none">
                        Login
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md focus:outline-none">
                        Sign Up
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex' }}>
                {/* Sidebar Section */}
                <div className='sidebar'>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginLeft: '50px', marginTop: '20px' }}>
                        <a href="#" className='text-white mr-4'>Home</a>
                        <a href="#" className='text-white mr-4'>Liked Videos</a>
                        <a href="#" className='text-white mr-4'>History</a>
                        <a href="#" className='text-white'>My content</a>
                        <a href="#" className='text-white mr-4'>Collections</a>
                        <a href="#" className='text-white'>Subscribers</a>
                    </nav>
                </div>

                {/* Main Content Section */}
                <div className='mainsection' style={{ marginLeft: '5%', display: 'flex', flexWrap: 'wrap', gap: '20px', zoom: '1.2' }}>
                    {/* Mapping over videos array to render video cards */}
                    {videos.map((video) => (
                        <div key={video.id} className="w-full max-w-xl">

                            <Link to={`/playing/${encodeURIComponent(video.videoFile)}`}> {/* Pass the videoFile URL as parameter */}
                                <div className="relative mb-2 w-full pt-[56%]">
                                    <div className="absolute inset-0">
                                        <img src={video.thumbnail} alt={video.title} className="h-full w-full" />
                                    </div>
                                    <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">{video.duration} mins</span>
                                </div>
                            </Link>

                            <div className="flex gap-x-2">
                                <div className="h-10 w-10 shrink-0">
                                    <img src={video.ownerDetails[0].avatar} alt={video.ownerDetails[0].fullName} className="h-full w-full rounded-full" />
                                </div>
                                <div className="w-full">
                                    <h6 className="mb-1 font-semibold">{video.title}</h6>
                                    <p className="flex text-sm text-gray-200">{video.views} Views · {video.duration} mins ago</p>
                                    <p className="text-sm text-gray-200">{video.ownerDetails[0].fullName}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Home;

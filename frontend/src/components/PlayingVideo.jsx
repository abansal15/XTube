import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import DisplayAllVideo from './DisplayAllVideo';

function PlayingVideo() {
    const { value } = useParams();
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get('/api/v1/')
            .then((response) => {
                // console.log(response.data.data);
                setVideos(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const video = videos.find(video => video.videoFile === value);

    console.log("video playing is : ", video)

    if (!video) {
        return <div>No video found.</div>;
    }

    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', width: '100%' }}>

                {/* Sidebar on the left */}
                <div className='sidebar' style={{ marginRight: '10%', marginLeft: '4rem' }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '20px' }}>
                        <a href="#" className='text-white mr-4'>Home</a>
                        <a href="#" className='text-white mr-4'>Liked Videos</a>
                        <a href="#" className='text-white mr-4'>History</a>
                        <a href="#" className='text-white'>My content</a>
                        <a href="#" className='text-white mr-4'>Collections</a>
                        <a href="#" className='text-white'>Subscribers</a>
                    </nav>
                </div>

                {/* Main video in the center */}
                <div style={{ maxWidth: '70%', width: '50%', display: 'flex', flexDirection: 'column' }}>
                    <iframe title="video-player" width="110%" height="106%" src={video.videoFile} frameborder="0" allowfullscreen></iframe>
                    <div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-x-4">
                                <div className="mt-2 h-12 w-12 shrink-0">
                                    <img
                                        src={video.ownerDetails[0].avatar}
                                        alt={video.ownerDetails[0].fullName}
                                        className="h-full w-full rounded-full"
                                    />
                                </div>

                                <div className="block">
                                    <p className="text-gray-200">{video.ownerDetails[0].fullName}</p>
                                    <p className="text-sm text-gray-400">{video.subcriptions} Subscribers</p>
                                </div>

                            </div>

                            {/* Subscribe Button */}
                            <div className="h-5 overflow-hidden group-focus:h-auto">
                                {/* <p>likes :</p> */}
                                <p className="text-sm">likes: {video.likes}</p>
                            </div>

                            {/* ADD TO PLAYLIST BUTTON ALSO TO ADD */}

                        </div>
                        {/* Description */}
                        <hr className="my-4 border-white" />
                        <div className="h-5 overflow-hidden group-focus:h-auto">
                            <p className="text-sm">{video.description}</p>
                        </div>

                        {/* comments */}

                        {/* <div>
                            <p>{video.commentDetails.length} comments</p>
                            <div>
                                


                            </div>
                        </div> */}


                    </div>
                </div>

                {/* Suggested videos on the right */}
                <div className='suggested-videos' style={{ marginLeft: '10%', marginRight: '0rem', width: '20%' }}>
                    <DisplayAllVideo />
                </div>
            </div>
        </>
    );
}

export default PlayingVideo;

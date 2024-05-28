import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function DisplayAllVideo() {
    const [videos, setVideos] = useState([]);


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

    return (
        <>
            {/* Main Content Section */}
            <div className='mainsection' style={{ marginLeft: '5%', display: 'flex', flexWrap: 'wrap', gap: '20px', zoom: '1.2' }}>
                {/* Mapping over videos array to render video cards */}
                {videos.map((video) => (
                    <div key={video.id} className="w-full max-w-xl">

                        <a href={`/playing/${encodeURIComponent(video.videoFile)}`}> {/* Pass the videoFile URL as parameter */}
                            <div className="relative mb-2 w-full pt-[56%]">
                                <div className="absolute inset-0">
                                    <img src={video.thumbnail} alt={video.title} className="h-full w-full" />
                                </div>
                                <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">{formatDuration(video.duration)}</span>
                            </div>
                        </a>

                        <div className="flex gap-x-2">
                            <div className="h-10 w-10 shrink-0">
                                <img src={video.ownerDetails[0].avatar} alt={video.ownerDetails[0].fullName} className="h-full w-full rounded-full" />
                            </div>
                            <div className="w-full">
                                <h6 className="mb-1 font-semibold">{video.title}</h6>
                                <p className="flex text-sm text-gray-200">{video.views} Views · {formatCreatedAt(video.createdAt)}</p>
                                <p className="text-sm text-gray-200">{video.ownerDetails[0].fullName}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default DisplayAllVideo;

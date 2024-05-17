import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import DisplayAllVideo from './DisplayAllVideo';
import { Link } from 'react-router-dom';



function Comment({ comment }) {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        const currentTime = new Date();
        const createdAt = new Date(comment.createdAt);
        const elapsed = currentTime - createdAt;
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;

        if (elapsed < msPerMinute) {
            setTimeAgo(Math.round(elapsed / 1000) + ' seconds ago');
        } else if (elapsed < msPerHour) {
            setTimeAgo(Math.round(elapsed / msPerMinute) + ' minutes ago');
        } else if (elapsed < msPerDay) {
            setTimeAgo(Math.round(elapsed / msPerHour) + ' hours ago');
        } else {
            setTimeAgo(Math.round(elapsed / msPerDay) + ' days ago');
        }
    }, [comment.createdAt]);

    return (
        <div key={comment._id} className="flex gap-x-4 comment">
            <div className="mt-2 h-11 w-11 shrink-0">
                <img src={comment.owner.avatar} alt={comment.owner.fullName} className="h-full w-full rounded-full" />
            </div>
            <div className="block">
                <p className="flex items-center text-gray-200">
                    {comment.owner.fullName} · <span className="text-sm">{timeAgo}</span>
                </p>
                <p className="text-sm text-gray-200">@{comment.owner.username}</p>
                <p className="mt-3 text-sm">{comment.content}</p>
            </div>
        </div>
    );
}

function PlayingVideo() {
    const { value } = useParams();
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        axios.get('/api/v1/')
            .then((response) => {
                // console.log(response.data.data);
                const videoData = response.data.data.find(video => video.videoFile === value);
                if (videoData) {
                    console.log("video details are : ", videoData);
                    setVideo(videoData);
                } else {
                    console.log("Video not found");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [value]);

    useEffect(() => {
        if (video) {
            axios.get(`/api/v1/comments/${video._id}`)
                .then((result) => {
                    setComments(result.data.data);
                    console.log("comment data is : ", result.data.data)
                }).catch((err) => {
                    console.log("getting comments error in PlayingVideo : ", err)
                });
        }
    }, [video]);

    // console.log("videoid iss: ", video._id);
    // console.log("comments fetched is : ", comments.data)

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
                    <iframe title="video-player" width="110%" height="106%" src={video.videoFile} frameborder="0" allowFullScreen></iframe>
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

                                    <Link to={`/@${video.ownerDetails[0].username}`}>
                                        <p className="text-gray-200">{video.ownerDetails[0].fullName}</p>
                                    </Link>

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
                        <hr className="my-4 border-white mb-6" />

                        <div className="h-5 mb-6 overflow-hidden group-focus:h-auto">
                            <p className="text-sm">{video.description}</p>
                        </div>

                        <div>
                            {comments.length > 0 ? (
                                <>
                                    {comments.length > 1 ?
                                        (<p className='mb-5'>{comments.length} comments</p>)
                                        : (<p className='mb-5'>{comments.length} comment</p>)
                                    }

                                    {comments.map((comment) => (
                                        <Comment key={comment._id} comment={comment} />
                                    ))}
                                </>
                            )
                                : (
                                    <p>No comments</p>
                                )}
                        </div>



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

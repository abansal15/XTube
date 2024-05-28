import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import DisplayAllVideo from './DisplayAllVideo';
import { Link } from 'react-router-dom';
import LikeDislikeButton from './LikeDislikeButton';
import Sidebar from './Sidebar';


function Comment({ comment }) {
    const [timeAgo, setTimeAgo] = useState('');
    const [user, setUser] = useState([]);
  

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

    useEffect(() => {
        axios.get('/api/v1/users/current-user')
            .then((result) => {
                setUser(result.data.data);
            }).catch((err) => {
                console.log("error while getting user in comment ", err);
            });
    }, [user])

    const deleteComment = () => {
        axios.delete(`/api/v1/comments/c/${comment._id}`)
            .then((result) => {
                window.location.reload();
            }).catch((err) => {
                console.log("erro while deleting the comment ", err);
            });
    }

    return (
        <div key={comment._id} className="flex gap-x-4 comment mb-4">

            <div className="mt-2 h-11 w-11 shrink-0">
                <img src={comment.owner.avatar} alt={comment.owner.fullName} className="h-full w-full rounded-full" />
            </div>

            <div className="block">
                <Link to={`/@${comment.owner.username}`}>
                    <p className="flex items-center text-gray-200">
                        {comment.owner.fullName} · <span className="text-sm">{timeAgo}</span>
                    </p>
                </Link>
                <p className="text-sm text-gray-200">@{comment.owner.username}</p>
                <p className="mt-3 text-sm">{comment.content}</p>
            </div>


            {comment.owner._id === user._id && <img onClick={deleteComment} src="https://cdn.dribbble.com/users/2124240/screenshots/6118828/delete_icon_intraction.gif" alt="Delete" className="h-8 w-8 cursor-pointer" />}

        </div>
    );
}

function PlayingVideo() {
    const { value } = useParams();
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [timeAgo, setTimeAgo] = useState('');
    const [addComm, setAddComm] = useState([]);
    const [newComm, setNewComm] = useState([]);
    const [error, setError] = useState('');
    const [totalVideoLikes, setTotalVideoLikes] = useState(0);
    const [subVal, setSubVal] = useState('Subscribe');
    const [commCheck, setCommCheck] = useState(0);
    const [collapsed, setCollapsed] = useState(true);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };


    useEffect(() => {
        axios.get('/api/v1/')
            .then((response) => {
                // console.log(response.data.data);
                const videoData = response.data.data.find(video => video.videoFile === value);
                if (videoData) {
                    // console.log("video details are : ", videoData);
                    setVideo(videoData);
                } else {
                    console.log("Video not found");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [subVal]);

    useEffect(() => {
        if (video) {
            axios.get(`/api/v1/comments/${video._id}`)
                .then((result) => {
                    setComments(result.data.data);
                    setCommCheck(commCheck + 1);
                    // console.log("comment data is : ", result.data.data)
                }).catch((err) => {
                    console.log("getting comments error in PlayingVideo : ", err)
                });
        }
    }, [video, newComm]);

    useEffect(() => {
        if (video) {
            axios.get(`/api/v1/likes/totalLike/${video._id}`)
                .then((result) => {
                    setTotalVideoLikes(result.data.data);
                    // console.log("Total video like data is : ", result.data.data);
                }).catch((err) => {
                    console.log("Error While getting the total video like, ", err);
                });
        }
    }, [video])

    useEffect(() => {
        if (video) {
            axios.get(`/api/v1/subscriptions/checkIsSubscribed/${video.ownerDetails[0]._id}`)
                .then((result) => {
                    // console.log("Is subscribed result: ", result.data);
                    if (result.data.data) {
                        setSubVal('Subscribed');
                    }
                    else setSubVal('Subscribe')
                }).catch((err) => {
                    console.log("Error while checking if the video is subscribed or not", err);
                });
        }
    }, [video, subVal])

    useEffect(() => {
        const currentTime = new Date();
        const createdAt = new Date(video?.createdAt);
        const elapsed = currentTime - createdAt;
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        const msPerMonth = msPerDay * 30;
        const msPerYear = msPerMonth * 12;

        // console.log("Elapsed time is ", elapsed);

        if (elapsed < msPerMinute) {
            setTimeAgo(Math.round(elapsed / 1000) + ' seconds ago');
        } else if (elapsed < msPerHour) {
            setTimeAgo(Math.round(elapsed / msPerMinute) + ' minutes ago');
        } else if (elapsed < msPerDay) {
            setTimeAgo(Math.round(elapsed / msPerHour) + ' hours ago');
        } else if (elapsed < msPerMonth) {
            setTimeAgo(Math.round(elapsed / msPerDay) + ' days ago');
        }
        else if (elapsed < msPerYear)
            setTimeAgo(Math.round(elapsed / msPerMonth) + ' month ago');
        else
            setTimeAgo(Math.round(elapsed / msPerYear) + ' year ago');

        // console.log("video times ago is ", timeAgo);

    }, [video]);

    useEffect(() => {
        if (video) {
            // console.log("jjkjkfjfkjfkjfk");
            axios.post(`/api/v1/users/addToHistory/${video._id}`)
                .then((result) => {
                    // console.log("Watch history and view result is ", result.data);
                    // console.log("view count is ", video.views);
                }).catch((err) => {
                    console.log("Error while adding the video to watch history ", err);
                })
        }
    }, [video])

    if (!video) {
        return <div>No video found.</div>;
    }

    const uploadComment = () => {
        if (!addComm) {
            setError('Content is required')
            return;
        }

        // console.log("commment is ", addComm);

        axios.post(`/api/v1/comments/${video._id}`, { addComm })
            .then((result) => {
                setNewComm(result.data.data);
                // console.log("new comment is ", result.data.data);
                setNewComm('');
                setAddComm('');
            }).catch((err) => {
                console.log("Error while uploading the comment ", err)
            });

    }

    const toggleSubscribe = () => {
        // console.log("hhhhhhhhhhh");
        axios.post(`/api/v1/subscriptions/c/${video.ownerDetails[0]._id}`)
            .then((result) => {
                // console.log("subscription toggled succ ", result.data);
                if (result.data.data) {
                    setSubVal('Subscribed');
                }
                else setSubVal('Subscribe')
            }).catch((err) => {
                console.log("Error while toggling+ the subscription", err);
            });
    }


    return (
        <>
            <Navbar toggleSidebar={toggleSidebar} />

            <div style={{ display: 'flex', width: '100%' }}>

                {/* Sidebar on the left */}
                <div className='sidebar' style={{ marginRight: '10%', marginLeft: '4rem' }}>
                    <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
                </div>

                {/* Main video in the center */}
                <div style={{ maxWidth: '70%', width: '50%', display: 'flex', flexDirection: 'column' }}>
                    <iframe title="video-player" width="110%" height="34%" src={video.videoFile} frameborder="0" allowFullScreen></iframe>
                    <div>
                        <div className='flex wrap gap-4 justify-between'>

                            <div className='flex flex-col wrap'>
                                <div className='mt-4 font-bold'>
                                    <h2>{video.title}</h2>
                                </div>
                                <div>
                                    <span>{video.views} views  ·  </span>
                                    <span> {timeAgo}</span>
                                </div>
                            </div>

                            <div className='mt-4'>
                                {/* Like Dislike Button */}

                                <LikeDislikeButton video={video} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">

                            <div className="flex items-center gap-x-4">

                                <div className="h-12 w-12 shrink-0">
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

                            <div className="block flex justify-end mt-2">
                                <button onClick={toggleSubscribe} className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
                                    <span className="inline-block w-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"></path>
                                        </svg>
                                    </span>
                                    <span className="group-focus">{subVal}</span>
                                    {/* <span className="hidden group-focus/btn:block">Subscribed</span> */}
                                </button>
                            </div>





                            {/* ADD TO PLAYLIST BUTTON ALSO TO ADD */}

                        </div>


                        {/* Description */}
                        <hr className="my-4 border-white mb-6" />

                        <div className="h-5 mb-6 overflow-hidden group-focus:h-auto">
                            <p className="text-sm">{video.description}</p>
                        </div>

                        {error && <div className='bg-red'>{error}</div>}

                        <div className="mt-2 mb-4 border pb-2">

                            <input
                                type="text"
                                value={addComm}
                                onChange={(e) => setAddComm(e.target.value)}
                                placeholder="Write a comment"
                                className="mb-2 h-10 w-full resize-none border-none bg-transparent px-3 pt-2 outline-none"
                            />

                            <div className="flex items-center justify-end gap-x-3 px-3">
                                <button className="inline-block h-5 w-5 hover:text-[#ae7aff]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                                    </svg>
                                </button>
                                <button className="inline-block h-5 w-5 hover:text-[#ae7aff]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                    </svg>
                                </button>
                                <button onClick={uploadComment} className="bg-[#ae7aff] px-3 py-2 font-semibold text-black">Send</button>
                            </div>
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

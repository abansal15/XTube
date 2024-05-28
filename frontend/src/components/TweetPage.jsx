import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

function TweetPage() {
    const [user, setUser] = useState([]);
    const [authUser, setAuthUser] = useState([]);
    const [tweets, setTweet] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [subscribedTo, setSubscribedTo] = useState([]);
    const [content, setContent] = useState([]);
    const [newTweet, setNewTweet] = useState([]);
    const [collapsed, setCollapsed] = useState(true);

    let { username, userId } = useParams();
    username = username.substr(1);

    // console.log("username in tweet page is  is : ", username);
    // console.log("userId in tweet page is : ", userId);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        axios.get(`/api/v1/users/c/${username}`)
            .then((result) => {
                setUser(result.data.data);
                // console.log("user TweetPage details are: ", result.data.data);
            })
            .catch((err) => {
                console.log("error while finding user in TweetPage component ", err);
            });
    }, []);

    useEffect(() => {
        const fetchTweets = async () => {
            // console.log("hi");
            try {
                if (user._id) {
                    const TweetResponse = await axios.get(`/api/v1/tweets/user/${userId}`);
                    setTweet(TweetResponse.data.data);

                    // console.log("Tweet details are:", TweetResponse.data.data);
                }
            } catch (error) {
                console.log("Error while finding Tweets:", error);
            }
        };

        fetchTweets();
    }, [user._id, newTweet]);

    useEffect(() => {
        axios.get("/api/v1/users/current-user")
            .then((result) => {
                setAuthUser(result.data.data);
                // console.log("auth user details are: ", result.data.data);
            })
            .catch((err) => {
                console.log("error while finding auth user in playlist page ", err);
            });
    }, []);

    useEffect(() => {
        axios.get(`/api/v1/subscriptions/c/${userId}`)
            .then((result) => {
                setSubscribers(result.data.data);
                // console.log("Subscribers details are: ", result.data.data);
            })
            .catch((err) => {
                console.log("error while finding subscribers in user channel ", err);
            });
    }, []);

    useEffect(() => {
        axios.get(`/api/v1/subscriptions/u/${userId}`)
            .then((result) => {
                setSubscribedTo(result.data.data);
                // console.log("Subscribed TO details are: ", result.data.data);
            })
            .catch((err) => {
                console.log("error while finding the subscribed to in user channel ", err);
            });
    }, []);

    const uploadTweet = () => {
        if (!content) {
            console.log("Content is required.");
            return;
        }

        // console.log("content is ", content);

        const formData = new FormData();
        formData.append('content', content);

        axios.post(`/api/v1/tweets/${userId}`, { content })
            .then((result) => {

                setNewTweet(result.data);
                // console.log("New Tweet is : ", result.data);
                setNewTweet([])

                setContent('');

            }).catch((err) => {
                console.log("Error while uploading the tweet", err)
            });

    }

    return (
        <div>
            {/* User channel */}
            <Navbar toggleSidebar={toggleSidebar} />
            {/* Sidebar */}
            <div className='sidebar' style={{ display: 'flex', flexDirection: 'row', gap: '80px', marginLeft: '20px', marginTop: '20px', marginRight: '100px' }}>
            <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />


                <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
                    <div className="relative min-h-[150px] w-full pt-[16.28%]">
                        <div className="absolute inset-0 overflow-hidden">
                            <img src={user.coverImage} alt="cover-photo" />
                        </div>
                    </div>
                    <div className="px-4 pb-4">
                        <div className="flex flex-wrap gap-4 pb-4 pt-6">
                            <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
                                <img src={user.avatar} alt="Channel" className="h-full w-full" />
                            </span>
                            <div className="mr-auto inline-block">
                                <h1 className="font-bold text-xl">{user.fullName}</h1>
                                <p className="text-sm text-gray-400">@{user.username}</p>
                                <p className="text-sm text-gray-400">{subscribers?.length || 0} Subscribers&nbsp;·&nbsp;{subscribedTo?.length || 0} Subscribed</p>
                            </div>
                        </div>
                        <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 py-2 sm:top-[82px]">

                            <Link to={`/@${user.username}`}>
                                <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Videos</button>
                            </Link>

                            <li className="w-full">
                                <Link to={`/user/playlist/${username}/${user._id}`}>
                                    <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Playlist</button>
                                </Link>
                            </li>

                            <li className="w-full">
                                <button className="w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]">Tweets</button>
                            </li>

                            {user._id === authUser._id ?
                                (
                                    <li className="w-full">
                                        <Link to={`/subscribers/${user.username}/${user._id}`}>
                                            <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Subscribers</button>
                                        </Link>
                                    </li>
                                )
                                :
                                (
                                    <div></div>
                                )
                            }

                        </ul>


                        <div className="mt-2 mb-4 border pb-2">

                            <input
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write a tweet"
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
                                <button onClick={uploadTweet} className="bg-[#ae7aff] px-3 py-2 font-semibold text-black">Send</button>
                            </div>
                        </div>



                        {!tweets || tweets.length === 0 ? (
                            <div className="flex justify-center p-4 mt-11">
                                <div className="w-full max-w-sm text-center">
                                    <p className="mb-3 w-full">
                                        <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path>
                                            </svg>
                                        </span>
                                    </p>
                                    <h5 className="mb-2 font-semibold">No Tweets</h5>
                                    <p>This channel has yet to make a Tweet.</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {tweets.map(tweet => (
                                    <div key={tweet._id} className="flex gap-3 border-b border-gray-700 py-4 last:border-b-transparent">
                                        <div className="h-14 w-14 shrink-0">
                                            <img src={tweet.ownerDetails[0].avatar} alt={tweet.ownerDetails[0].fullName} className="h-full w-full rounded-full" />
                                        </div>
                                        <div className="w-full">

                                            <h4 className="mb-1 flex items-center gap-x-2">
                                                <Link to={`/@${tweet.ownerDetails[0].username}`}>
                                                    <span className="font-semibold">{tweet.ownerDetails[0].fullName}</span>
                                                </Link>
                                                &nbsp;<span className="inline-block text-sm text-gray-400">6 hours ago</span>
                                            </h4>
                                            <p className="text-sm text-gray-400">@{tweet.ownerDetails[0].username}</p>

                                            <p className="mb-2 mt-2">{tweet.content}</p>
                                            <div className="flex gap-4">
                                                <button className="group inline-flex items-center gap-x-1 outline-none after:content-[attr(data-like-count)] focus:after:content-[attr(data-like-count-alt)]">
                                                    {/* Like button SVG */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 text-inherit group-focus:text-[#ae7aff]">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                                    </svg>
                                                </button>
                                                <button className="group inline-flex items-center gap-x-1 outline-none after:content-[attr(data-dislike-count)] focus:after:content-[attr(data-dislike-count-alt)]">
                                                    {/* Dislike button SVG */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 text-inherit group-focus:text-[#ae7aff]">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </section>
            </div >
        </div >
    );
}

export default TweetPage;

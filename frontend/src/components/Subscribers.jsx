import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

function Subscribers() {
    const [user, setUser] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [subscribedTo, setSubscribedTo] = useState([]);
    const { username, userId } = useParams();
    const [collapsed, setCollapsed] = useState(true);

    // console.log("user id from param is", userId);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };


    useEffect(() => {
        axios.get("/api/v1/users/current-user")
            .then((result) => {
                setUser(result.data.data);
                // console.log("user details are: ", result.data.data);
            })
            .catch((err) => {
                console.log("error while finding user in Subscribers page ", err);
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

    // console.log("user channel subscribers array length is: ", subscribers.length);

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
                                <p className="text-sm text-gray-400">{subscribers?.length} Subscribers&nbsp;·&nbsp;{subscribedTo?.length || 0} Subscribed</p>
                            </div>
                        </div>
                        <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 py-2 sm:top-[82px]">

                            <li className="w-full">
                                <Link to={`/@${username}`}>
                                    <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Videos</button>
                                </Link>
                            </li>

                            <li className="w-full">
                                <Link to={`/user/playlist/${user.username}/${user._id}`}>
                                    <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Playlist</button>
                                </Link>
                            </li>

                            <li className="w-full">
                                <Link to={`/tweets/@${user.username}/${user._id}`}>
                                    <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Tweets</button>
                                </Link>
                            </li>

                            <li className="w-full">
                                {/* <Link to={`/subscribers/${user.username}/${user._id}`}> */}
                                <button className="w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]">Subscribers</button>
                                {/* </Link> */}
                            </li>

                        </ul>
                        {subscribers.length === 0 ? (
                            <div className="flex justify-center p-4 mt-11">
                                <div className="w-full max-w-sm text-center">
                                    <p className="mb-3 w-full">
                                        <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path>
                                            </svg>
                                        </span>
                                    </p>
                                    <h5 className="mb-2 font-semibold">No subscribers</h5>
                                    {/* <p>This page has yet to upload a video. Search another page in order to find more subscribers.</p> */}
                                </div>
                            </div>
                        ) : (
                            <div className='mt-14'>

                                <div className='mainsection flex flex-wrap flex-col gap-3' style={{ marginLeft: '5%', display: 'flex', flexWrap: 'wrap', gap: '20px', zoom: '1.2' }}>
                                    {/* Mapping over subscribers array to render video cards */}
                                    {subscribers.map((sub) => (
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
                </section>
            </div>
        </div>
    );
}

export default Subscribers;

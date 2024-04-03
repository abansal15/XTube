import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function UserChannel() {
  const [user, setUser] = useState([]);
  const [videos, setVideo] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/users/current-user")
      .then((result) => {
        setUser(result.data.data);
        console.log("user details are: ", result.data.data);
      })
      .catch((err) => {
        console.log("error while finding user in navbar ", err);
      });
  }, []);

  useEffect(() => {
    axios.get("/api/v1/dashboard/videos")
      .then((result) => {
        setVideo(result.data.data);
        console.log("channel video details are: ", result.data.data);
      })
      .catch((err) => {
        console.log("error while finding videos in channel ", err);
      });
  }, []);

  console.log("user channel videos array length is: ", videos.length);

  return (
    <div>
      {/* User channel */}
      <Navbar />

      {/* Sidebar */}
      <div className='sidebar' style={{ display: 'flex', flexDirection: 'row', gap: '80px', marginLeft: '60px', marginTop: '20px', marginRight: '100px' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginLeft: '50px', marginTop: '20px' }}>
          <a href="#" className='text-white mr-4'>Home</a>
          <a href="#" className='text-white mr-4'>Liked Videos</a>
          <a href="#" className='text-white mr-4'>History</a>
          <a href="#" className='text-white'>My content</a>
          <a href="#" className='text-white mr-4'>Collections</a>
          <a href="#" className='text-white'>Subscribers</a>
        </nav>


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
                <p className="text-sm text-gray-400">600k Subscribers&nbsp;·&nbsp;220 Subscribed   STATIC DATA</p>
              </div>
            </div>
            <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 py-2 sm:top-[82px]">
              <li className="w-full">
                <button className="w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]">Videos</button>
              </li>
              <li className="w-full">
                <Link to={`/user/playlist/${user._id}`}>
                  <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Playlist</button>
                </Link>
              </li>
              <li className="w-full">
                <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Tweets</button>
              </li>
              <li className="w-full">
                <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Subscribed</button>
              </li>
            </ul>
            {videos.length === 0 ? (
              <div className="flex justify-center p-4 mt-11">
                <div className="w-full max-w-sm text-center">
                  <p className="mb-3 w-full">
                    <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path>
                      </svg>
                    </span>
                  </p>
                  <h5 className="mb-2 font-semibold">No videos uploaded</h5>
                  {/* <p>This page has yet to upload a video. Search another page in order to find more videos.</p> */}
                </div>
              </div>
            ) : (
              <div className='mt-14'>

                <div className='mainsection' style={{ marginLeft: '5%', display: 'flex', flexWrap: 'wrap', gap: '20px', zoom: '1.2' }}>
                  {/* Mapping over videos array to render video cards */}
                  {videos.map((video) => (
                    <div key={video.id} className="w-full max-w-xl">
                      <Link to={`/playing/${encodeURIComponent(video.videoFile)}`}>
                        <div className="relative mb-2 w-full pt-[56%]">
                          <div className="absolute inset-0">
                            <img src={video.thumbnail} alt={video.title} className="h-full w-full" />
                          </div>
                          <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">{video.duration} mins</span>
                        </div>
                      </Link>
                      <div className="flex gap-x-2">
                        {/* <div className="h-10 w-10 shrink-0">
                          <img src={user.avatar} alt={user.fullName} className="h-full w-full rounded-full" />
                        </div> */}
                        <div className="w-full">
                          <h6 className="mb-1 font-semibold">{video.title}</h6>
                          <p className="flex text-sm text-gray-200">{video.views} Views · {video.duration} mins ago</p>
                          {/* <p className="text-sm text-gray-200">{user.fullName}</p> */}
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

export default UserChannel;

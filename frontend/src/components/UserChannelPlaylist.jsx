import React from 'react'
import Navbar from './Navbar'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function UserChannelPlaylist() {

  const { userId } = useParams();

  console.log("user id taken from params is : ", userId);

  const [user, setUser] = useState([]);
  const [playlist, setPlaylist] = useState([]);


  useEffect(() => {

    axios.get("/api/v1/users/current-user")
      .then((result) => {
        setUser(result.data.data);
        console.log("user detais are : ", result.data.data)
      }).catch((err) => {
        console.log("error while finding user in navbar ", err)
      });

  }, [])

  useEffect(() => {

    axios.get(`/api/v1/playlist/user/${userId}`)
      .then((result) => {
        setPlaylist(result.data.data);
        console.log("playlist details are : ", result.data.data)
      }).catch((err) => {
        console.log("error while fetching user playlist ", err)
      });

  }, [])



  return (
    <div>
      {/* user channel */}
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

              {/* <div className="inline-block">
                <div className="inline-flex min-w-[145px] justify-end">
                  <button className="group-btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
                    <span className="inline-block w-5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-current">
                        <path d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                      </svg>
                    </span>
                    <span className="group-focus:hidden">Subscribe</span>
                    <span className="hidden group-focus:block">Subscribed</span>
                  </button>
                </div>
              </div> */}

            </div>
            <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 py-2 sm:top-[82px]">
              <li className="w-full">
                <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Videos</button>
              </li>
              <li className="w-full">
                <button className="w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]">Playlist</button>
              </li>
              <li className="w-full">
                <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Tweets</button>
              </li>
              <li className="w-full">
                <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Subscribed</button>
              </li>
            </ul>
            <>
              {playlist.length === 0 ? (
                <div className="flex justify-center p-4">
                  <div className="w-full max-w-sm text-center">
                    <p className="mb-3 w-full">
                      <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                        <span className="inline-block w-6">
                          <svg style={{ width: '100%' }} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5L10.8845 2.76892C10.5634 2.1268 10.4029 1.80573 10.1634 1.57116C9.95158 1.36373 9.69632 1.20597 9.41607 1.10931C9.09916 1 8.74021 1 8.02229 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.71569 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V5M1 5H16.2C17.8802 5 18.7202 5 19.362 5.32698C19.9265 5.6146 20.3854 6.07354 20.673 6.63803C21 7.27976 21 8.11984 21 9.8V14.2C21 15.8802 21 16.7202 20.673 17.362C20.3854 17.9265 19.9265 18.3854 19.362 18.673C18.7202 19 17.8802 19 16.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </span>
                    </p>
                    <h5 className="mb-2 font-semibold">No playlist created</h5>
                    <p>There are no playlists created on this channel.</p>
                  </div>
                </div>
              ) : (

                <div className="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))]">

                  {
                    playlist.map((plist) => (
                      <div key={plist._id} className="w-full">
                        <div className="relative mb-2 w-full pt-[56%]">
                          <div className="absolute inset-0">
                            <img src={plist.thumbnail} alt={plist.name} className="h-full w-full" />
                            <div className="absolute inset-x-0 bottom-0">
                              <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                                <div className="relative z-[1]">
                                  <p className="flex justify-between">
                                    <span className="inline-block">Playlist</span>
                                    {
                                      plist.playlistVideos.length > 1
                                        ?
                                        (<span className="inline-block">{plist.playlistVideos.length}&nbsp;videos</span>)
                                        :
                                        (<span className="inline-block">{plist.playlistVideos.length}&nbsp;video</span>)
                                    }
                                  </p>
                                  <p className="text-sm text-gray-200">100K Views&nbsp;·&nbsp;2 hours ago</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <h6 className="mb-1 font-semibold">{plist.name}</h6>
                        <p className="flex text-sm text-gray-200">{plist.description}.</p>
                      </div>
                    ))
                  }

                </div>

              )
              }
            </>
          </div>
        </section>




      </div>





    </div>
  )
}

export default UserChannelPlaylist

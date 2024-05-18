import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState([]);
  const [authUser, setAuthUser] = useState([]);
  const [videos, setVideo] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [subscribedTo, setSubscribedTo] = useState([]);

  const [codeVisible, setCodeVisible] = useState(false);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [videoFile, setvideoFile] = useState(null);
  const [uploaded, setUploaded] = useState([]);
  const [thumbnail, setThumbnail] = useState();

  const toggleCodeVisibility = () => {
    setCodeVisible(!codeVisible);
  };

  let { username } = useParams();
  username = username.substr(1);

  console.log("username is : ", username);

  useEffect(() => {
    axios.get(`/api/v1/users/c/${username}`)
      .then((result) => {
        setUser(result.data.data);
        console.log("user profile details are: ", result.data.data);
      })
      .catch((err) => {
        console.log("error while finding user in Profile component ", err);
      });
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      console.log("hi");
      try {
        if (user._id) {
          const videoResponse = await axios.get(`/api/v1/dashboard/${user._id}`);
          setVideo(videoResponse.data.data);

          console.log("Channel video details are:", videoResponse.data.data);
        }
      } catch (error) {
        console.log("Error while finding videos in channel:", error);
      }
    };

    fetchVideos();
  }, [user._id]);


  useEffect(() => {
    axios.get("/api/v1/users/current-user")
      .then((result) => {
        setAuthUser(result.data.data);
        console.log("auth user details are: ", result.data.data);
      })
      .catch((err) => {
        console.log("error while finding auth user in playlist page ", err);
      });
  }, []);

  useEffect(() => {
    axios.get(`/api/v1/subscriptions/c/${user._id}`)
      .then((result) => {
        setSubscribers(result.data.data);
        console.log("Subscribers details are: ", result.data.data);
      })
      .catch((err) => {
        console.log("error while finding subscribers in user channel ", err);
      });
  }, [user._id]);

  useEffect(() => {
    axios.get(`/api/v1/subscriptions/u/${user._id}`)
      .then((result) => {
        setSubscribedTo(result.data.data);
        console.log("Subscribed TO details are: ", result.data.data);
      })
      .catch((err) => {
        console.log("error while finding the subscribed to in Profile page ", err);
      });
  }, [user._id]);

  console.log("user channel videos array length is: ", videos.length);

  const uploadVideo = () => {
    if (!title || !description || !videoFile) {
      console.log("Title, description, and video file are required.");
      return;
    }

    console.log("file is : ", thumbnail);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('videoFile', videoFile);
    formData.append('thumbnail', thumbnail);

    axios.post('/api/v1/videos/', formData)
      .then((res) => {
        setUploaded(res.data.data);
        console.log("uploaded video details is : ", res.data.data)
        setCodeVisible(!codeVisible);

        console.log("uploaded video id is ", uploaded._id);

        axios.patch(`/api/v1/playlist/add/${uploaded._id}/${playlist._id}`)
          .then((res) => {
            setPlaylist(res.data.data[0]);
            console.log("Updated playlist details are : ", res.data.data[0])

            window.location.reload();
          })
          .catch((err) => {
            console.log("Error while updating the playlist", err)
          })

      })
      .catch((error) => {
        console.log("error while uploading the video ", error);
      });
  };



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
                <p className="text-sm text-gray-400">{subscribers?.length || 0} Subscribers&nbsp;·&nbsp;{subscribedTo?.length || 0} Subscribed</p>
              </div>
            </div>
            <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 py-2 sm:top-[82px]">

              <li className="w-full">
                <button className="w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]">Videos</button>
              </li>

              <li className="w-full">
                <Link to={`/user/playlist/${username}/${user._id}`}>
                  <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Playlist</button>
                </Link>
              </li>

              <li className="w-full">
                <Link to={`/tweets/@${user.username}/${user._id}`}>
                  <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Tweets</button>
                </Link>
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

            {user._id === authUser._id ?

              <div className='h-20 w-20'>
                <button onClick={toggleCodeVisibility}>Upload video</button>
              </div>
              : <></>

            }


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


        {codeVisible && (

          <div className="absolute inset-0 z-10 bg-black/50 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8">
            <div className="h-full overflow-auto border bg-[#121212]">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-xl font-semibold">Upload Video</h2>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                  <button onClick={uploadVideo} className="group/btn mr-1 flex w-auto items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">
                    Save
                  </button>

                  <button onClick={toggleCodeVisibility} className="group/btn mr-1 flex w-auto items-center gap-x-2 bg-[#fe7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">
                    cancel
                  </button>
                </div>

              </div>
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4">
                <div className="w-full border-2 border-dashed px-4 py-12 text-center">
                  <span className="mb-4 inline-block w-24 rounded-full bg-[#E4D3FF] p-4 text-[#AE7AFF]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path>
                    </svg>
                  </span>
                  <h6 className="mb-2 font-semibold">Drag and drop video files to upload</h6>
                  <p className="text-gray-400">Your videos will be private until you publish them.</p>

                  <label htmlFor="upload-video" className="group/btn mt-4 inline-flex w-auto cursor-pointer items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">
                    <input type="file" id="upload-video" onChange={(e) => setvideoFile(e.target.files[0])} className="sr-only" />Select Files
                  </label>
                </div>

                <div className="w-full">
                  <label htmlFor="thumbnail" className="mb-1 inline-block">Thumbnail<sup>*</sup></label>
                  <input id="thumbnail" onChange={(e) => setThumbnail(e.target.files[0])} name='thumbnail' type="file" className="w-full border p-1 file:mr-4 file:border-none file:bg-[#ae7aff] file:px-3 file:py-1.5" />
                </div>

                <div className="w-full">
                  <label htmlFor="title" className="mb-1 inline-block">Title<sup>*</sup></label>
                  <input id="title" name='title' onChange={(e) => setTitle(e.target.value)} type="text" className="w-full border bg-transparent px-2 py-1 outline-none" />
                </div>

                <div className="w-full">
                  <label htmlFor="desc" className="mb-1 inline-block">Description<sup>*</sup></label>
                  <textarea id="desc" name='description' onChange={(e) => setDescription(e.target.value)} className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"></textarea>
                </div>

              </div>
            </div>
          </div>

        )}




      </div>
    </div>
  );
}

export default Profile;

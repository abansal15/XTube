import React from 'react'
import Navbar from './Navbar'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
// import { upload } from '../../../backend/src/middlewares/multer.middleware';

const PlaylistVideos = () => {

  const { userId, playlistId } = useParams();
  const [playlist, setPlaylist] = useState([]);
  const [codeVisible, setCodeVisible] = useState(false);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [videoFile, setvideoFile] = useState(null);
  const [uploaded, setUploaded] = useState([]);
  const [thumbnail, setThumbnail] = useState();

  console.log("title is : ", title);
  console.log("description is : ", description);

  const toggleCodeVisibility = () => {
    setCodeVisible(!codeVisible);
  };

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
          })
          .catch((err) => {
            console.log("Error while updating the playlist", err)
          })

      })
      .catch((error) => {
        console.log("error while uploading the video ", error);
      });
  };

  useEffect(() => {
    axios.get(`/api/v1/playlist/${playlistId}`)
      .then((result) => {
        setPlaylist(result.data.data[0]);
        console.log("playlist details are : ", result.data.data[0])
      }).catch((err) => {
        console.log("error while fetching user playlist ", err)
      });
  }, [playlistId]);


  let playlistVideos = playlist.playlistVideos;
  let videosLength = playlistVideos ? playlistVideos.length : 0;



  // console.log("playlistId ", playlistId)
  // console.log("userId ", userId)


  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        {/* Sidebar Section */}
        <div className='sidebar'>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginLeft: '50px', marginTop: '20px' }}>
            <a href="/" className='text-white mr-4'>Home</a>
            <a href="#" className='text-white mr-4'>Liked Videos</a>
            <a href="#" className='text-white mr-4'>History</a>
            <a href="#" className='text-white'>My content</a>
            <a href="#" className='text-white mr-4'>Collections</a>
            <a href="#" className='text-white'>Subscribers</a>
          </nav>
        </div>


        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-25">

          <div className="flex-wrap gap-y-10 p-4 xl:flex-nowrap">

            <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
              <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
                <div className="relative mb-2 w-full pt-[56%]">
                  <div className="absolute inset-0">
                    <img src={playlist.thumbnail} alt={playlist.name} className="h-full w-full" />
                    <div className="absolute inset-x-0 bottom-0">
                      <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                        <div className="relative z-[1]">
                          <p className="flex justify-between">
                            <span className="inline-block">Playlist</span>
                            {
                              videosLength > 1
                                ?
                                (<span className="inline-block">{videosLength}&nbsp;videos</span>)
                                :
                                (<span className="inline-block">{videosLength}&nbsp;video</span>)
                            }
                          </p>
                          <p className="text-sm text-gray-200">100K Views&nbsp;·&nbsp;2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h6 className="mb-1 font-semibold">{playlist.name}</h6>
                <p className="flex text-sm text-gray-200">{playlist.description}</p>
                {/* <div className="mt-6 flex items-center gap-x-3">
                  <div className="h-16 w-16 shrink-0">
                    <img src={playlist?.ownerDetails[0].avatar} alt="" className="h-full w-full rounded-full" />
                  </div>
                  <div className="w-full">
                    <h6 className="font-semibold">{playlist?.ownerDetails[0].username}</h6>
                    <p className="text-sm text-gray-300">757K Subscribers</p>
                  </div>
                </div> */}
              </div>

              <div className='h-20 w-20'>
                <button onClick={toggleCodeVisibility}>Upload video</button>
              </div>


            </div>

            <div className="flex w-full flex-col gap-y-4 mt-12">

              {
                playlist.playlistVideos?.map((video) => (

                  <Link to={`/playing/${encodeURIComponent(video.videoFile)}`}>
                    <div key={video._id} className="">
                      <div className="w-full max-w-3xl gap-x-4 sm:flex">
                        <div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                          <div className="w-full pt-[56%]">
                            <div className="absolute inset-0">
                              <img src={video.thumbnail} alt="thumbnail" className="h-full w-full" />
                            </div>
                            <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">{video.duration} min</span>
                          </div>
                        </div>
                        <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                          <div className="w-full">
                            <h6 className="mb-1 font-semibold sm:max-w-[75%]">{video.title}</h6>
                            <p className="flex text-sm text-gray-200 sm:mt-3">{video.views}&nbsp;Views · 44 minutes ago</p>
                            <div className="flex items-center gap-x-4">
                              <div className="mt-2 hidden h-10 w-10 shrink-0 sm:block">
                                <img src={video.videoOwner?.[0].avatar} alt="avatar" className="h-full w-full rounded-full" />
                              </div>
                              <p className="text-sm text-gray-200">{video.videoOwner?.[0].username}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                ))
              }

            </div>


          </div>

        </section>


        {codeVisible && (

          <div className="absolute inset-0 z-10 bg-black/50 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8">
            <div className="h-full overflow-auto border bg-[#121212]">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-xl font-semibold">Upload Video</h2>

                <div style={{display: 'flex', flexDirection: 'row', gap:'10px'}}>
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
  )
}

export default PlaylistVideos

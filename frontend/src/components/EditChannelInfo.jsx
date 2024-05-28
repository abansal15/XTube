import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function EditChannelInfo() {
    const [user, setUser] = useState([]);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [collapsed, setCollapsed] = useState(true);

    useEffect(() => {
        axios.get("/api/v1/users/current-user")
            .then((result) => {
                setUser(result.data.data);
                // console.log("user details are: ", result.data.data);
            })
            .catch((err) => {
                console.log("error while finding user in EditPersonalInfo page ", err);
            });
    }, []);


    const updateDetails = (event) => {
        event.preventDefault();
        if (!description.trim()) {
            setError('Description is required.');
        } else {
            setError('');

            axios.patch('/api/v1/users/update-channel', { description })
                .then((result) => {
                    // console.log("channel details updated succ see the data ", result.data.data);

                    setDescription(result.data.data.description);
                    setSuccess('Information updated successfully')

                }).catch((err) => {
                    console.log("error while updating the channel details ", err);
                });

        }
    }

    useEffect(() => {
        if (user && user.description) {
            setDescription(user.description);
        }

    }, [user]);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div>
            {/* EditChannelInfo */}
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
                            </div>

                            <div className="inline-block">
                                <Link to={'/user-channel'}>
                                    <button className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
                                        View channel
                                    </button>
                                </Link>
                            </div>


                        </div>
                        <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 py-2 sm:top-[82px]">

                            <li className="w-full">
                                <Link to={'/EditPersonalInfo'}>
                                    <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Personal Information</button>
                                </Link>
                            </li>

                            <li className="w-full">
                                <button className="w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]">Channel Information</button>
                            </li>

                            <li className="w-full">
                                <Link to={'/Change-Password'}>
                                    <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Change Password</button>
                                </Link>
                            </li>



                        </ul>

                    </div>

                    {/* Main body */}
                    <div>
                        {error && <div style={{ color: 'red' }}>{error}</div>}
                        {success && <div style={{ color: 'green' }}>{success}</div>}




                        <div className="flex flex-wrap justify-center gap-y-4 py-4">
                            <div className="w-full sm:w-1/2 lg:w-1/3">
                                <h5 className="font-semibold">Channel Info</h5>
                                <p className="text-gray-300">Update your Channel details here.</p>
                            </div>
                            <div className="w-full sm:w-1/2 lg:w-2/3">
                                <div className="rounded-lg border">
                                    <div className="flex flex-wrap gap-y-4 p-4">

                                        <div className="w-full">
                                            {/* <label className="mb-1 inline-block" htmlFor="desc">Description</label> */}
                                            {/* <textarea className="w-full rounded-lg border bg-transparent px-2 py-1.5" rows="4" id="desc" placeholder="Channel Description">I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development.</textarea> */}
                                            <label htmlFor="Description" className="mb-1 inline-block">Description</label>
                                            <textarea className="w-full rounded-lg border bg-transparent px-2 py-1.5" rows="4" id="desc" placeholder="Channel Description" onChange={(e) => setDescription(e.target.value)} value={description} />
                                        </div>

                                        <div className="flex w-full items-center gap-3">
                                            <div className="w-full max-w-xs rounded-lg border">
                                                <select className="w-full border-r-8 border-transparent bg-transparent py-1.5 pl-2">
                                                    <option value="light">Light</option>
                                                    <option value="regular" selected>Regular</option>
                                                    <option value="semi-bold">Semi bold</option>
                                                    <option value="bold">Bold</option>
                                                    <option value="bolder">Bolder</option>
                                                </select>
                                            </div>

                                        </div>

                                    </div>
                                    <div className="flex justify-end gap-4 p-4">
                                        <button onClick={() => window.location.reload()} className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10">Cancel</button>
                                        <button onClick={updateDetails} className="inline-block bg-[#ae7aff] px-3 py-1.5 text-black">Save changes</button>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>

                </section>

            </div>
        </div>
    );
}

export default EditChannelInfo;

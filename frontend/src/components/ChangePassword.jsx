import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function ChangePassword() {
    const [user, setUser] = useState([]);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
        if (!oldPassword.trim()) {
            setError('Current password is required.');
        } else if (!newPassword.trim()) {
            setError('New password is required.');
        } else if (!confirmPassword.trim()) {
            setError('Confirm password is required.');
        } else if (confirmPassword !== newPassword) {
            setError('New password and confirm password do not match.');
        } else {
            setError('');

            axios.post('/api/v1/users/change-password', { oldPassword, newPassword })
                .then((result) => {
                    // console.log("password updated successfully ", result)
                    setSuccess(result.data.message)
                    setError('')
                }).catch((error) => {

                    if (error.response && error.response.status === 400) {
                        setError('Incorrect Current Password. Please try again.');
                    } else {
                        console.log("Error while updating the channel details: ", error);
                        setError('An error occurred. Please try again later.');
                    }
                    setSuccess('')
                });

        }
    }

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div>
            {/* Change Password */}

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
                                <Link to={'/EditChannelInfo'}>
                                    <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Channel Information</button>
                                </Link>
                            </li>

                            <li className="w-full">
                                <button className="w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]">Change Password</button>
                            </li>



                        </ul>

                    </div>

                    {/* Main body */}
                    <div>
                        {error && <div style={{ color: 'red' }}>{error}</div>}
                        {success && <div style={{ color: 'green' }}>{success}</div>}


                        <div className="flex flex-wrap justify-center gap-y-4 py-4">

                            <div className="w-full sm:w-1/2 lg:w-1/3">
                                <h5 className="font-semibold">Password</h5>
                                <p className="text-gray-300">Please enter your current Password to change your Password.</p>
                            </div>

                            <div className="w-full sm:w-1/2 lg:w-2/3">
                                <div className="rounded-lg border">
                                    <div className="flex flex-wrap gap-y-4 p-4">

                                        <div className="w-full">
                                            <label htmlFor="old-pwd" className="mb-1 inline-block">Current Password</label>
                                            <input type="password" onChange={(e) => setOldPassword(e.target.value)} className="w-full rounded-lg border bg-transparent px-2 py-1.5" id="old-pwd" placeholder="Current Password" value={oldPassword} />
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="new-pwd" className="mb-1 inline-block">New Password</label>
                                            <input type="password" onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-lg border bg-transparent px-2 py-1.5" id="new-pwd" placeholder="New assword" value={newPassword} />
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="cnfrm-pwd" className="mb-1 inline-block">Confirm Password</label>
                                            <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-lg border bg-transparent px-2 py-1.5" id="cnfrm-pwd" placeholder="Confirm Password" value={confirmPassword} />
                                        </div>

                                    </div>

                                    <div className="flex items-center justify-end gap-4 p-4">
                                        <button onClick={() => window.location.reload()} className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10">Cancel</button>
                                        <button onClick={updateDetails} className="inline-block bg-[#ae7aff] px-3 py-1.5 text-black">Update Password</button>
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

export default ChangePassword;

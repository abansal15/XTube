import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function EditPersonalInfo() {
    const [user, setUser] = useState([]);
    const [firstName, setFirstName] = useState([]);
    const [lastName, setLastName] = useState([]);
    const [email, setEmail] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [change, setChange] = useState(0);
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
    }, [change]);


    const updateDetails = (event) => {
        event.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setError('Email is required.');
        } else if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
        } else if (!firstName.trim() || !lastName.trim()) {
            setError('First name and last name are required.');
        } else {
            setError('');
            const fullName = `${firstName} ${lastName}`;

            axios.patch('/api/v1/users/update-account', { fullName, email })
                .then((result) => {
                    // console.log("account details updated succ see the data ", result.data.data);

                    const nameParts = result.data.data.fullName.split(' ');
                    setFirstName(nameParts[0]);
                    setLastName(nameParts.slice(1).join(' '));
                    setChange((change) => (change + 1));
                    setSuccess('Information updated successfully')

                }).catch((err) => {
                    console.log("error while updating the account details ", err);
                });

        }
    }

    useEffect(() => {
        if (user && user.fullName) {
            const fullName = user.fullName;
            const nameParts = fullName.split(' ');
            setFirstName(nameParts[0]);
            setLastName(nameParts.slice(1).join(' '));
        }

        if (user && user.email) {
            setEmail(user.email);
        }

    }, [user]);
    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div>
            {/* EditPersonalInfo */}
            <Navbar />

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
                                <button className="w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]">Personal Information</button>
                            </li>

                            <li className="w-full">
                                <Link to={'/EditChannelInfo'}>
                                    <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">Channel Information</button>
                                </Link>
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
                                <h5 className="font-semibold">Personal Info</h5>
                                <p className="text-gray-300">Update your photo and personal details.</p>
                            </div>
                            <div className="w-full sm:w-1/2 lg:w-2/3">
                                <div className="rounded-lg border">
                                    <div className="flex flex-wrap gap-y-4 p-4">

                                        <div className="w-full lg:w-1/2 lg:pr-2">
                                            <label htmlFor="firstname" className="mb-1 inline-block">First name</label>
                                            <input type="text" onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-lg border bg-transparent px-2 py-1.5" id="firstname" placeholder="Enter first name" value={firstName} />
                                        </div>

                                        <div className="w-full lg:w-1/2 lg:pl-2">
                                            <label htmlFor="lastname" className="mb-1 inline-block">Last name</label>
                                            <input type="text" onChange={(e) => (setLastName(e.target.value))} className="w-full rounded-lg border bg-transparent px-2 py-1.5" id="lastname" placeholder="Enter last name" value={lastName} />
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="email" className="mb-1 inline-block">Email address</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
                                                    </svg>
                                                </div>
                                                <input type="email" onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border bg-transparent py-1.5 pl-10 pr-2" id="email" placeholder="Enter email address" value={email} />
                                            </div>
                                        </div>

                                    </div>
                                    {/* <hr className="border border-gray-300" /> */}

                                    <div className="flex items-center justify-end gap-4 p-4">
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

export default EditPersonalInfo;

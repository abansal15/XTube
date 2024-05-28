import React from 'react';
import { FaHome, FaHeart, FaHistory, FaPlayCircle, FaFolderOpen, FaUsers, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Sidebar({ collapsed, toggleSidebar }) {
    return (
        <div className={`sidebar ${collapsed ? 'flex w-40' : 'flex w-64'} flex-col text-white h-screen  transition-all duration-300`}>
            <div className="py-4 px-6 flex items-center justify-between">
                <div>
                    <FaBars className="ml-5 text-xl cursor-pointer" style={{ transform: 'scale(1.5)' }} onClick={toggleSidebar} />
                </div>
                {/* <h1 className="text-2xl font-bold">Logo</h1> */}
                <div></div>
            </div>
            <nav className="flex-1">
                <ul>
                    <li>
                        <Link to={"/"} className="flex items-center py-2 px-6 mb-4 mt-4 text-white">
                            <FaHome className="ml-5 mr-4 mb-4 mt-4" style={{ transform: 'scale(2.5)' }} />
                            <span className={`${collapsed ? 'hidden' : 'block ml-5'}`} style={{ fontSize: '1.37rem' }}>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to= "/Liked-Videos" className="flex items-center py-2 px-6 text-white">
                            <FaHeart className="ml-5 mr-4 mb-7 mt-4" style={{ transform: 'scale(2.5)' }} />
                            <span className={`${collapsed ? 'hidden' : 'block ml-5'}`} style={{ fontSize: '1.37rem' }}>Liked Videos</span>
                        </Link>
                    </li>
                    <li>
                        <Link to= "/Watch-History" className="flex items-center py-2 px-6 text-white">
                            <FaHistory className="ml-5 mr-4 mb-7 mt-4" style={{ transform: 'scale(2.5)' }} />
                            <span className={`${collapsed ? 'hidden' : 'block ml-5'}`} style={{ fontSize: '1.37rem' }} >History</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/user-channel" className="flex items-center py-2 px-6 text-white">
                            <FaPlayCircle className="ml-5 mr-4 mb-7 mt-4" style={{ transform: 'scale(2.5)' }} />
                            <span className={`${collapsed ? 'hidden' : 'block ml-5'}`} style={{ fontSize: '1.37rem' }} >My content</span>
                        </Link>
                    </li>
                    {/* <li>
                        <a href="#" className="flex items-center py-2 px-6 text-white">
                            <FaFolderOpen className="ml-5 mr-4 mb-7 mt-4" style={{ transform: 'scale(2.5)' }} />
                            <span className={`${collapsed ? 'hidden' : 'block ml-5'}`} style={{ fontSize: '1.37rem' }} >Collections</span>
                        </a>
                    </li> */}
                    <li>
                        <Link to = "/S/Subscriptions" className="flex items-center py-2 px-6 text-white">
                            <FaUsers className="ml-5 mr-4 mt-4" style={{ transform: 'scale(2.5)' }} />
                            <span className={`${collapsed ? 'hidden' : 'block ml-5'}`} style={{ fontSize: '1.37rem' }} >Subscribers</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;

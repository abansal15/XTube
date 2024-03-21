import React from "react";

function Navbar() {
    return (
        <>
            {/* Header Section */}
            <div className='text-white px-7 py-7 flex items-center justify-between'>
                <div className='flex items-center'>
                    <img src="https://cdn.create.vista.com/api/media/small/411025630/stock-vector-logo-design-white-letter-letter-logo-design-initial-letter-linked"
                        alt="Logo" className='h-28 rounded-full' />
                    <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'red', alignItems: 'center', marginLeft: '250%' }}>
                        <input
                            type="text"
                            placeholder="Search"
                            className="px-4 py-2 rounded-md focus:outline-none"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md focus:outline-none">
                        Login
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md focus:outline-none">
                        Sign Up
                    </button>
                </div>
            </div>
        </>
    )
}

export default Navbar;
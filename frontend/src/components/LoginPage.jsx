import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'
import '../style.css';
import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'

function LoginPage() {

    const [action, setAction] = useState("Login")

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('/api/v1/users/login', { email, username, password })
            .then((response) => {
                // console.log(response);
                const { data } = response;
                const { accessToken } = data.data;

                // Store the access token securely (e.g., in local storage)
                localStorage.setItem('accessToken', accessToken);


                // Set authentication status in your component state or context
                // setIsAuthenticated(true);

                window.location.href = '/';

                // Redirect to another page or handle success as needed
            })
            .catch((error) => {
                console.error("Error logging in:", error);
                // Handle login error
            });
    }

    return (
        <>
            {/* <Navbar /> */}
            <Navbar />
            <form onSubmit={handleSubmit}>
                <div className="container" style={{ backgroundColor: '#030303' }}>

                    <div className="header">
                        <div className="text" style={{ color: 'white' }}>
                            {action}
                        </div>
                        <div className="underline" style={{ color: 'white', background: 'white' }}></div>
                    </div>



                    <div className="inputs">

                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input type="text" placeholder='Username' name='username' onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input type="email" placeholder='Email id' name='email' onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="password" placeholder='password' name='password' onChange={(e) => setPassword(e.target.value)} />
                        </div>

                    </div>
                    {/* 
                    <div className="forgot-password">
                        Lost Password? <span>Click here!</span>
                    </div> */}

                    <div className="submit-container">
                        <button type="submit" className='submit'>Login</button>
                        {/* <div className={action === 'Sign up' ? "submit grap" : "submit"} onClick={() => { setAction("Login") }} >Login</div> */}
                    </div>

                    <div className="submit-container" style={{ marginTop: '-30px' }}>
                        <h2 style={{ fontSize: '1.5rem' }} className='block'>Dont have an Account ? </h2>
                        {/* <div className={action === 'Sign up' ? "submit grap" : "submit"} onClick={() => { setAction("Login") }} >Login</div> */}
                    </div>

                    <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', marginTop: '-2.5rem' }}>
                        <Link to= "/register">
                            <button type="submit" className='submit' >Sign Up</button>
                        </Link>
                    </div>

                </div>
            </form>

        </>
    );
}

export default LoginPage;

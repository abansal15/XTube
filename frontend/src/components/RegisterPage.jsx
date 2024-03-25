import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'
import '../style.css';
import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'

function RegisterPage() {
    // const history = useHistory();
    const [action, setAction] = useState("Sign up");

    const [fullName, setFullname] = useState();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [avatar, setAvatar] = useState();
    const [coverImage, setCoverimage] = useState();

    console.log("fullname", fullName);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('avatar', avatar); // Here avatar should be the file itself
        formData.append('coverImage', coverImage); // Here coverImage should be the file itself

        axios.post('/api/v1/users/register', formData)
            .then(result => {
                console.log(result);
                window.location.href = '/login';
                // history.push('/login');
            })
            .catch(err => console.log(err));
    }


    return (
        <>
            {/* <Navbar /> */}

            <div className="container">

                <div className="header">
                    <div className="text">
                        {action}
                    </div>
                    <div className="underline"></div>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="inputs">

                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input type="text" placeholder='Name' name='fullName' onChange={(e) => setFullname(e.target.value)} />
                        </div>

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

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type='file' placeholder='avatar' name='avatar' onChange={(e) => setAvatar(e.target.files[0])} />
                        </div>

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type='file' placeholder='Cover Image' name='coverImage' onChange={(e) => setCoverimage(e.target.files[0])} />
                        </div>


                        <div className="submit-container">
                            <button type="submit" className='submit'>Sign up</button>
                            {/* <div className={action === "Login" ? "submit gray" : "submit"} >Sign up</div> */}
                            {/* <div className={action === 'Sign up' ? "submit gray" : "submit"} onClick={() => { setAction("Login") }} >Login</div> */}
                        </div>
                    </div>


                </form>

            </div>

        </>
    );
}

export default RegisterPage;

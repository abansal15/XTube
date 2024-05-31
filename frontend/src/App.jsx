import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Test from './components/Test.jsx';
import Home from './components/Home.jsx';
import PlayingVideo from './components/PlayingVideo.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import UserChannel from './components/UserChannel.jsx';
import UserChannelPlaylist from './components/UserChannelPlaylist.jsx';
import PlaylistVideos from './components/PlaylistVideos.jsx';
import Profile from './components/Profile.jsx';
import TweetPage from './components/TweetPage.jsx';
import Subscribers from './components/Subscribers.jsx';
import EditPersonalInfo from './components/EditPersonalInfo.jsx';
import EditChannelInfo from './components/EditChannelInfo.jsx';
import ChangePassword from './components/ChangePassword.jsx';
import LikedVideos from './components/LikedVideos.jsx';
import WatchHistory from './components/WatchHistory.jsx';
import NotFound from './components/NotFound.jsx';
import Subcriptions from './components/Subcriptions.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthenticationStatus = async () => {
      try {
        const response = await axios.get("/api/v1/auth/status", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        // console.log("hooooooooojojojoojookoklw  ");
        setIsAuthenticated(response.data.data.isAuthenticated);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching authentication status:", error);
      }
    };

    fetchAuthenticationStatus();
  }, []);

  // If loading, return loading indicator
  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/test" element={<Test />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/playing/:value" element={<PlayingVideo />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route exact path="/user-channel" element={isAuthenticated ? <UserChannel /> : <Navigate to="/login" />} />
          <Route exact path="/:username" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/user/playlist/:username/:userId" element={isAuthenticated ? <UserChannelPlaylist /> : <Navigate to="/login" />} />
          <Route path="/user/:userId/playlist/:playlistId" element={isAuthenticated ? <PlaylistVideos /> : <Navigate to="/login" />} />
          <Route path="/tweets/:username/:userId" element={isAuthenticated ? <TweetPage /> : <Navigate to="/login" />} />
          <Route path="/subscribers/:username/:userId" element={isAuthenticated ? <Subscribers /> : <Navigate to="/login" />} />
          <Route exact path="/EditPersonalInfo" element={isAuthenticated ? <EditPersonalInfo /> : <Navigate to="/login" />} />
          <Route exact path="/EditChannelInfo" element={isAuthenticated ? <EditChannelInfo /> : <Navigate to="/login" />} />
          <Route exact path="/Change-Password" element={isAuthenticated ? <ChangePassword /> : <Navigate to="/login" />} />
          <Route exact path="/Liked-Videos" element={isAuthenticated ? <LikedVideos /> : <Navigate to="/login" />} />
          <Route exact path="/Watch-History" element={isAuthenticated ? <WatchHistory /> : <Navigate to="/login" />} />
          <Route exact path="/S/Subscriptions" element={isAuthenticated ? <Subcriptions /> : <Navigate to="/login" />} />

          {/* Catch-all route for 404 Not Found */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

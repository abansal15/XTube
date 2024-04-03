// Jai shree ram
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Test from './components/Test.jsx';
import Home from './components/Home.jsx';
import PlayingVideo from './components/PlayingVideo.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import UserChannel from './components/UserChannel.jsx';
import UserChannelPlaylist from './components/UserChannelPlaylist.jsx';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/test" element={<Test />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/playing/:value" element={<PlayingVideo />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/admin-dashboard" element={<AdminDashboard />} />
          <Route exact path="/user-channel" element={<UserChannel />} />
          <Route path="/user/playlist/:userId" element={<UserChannelPlaylist />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

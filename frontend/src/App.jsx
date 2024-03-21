// Jai shree ram
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Test from './components/Test.jsx';
import Home from './components/Home.jsx';
import PlayingVideo from './components/PlayingVideo.jsx';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/test" element={<Test />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/playing/:value" element={<PlayingVideo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

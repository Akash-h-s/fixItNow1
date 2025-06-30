import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import WorkersList from './components/WorkersList';
import TrackWorker from './components/TrackWorker';
import Inbox from './components/inbox';


const AppWrapper = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
   
  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <div style={{ paddingTop: !shouldHideNavbar ? '0px' : '0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/workerslist" element={<WorkersList />} />
          <Route path="/trackworker/:workerId" element={<TrackWorker />} />
          <Route path="/inbox" element={<Inbox />} />

        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;

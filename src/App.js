import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/register';
import { Toaster } from 'react-hot-toast';
import React from 'react';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ApplyDoctor from './pages/ApplyDoctor';
import Notification from './pages/Notification';
import Userslist from './pages/Admin/Userslist';
import Doctorslist from './pages/Admin/Doctorslist';
import Profile from './pages/Doctor/Profile';
import BookAppointment from './pages/BookAppointment';
import Appointment from './pages/Appointment';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
function App() {
  const {loading}=useSelector(state =>state.alerts);
  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-parent">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/" element={ <ProtectedRoute><Home /></ProtectedRoute> }/>
          <Route path="/apply-doctor" element={ <ProtectedRoute><ApplyDoctor/></ProtectedRoute> }/>
          <Route path="/notification" element={ <ProtectedRoute><Notification/></ProtectedRoute> }/>
          <Route path="/admin/userslist" element={ <ProtectedRoute><Userslist/></ProtectedRoute> }/>
          <Route path="/admin/doctorslist" element={ <ProtectedRoute><Doctorslist/></ProtectedRoute> }/>
          <Route path="/doctor/profile/:userId" element={ <ProtectedRoute><Profile/></ProtectedRoute> }/>
          <Route path="/book-appointment/:doctorId" element={ <ProtectedRoute><BookAppointment/></ProtectedRoute> }/>
          <Route path="/appointment" element={ <ProtectedRoute><Appointment/></ProtectedRoute> }/>
          <Route path="/doctor/appointment" element={ <ProtectedRoute><DoctorAppointment/></ProtectedRoute> }/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;


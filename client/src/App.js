import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import "./App.css";

import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import Query from "./pages/Query";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import ApplyDoctor from "./pages/ApplyDoctor";
import Notification from "./pages/Notification";

import Userslist from "./pages/Admin/Userslist";
import Doctorslist from "./pages/Admin/Doctorslist";
import Querieslist from "./pages/Admin/Querieslist";

import Profile from "./pages/Doctor/Profile";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";

import BookAppointment from "./pages/BookAppointment";
import Appointment from "./pages/Appointment";
import DoctorSearch from "./pages/DoctorSearch";

function App() {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-parent">
          <div className="spinner-border" role="status"></div>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* =========================
            PUBLIC LANDING PAGE
        ========================= */}
        <Route path="/" element={<LandingPage />} />

        {/* =========================
            AUTHENTICATION
        ========================= */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* =========================
            USER DASHBOARD
        ========================= */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* =========================
            USER ROUTES
        ========================= */}
        <Route
          path="/apply-doctor"
          element={
            <ProtectedRoute>
              <ApplyDoctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search-doctors"
          element={
            <ProtectedRoute>
              <DoctorSearch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/query"
          element={
            <ProtectedRoute>
              <Query />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-appointment/:doctorId"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointment"
          element={
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          }
        />

        {/* =========================
            DOCTOR ROUTES
        ========================= */}
        <Route
          path="/doctor/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/appointment"
          element={
            <ProtectedRoute>
              <DoctorAppointment />
            </ProtectedRoute>
          }
        />

        {/* =========================
            ADMIN ROUTES
        ========================= */}
        <Route
          path="/admin/userslist"
          element={
            <ProtectedRoute>
              <Userslist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctorslist"
          element={
            <ProtectedRoute>
              <Doctorslist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/queries"
          element={
            <ProtectedRoute>
              <Querieslist />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

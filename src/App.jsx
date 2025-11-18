import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import AppContextProvider from './context/AppContext'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import RoleSelection from './components/RoleSelection'
import PatientDashboard from './pages/PatientDashboard'
import Login from './pages/Login'
import DoctorLogin from './pages/DoctorLogin'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import PatientAuth from './pages/PatientAuth'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import DoctorDashboard from './pages/DoctorDashboard'

// Wrap PatientDashboard with ErrorBoundary
const ProtectedPatientDashboard = () => (
  <ErrorBoundary>
    <PatientDashboard />
  </ErrorBoundary>
)

const Layout = ({ children }) => {
  const location = useLocation();
  // hide navbar for auth pages and the role selection landing page (include root '/')
  const hideNavbarPaths = ['/', '/patient-auth', '/login', '/admin-login', '/role-selection', '/doctor-login'];

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      {children}
    </div>
  );
};

const App = () => {
  return (
    <AppContextProvider>
      <Router>
        <Layout>
          <ErrorBoundary>
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/home" element={<Home />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/patient-auth" element={<PatientAuth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/patient-dashboard" element={<ProtectedPatientDashboard />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/doctors/:speciality" element={<Doctors />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/doctor-dashboard" element={<ErrorBoundary><DoctorDashboard /></ErrorBoundary>} />
            
            <Route path="/appointment/:docId" element={<Appointment />} />
            <Route path="*" element={<RoleSelection />} />
          </Routes>
          </ErrorBoundary>
        </Layout>
      </Router>
    </AppContextProvider>
  )
}

export default App

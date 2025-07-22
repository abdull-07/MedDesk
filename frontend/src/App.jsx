  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import Navbar from './components/Navbar';
  import Footer from './components/Footer';
  import ForgotPassword from './pages/auth/ForgotPassword';
  import ResetPassword from './pages/auth/ResetPassword';
  import PatientSignUp from './pages/auth/PatientSignUp';
  import DoctorSignUp from './pages/auth/DoctorSignUp';
  import SignIn from './pages/auth/SignIn';
  import VerificationPending from './pages/auth/VerificationPending';
  import Profile from './pages/auth/Profile';
  import ProtectedRoute from './components/ProtectedRoute';
  import { AuthProvider } from './context/AuthContext';

  // Common Pages
  import Home from './pages/common/Home';
  import About from './pages/common/About';
  import Payment from './pages/common/Payment';
  import Contact from './pages/common/Contact'
  import FAQ from './pages/common/FAQ'
  import Terms from './pages/common/Terms'
  import Privacy from './pages/common/Privacy'

  // Doctor Pages
  import DoctorDashboard from './pages/doctor/Dashboard';
  import DoctorSchedule from './pages/doctor/Schedule';
  import DoctorAppointments from './pages/doctor/Appointments';
  import DoctorPatients from './pages/doctor/Patients';
  import DoctorProfile from './pages/doctor/Profile';
  import DoctorNotifications from './pages/doctor/Notifications';

  // Patient Pages
  import PatientDashboard from './pages/patient/Dashboard';
  import DoctorsList from './pages/patient/DoctorsList';
  import { default as PatientDoctorView } from './pages/patient/DoctorProfile';
  import PatientAppointments from './pages/patient/Appointments';
  import PatientReviews from './pages/patient/Reviews';
  import PatientNotifications from './pages/patient/Notifications';
  import PatientProfile from './pages/patient/Profile';

  // Admin Pages
  import AdminDashboard from './pages/admin/Dashboard';
  import AdminUsers from './pages/admin/Users';
  import AdminDoctors from './pages/admin/Doctors';
  import AdminAppointments from './pages/admin/Appointments';
  import AdminReports from './pages/admin/Reports';
  import AdminLogs from './pages/admin/Logs';

  function App() {
    return (
      <Router>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Common Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Auth Routes */}
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verification-pending" element={<VerificationPending />} />
                
                {/* Redirect /sign-up to patient signup by default */}
                <Route path="/sign-up" element={<PatientSignUp />} />
                
                {/* Doctor Public Routes */}
                <Route path="/doctor/sign-up" element={<DoctorSignUp />} />
                
                {/* Patient Public Routes */}
                <Route path="/patient/sign-up" element={<PatientSignUp />} />

                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                <Route path="/payment" element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                } />

                {/* Doctor Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                  <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                  <Route path="/doctor/schedule" element={<DoctorSchedule />} />
                  <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                  <Route path="/doctor/patients" element={<DoctorPatients />} />
                  <Route path="/doctor/profile" element={<DoctorProfile />} />
                  <Route path="/doctor/notifications" element={<DoctorNotifications />} />
                </Route>

                {/* Patient Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                  <Route path="/patient/dashboard" element={<PatientDashboard />} />
                  <Route path="/patient/doctors" element={<DoctorsList />} />
                  <Route path="/patient/doctors/:id" element={<PatientDoctorView />} />
                  <Route path="/patient/appointments" element={<PatientAppointments />} />
                  <Route path="/patient/reviews" element={<PatientReviews />} />
                  <Route path="/patient/notifications" element={<PatientNotifications />} />
                  <Route path="/patient/profile" element={<PatientProfile />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/doctors" element={<AdminDoctors />} />
                  <Route path="/admin/appointments" element={<AdminAppointments />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route path="/admin/logs" element={<AdminLogs />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<h1>404 Not Found</h1>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    );
  }

  export default App; 
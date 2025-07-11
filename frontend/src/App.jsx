import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import PatientSignUp from './pages/auth/PatientSignUp';
import DoctorSignUp from './pages/auth/DoctorSignUp';
import SignIn from './pages/auth/SignIn';

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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Common Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Doctor Routes */}
            <Route path="/doctor">
              <Route path="sign-up" element={<DoctorSignUp />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="schedule" element={<DoctorSchedule />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="profile" element={<DoctorProfile />} />
              <Route path="notifications" element={<DoctorNotifications />} />
            </Route>

            {/* Patient Routes */}
            <Route path="/patient">
              <Route path="sign-up" element={<PatientSignUp />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="doctors" element={<DoctorsList />} />
              <Route path="doctors/:id" element={<PatientDoctorView />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="reviews" element={<PatientReviews />} />
              <Route path="notifications" element={<PatientNotifications />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="logs" element={<AdminLogs />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Redirect /sign-up to patient signup by default */}
            <Route path="/sign-up" element={<PatientSignUp />} />

            {/* Catch-all route */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 
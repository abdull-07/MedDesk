import { Link } from 'react-router-dom';
import {
  FaUserMd, FaCalendarCheck, FaUserPlus,
  FaHeartbeat, FaBaby, FaBrain, FaEye, FaTooth,
  FaShieldAlt, FaStethoscope, FaBell, FaComments,
  FaStar, FaFileMedical, FaCalendarAlt, FaArrowRight,
  FaPlay, FaQuoteLeft
} from 'react-icons/fa';

const Home = () => {
  const specialties = [
    {
      icon: FaHeartbeat,
      name: 'Cardiology',
      description: 'Heart & Cardiovascular Care'
    },
    {
      icon: FaBaby,
      name: 'Pediatrics',
      description: 'Child Healthcare'
    },
    {
      icon: FaBrain,
      name: 'Neurology',
      description: 'Brain & Nervous System'
    },
    {
      icon: FaEye,
      name: 'Ophthalmology',
      description: 'Eye Care Services'
    },
    {
      icon: FaTooth,
      name: 'Dentistry',
      description: 'Dental Care'
    },
    {
      icon: FaStethoscope,
      name: 'General Medicine',
      description: 'Primary Healthcare'
    }
  ];

  const benefits = [
    {
      icon: FaCalendarAlt,
      title: "Smart Scheduling",
      description: "Book appointments instantly, 24/7 access to healthcare professionals",
      features: ["Quick Booking", "Instant Confirmation", "Flexible Timing"]
    },
    {
      icon: FaUserMd,
      title: "Expert Doctors",
      description: "Access to verified specialists and healthcare experts near you",
      features: ["Verified Profiles", "Specialist Search", "Doctor Reviews"]
    },
    {
      icon: FaFileMedical,
      title: "Digital Records",
      description: "Secure access to your complete medical history and reports",
      features: ["Easy Access", "Secure Storage", "Share Reports"]
    },
    {
      icon: FaShieldAlt,
      title: "Data Security",
      description: "Enterprise-grade security for your sensitive health information",
      features: ["HIPAA Compliant", "Encrypted Data", "Private Access"]
    },
    {
      icon: FaBell,
      title: "Smart Alerts",
      description: "Never miss appointments with automated notifications",
      features: ["SMS Alerts", "Email Reminders", "Calendar Sync"]
    },
    {
      icon: FaComments,
      title: "Easy Connect",
      description: "Direct messaging with your healthcare providers",
      features: ["Chat Support", "Video Calls", "File Sharing"]
    }
  ];

  const steps = [
    {
      icon: FaUserPlus,
      title: 'Sign Up',
      description: 'Create your free account'
    },
    {
      icon: FaUserMd,
      title: 'Choose Doctor',
      description: 'Select from verified specialists'
    },
    {
      icon: FaCalendarCheck,
      title: 'Book Appointment',
      description: 'Schedule your visit'
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      image: "/testimonials/doctor1.jpg",
      content: "MedDesk has streamlined my practice. The scheduling system is intuitive and saves me hours each week.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Patient",
      image: "/testimonials/patient1.jpg",
      content: "Finding and booking appointments with specialists has never been easier. Excellent service!",
      rating: 5
    },
    {
      name: "Dr. James Wilson",
      role: "Pediatrician",
      image: "/testimonials/doctor2.jpg",
      content: "The platform is secure and reliable. My patients love the easy booking process.",
      rating: 5
    }
  ];



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-8 relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              {/* Main Heading */}
              <div className="mb-8">
                <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
                  Med<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Desk</span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-400 mx-auto rounded-full"></div>
              </div>

              {/* Subtitle */}
              <p className="text-2xl md:text-4xl text-slate-300 mb-6 font-light">
                Healthcare at your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 font-semibold">
                  fingertips
                </span>
              </p>

              {/* Description */}
              <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Connect with verified doctors, book appointments instantly, and manage your health journey with our cutting-edge platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                <Link
                  to="/doctor/sign-up"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <FaUserMd className="w-5 h-5" />
                    Join as Doctor
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                
                <Link
                  to="/patient/sign-up"
                  className="group px-8 py-4 border-2 border-slate-600 text-white font-semibold rounded-2xl hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FaCalendarCheck className="w-5 h-5" />
                    Book Appointment
                  </span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
                  <div className="text-slate-400">Verified Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
                  <div className="text-slate-400">Happy Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                  <div className="text-slate-400">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */ }
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
      <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
    </div>
  </div>
      </section >

  {/* How It Works Section */ }
  < section className = "py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden" >
    {/* Background Pattern */ }
    <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}></div>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
  {/* Section Header */}
  <div className="text-center mb-20">
    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
      <FaPlay className="w-3 h-3" />
      Simple Process
    </div>
    <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
      How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">Works</span>
    </h2>
    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
      Get started with MedDesk in three simple steps and transform your healthcare experience
    </p>
  </div>

  {/* Steps */}
  <div className="relative">
    {/* Connection Line */}
    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-teal-200 to-blue-200 transform -translate-y-1/2 z-0"></div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
      {steps.map((step, index) => (
        <div key={index} className="group text-center">
          {/* Step Number */}
          <div className="relative mb-8">
            <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
              <step.icon className="w-8 h-8 text-blue-600 group-hover:text-teal-600 transition-colors duration-300" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {index + 1}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
              {step.title}
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Arrow (except for last item) */}
          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
              <FaArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>

  {/* Bottom CTA */}
  <div className="text-center mt-16">
    <Link
      to="/sign-up"
      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
    >
      Get Started Now
      <FaArrowRight className="w-4 h-4" />
    </Link>
  </div>
</div>
      </section >

  {/* Specialties Section */ }
  < section className = "py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden" >
    {/* Background Elements */ }
    < div className = "absolute inset-0" >
          <div className="absolute top-10 right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-30"></div>
        </div >

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    {/* Section Header */}
    <div className="text-center mb-20">
      <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <FaStethoscope className="w-3 h-3" />
        Medical Specialties
      </div>
      <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">Specialties</span>
      </h2>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Connect with top-rated specialists across various medical fields and get the expert care you deserve
      </p>
    </div>

    {/* Specialties Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {specialties.map((specialty, index) => (
        <Link
          key={index}
          to={`/doctors/${specialty.name.toLowerCase()}`}
          className="group relative"
        >
          {/* Card */}
          <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            {/* Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Icon Container */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <specialty.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-white transition-colors duration-300">
                  {specialty.name}
                </h3>
                <p className="text-slate-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                  {specialty.description}
                </p>
              </div>

              {/* Arrow Icon */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600 group-hover:text-white transition-colors duration-300">
                  View Doctors
                </span>
                <div className="w-8 h-8 bg-blue-100 group-hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                  <FaArrowRight className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-xl group-hover:from-white/10 group-hover:to-white/10 transition-all duration-500"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-teal-200/20 to-blue-200/20 rounded-full blur-xl group-hover:from-white/10 group-hover:to-white/10 transition-all duration-500"></div>
          </div>
        </Link>
      ))}
    </div>

    {/* Bottom CTA */}
    <div className="text-center mt-16">
      <p className="text-slate-600 mb-6">Can't find your specialty?</p>
      <Link
        to="/specialties"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-teal-600 font-semibold transition-colors duration-300"
      >
        View All Specialties
        <FaArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
      </section >

  {/* Benefits Section */ }
  < section className = "py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden" >
    {/* Background Elements */ }
    < div className = "absolute inset-0" >
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-teal-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-teal-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
        </div >

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    {/* Section Header */}
    <div className="text-center mb-20">
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <FaShieldAlt className="w-3 h-3" />
        Platform Benefits
      </div>
      <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
        Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">MedDesk</span>
      </h2>
      <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
        Experience the future of healthcare management with our innovative features designed to make healthcare accessible, secure, and efficient
      </p>
    </div>

    {/* Benefits Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="group relative"
        >
          {/* Card */}
          <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full">
            {/* Gradient Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-teal-600"></div>

            {/* Hover Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-blue-600 group-hover:text-teal-600 transition-colors duration-300" />
                </div>
              </div>

              {/* Title and Description */}
              <div className="mb-6 flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {benefit.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-slate-700 group-hover:text-slate-900 transition-colors duration-300"
                  >
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-xl group-hover:from-blue-300/30 group-hover:to-teal-300/30 transition-all duration-500"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-teal-200/20 to-blue-200/20 rounded-full blur-xl group-hover:from-teal-300/30 group-hover:to-blue-300/30 transition-all duration-500"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Bottom Section */}
    <div className="text-center mt-20">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white">
        <h3 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h3>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of healthcare professionals and patients who trust MedDesk for their medical needs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/sign-up"
            className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-colors duration-300 transform hover:-translate-y-1"
          >
            Start Free Trial
          </Link>
          <Link
            to="/demo"
            className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-colors duration-300 transform hover:-translate-y-1"
          >
            Watch Demo
          </Link>
        </div>
      </div>
    </div>
  </div>
      </section >

  {/* Testimonials Section */ }
  < section className = "py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden" >
    {/* Background Elements */ }
    < div className = "absolute inset-0" >
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-100/20 to-teal-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-teal-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
        </div >

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    {/* Section Header */}
    <div className="text-center mb-20">
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <FaQuoteLeft className="w-3 h-3" />
        User Testimonials
      </div>
      <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
        What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">Users Say</span>
      </h2>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Trusted by thousands of healthcare professionals and patients worldwide
      </p>
    </div>

    {/* Testimonials Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="group relative"
        >
          {/* Card */}
          <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full">
            {/* Quote Icon Background */}
            <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <FaQuoteLeft className="w-5 h-5 text-blue-600" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
              {/* User Info */}
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                    {testimonial.name}
                  </h3>
                  <p className="text-slate-600 font-medium">{testimonial.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 w-5 h-5 drop-shadow-sm" />
                ))}
              </div>

              {/* Testimonial Content */}
              <div className="flex-grow">
                <p className="text-slate-700 leading-relaxed text-lg italic">
                  "{testimonial.content}"
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-xl group-hover:from-blue-300/30 group-hover:to-teal-300/30 transition-all duration-500"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-teal-200/20 to-blue-200/20 rounded-full blur-xl group-hover:from-teal-300/30 group-hover:to-blue-300/30 transition-all duration-500"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Bottom Stats */}
    <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="text-center">
        <div className="text-4xl font-bold text-slate-900 mb-2">4.9/5</div>
        <div className="text-slate-600">Average Rating</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-slate-900 mb-2">2,500+</div>
        <div className="text-slate-600">Reviews</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-slate-900 mb-2">98%</div>
        <div className="text-slate-600">Satisfaction Rate</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-slate-900 mb-2">24/7</div>
        <div className="text-slate-600">Support</div>
      </div>
    </div>
  </div>
      </section >

  {/* CTA Section */ }
  < section className = "py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden" >
    {/* Background Elements */ }
    < div className = "absolute inset-0" >
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
        </div >

  {/* Grid Pattern Overlay */ }
  <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}></div>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
  <div className="text-center text-white">
    {/* Main Heading */}
    <div className="mb-8">
      <h2 className="text-5xl md:text-6xl font-bold mb-6">
        Ready to Transform Your
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
          Healthcare Experience?
        </span>
      </h2>
      <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-teal-400 mx-auto rounded-full"></div>
    </div>

    {/* Description */}
    <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
      Join thousands of healthcare professionals and patients who trust MedDesk for seamless, secure, and efficient healthcare management.
    </p>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
      <Link
        to="/sign-up"
        className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          <FaUserPlus className="w-5 h-5" />
          Start Your Journey
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      <Link
        to="/contact"
        className="group px-10 py-5 border-2 border-slate-500 text-white font-bold rounded-2xl hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300 transform hover:-translate-y-2"
      >
        <span className="flex items-center justify-center gap-3">
          <FaComments className="w-5 h-5" />
          Contact Sales
        </span>
      </Link>
    </div>

    {/* Trust Indicators */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="text-3xl font-bold text-white mb-2">99.9%</div>
        <div className="text-slate-400 text-sm">Uptime</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-white mb-2">HIPAA</div>
        <div className="text-slate-400 text-sm">Compliant</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-white mb-2">24/7</div>
        <div className="text-slate-400 text-sm">Support</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-white mb-2">Free</div>
        <div className="text-slate-400 text-sm">Trial</div>
      </div>
    </div>
  </div>
</div>
      </section >
    </div >
  );
};

export default Home; 
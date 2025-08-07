import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarCheck, FaSearch, FaShieldAlt, FaBell,
  FaUsers, FaUserMd, FaStethoscope, FaHeart,
  FaLightbulb, FaLock, FaEnvelope, FaArrowRight,
  FaQuoteLeft, FaAward, FaGlobe, FaClock
} from 'react-icons/fa';

const About = () => {
  const features = [
    {
      title: 'Easy Appointment Booking',
      description: 'Book appointments with your preferred doctors in just a few clicks',
      icon: FaCalendarCheck,
    },
    {
      title: 'Find the Right Doctor',
      description: 'Search and filter doctors by specialty, experience, and patient reviews',
      icon: FaSearch,
    },
    {
      title: 'Secure Health Records',
      description: 'Your medical information is stored securely and accessible only to authorized personnel',
      icon: FaShieldAlt,
    },
    {
      title: 'Smart Reminders',
      description: 'Get timely notifications about your upcoming appointments and medical schedules',
      icon: FaBell,
    },
  ];

  const values = [
    {
      title: 'Patient-Centric',
      description: 'We put patients first in everything we do, ensuring their comfort, convenience, and care are our top priorities.',
      icon: FaHeart,
    },
    {
      title: 'Innovation',
      description: 'We continuously improve our platform with the latest technology to provide the best possible healthcare experience.',
      icon: FaLightbulb,
    },
    {
      title: 'Trust & Security',
      description: 'We maintain the highest standards of data security and privacy to protect our users\' sensitive medical information.',
      icon: FaLock,
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Registered Patients' },
    { number: '500+', label: 'Expert Doctors' },
    { number: '50+', label: 'Specialties' },
    { number: '98%', label: 'Patient Satisfaction' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <FaStethoscope className="w-3 h-3" />
              About Our Platform
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">MedDesk</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transforming healthcare access through technology. Making it easier for patients to connect with healthcare providers and manage their medical appointments.
            </p>

            {/* Mission Statement */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaQuoteLeft className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-lg text-slate-200 leading-relaxed">
                To provide a seamless and efficient healthcare appointment booking experience that benefits both patients and healthcare providers, making quality healthcare accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaAward className="w-3 h-3" />
              Platform Features
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Key <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">Features</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover the powerful features that make MedDesk the preferred choice for healthcare management
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
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
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-8 h-8 text-blue-600 group-hover:text-teal-600 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-xl group-hover:from-blue-300/30 group-hover:to-teal-300/30 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-teal-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Our platform continues to grow and serve healthcare professionals and patients worldwide
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 font-medium text-lg">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-teal-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaHeart className="w-3 h-3" />
              Our Core Values
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">Stand For</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Our values guide everything we do and shape the way we serve our community
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full">
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                        <value.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-white mb-4 transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-slate-600 group-hover:text-white/90 leading-relaxed transition-colors duration-300">
                      {value.description}
                    </p>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-xl group-hover:from-white/10 group-hover:to-white/10 transition-all duration-500"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-teal-200/20 to-blue-200/20 rounded-full blur-xl group-hover:from-white/10 group-hover:to-white/10 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center text-white">
            {/* Section Header */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FaEnvelope className="w-3 h-3" />
                Get In Touch
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Connect?</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
                Have questions about MedDesk? Our team is here to help you get started on your healthcare journey.
              </p>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                <FaEnvelope className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Email Support</h3>
                <p className="text-slate-300 mb-4">Get help via email</p>
                <a href="mailto:support@meddesk.com" className="text-blue-400 hover:text-teal-400 transition-colors">
                  support@meddesk.com
                </a>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                <FaClock className="w-8 h-8 text-teal-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                <p className="text-slate-300 mb-4">We're always here</p>
                <span className="text-teal-400">Round the clock assistance</span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                <FaGlobe className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Global Reach</h3>
                <p className="text-slate-300 mb-4">Worldwide coverage</p>
                <span className="text-blue-400">Available everywhere</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-10 py-5 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
            >
              <FaEnvelope className="w-5 h-5" />
              Contact Our Team
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
export default About;
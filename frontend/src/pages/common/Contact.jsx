import { useState } from 'react';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock,
  FaChevronDown, FaChevronUp, FaFacebook, FaTwitter,
  FaLinkedin, FaInstagram, FaPaperPlane, FaComments,
  FaHeadset, FaGlobe, FaArrowRight, FaQuoteLeft,
  FaCheckCircle, FaUser, FaBuilding
} from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: 'patient'
  });

  const [activeTab, setActiveTab] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Phone',
      details: [
        { label: 'General Inquiries', value: '+1 (555) 123-4567' },
        { label: 'Technical Support', value: '+1 (555) 987-6543' }
      ]
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: [
        { label: 'Support', value: 'support@meddesk.com' },
        { label: 'Business', value: 'business@meddesk.com' }
      ]
    },
    {
      icon: FaClock,
      title: 'Hours',
      details: [
        { label: 'Monday - Friday', value: '9:00 AM - 8:00 PM EST' },
        { label: 'Weekend', value: '10:00 AM - 6:00 PM EST' }
      ]
    }
  ];

  const offices = [
    {
      city: 'New York',
      address: '123 Healthcare Ave, Suite 100, New York, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'nyc@meddesk.com'
    },
    {
      city: 'San Francisco',
      address: '456 Medical Plaza, Floor 4, San Francisco, CA 94105',
      phone: '+1 (555) 987-6543',
      email: 'sf@meddesk.com'
    }
  ];

  const faqs = {
    general: [
      {
        question: 'How do I schedule an appointment?',
        answer: 'You can schedule an appointment through our platform by logging in, selecting your preferred doctor, and choosing an available time slot. The process is simple and takes just a few minutes.'
      },
      {
        question: 'What should I do if I need to cancel my appointment?',
        answer: 'You can cancel your appointment through your patient dashboard up to 24 hours before the scheduled time. Late cancellations may incur a fee.'
      },
      {
        question: 'Is my medical information secure?',
        answer: 'Yes, we take data security very seriously. Our platform is HIPAA-compliant and uses state-of-the-art encryption to protect your medical information.'
      }
    ],
    technical: [
      {
        question: 'How do I reset my password?',
        answer: 'Click the "Forgot Password" link on the login page, enter your email address, and follow the instructions sent to your inbox.'
      },
      {
        question: 'What browsers are supported?',
        answer: 'MedDesk works best with the latest versions of Chrome, Firefox, Safari, and Edge.'
      },
      {
        question: 'Is there a mobile app available?',
        answer: 'Yes, our mobile app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store.'
      }
    ],
    billing: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and HSA/FSA cards for payment.'
      },
      {
        question: 'How do I update my billing information?',
        answer: 'You can update your billing information in your account settings under the "Billing" tab.'
      },
      {
        question: 'Are there any subscription fees?',
        answer: 'Basic patient accounts are free. Healthcare providers have different subscription tiers with varying features.'
      }
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden flex items-center">
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
              <FaComments className="w-3 h-3" />
              Get In Touch
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Us</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're here to help you every step of the way. Reach out with any questions, concerns, or feedback.
            </p>

            {/* Quick Contact Options */}
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="mailto:support@meddesk.com"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <FaEnvelope className="w-5 h-5" />
                Email Support
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>

              <a
                href="tel:+15551234567"
                className="group inline-flex items-center gap-3 border-2 border-slate-500 text-white px-8 py-4 rounded-2xl font-semibold hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaPhone className="w-5 h-5" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaHeadset className="w-3 h-3" />
              Contact Information
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Multiple Ways to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">Reach Us</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the method that works best for you. We're available through multiple channels to assist you.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden text-center">
                  {/* Gradient Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-teal-600"></div>

                  {/* Hover Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <info.icon className="w-8 h-8 text-blue-600 group-hover:text-teal-600 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 group-hover:text-blue-600 transition-colors duration-300">
                      {info.title}
                    </h3>

                    {/* Details */}
                    <div className="space-y-4">
                      {info.details.map((detail, i) => (
                        <div key={i} className="text-slate-600">
                          <p className="font-semibold text-slate-900 mb-1">{detail.label}</p>
                          <p className="text-lg">{detail.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-xl group-hover:from-blue-300/30 group-hover:to-teal-300/30 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-teal-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-teal-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaPaperPlane className="w-3 h-3" />
              Send Message
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">Touch</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Have a question or need assistance? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          {/* Contact Form Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Gradient Accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-teal-600"></div>

            {/* Form Content */}
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-3">
                      Your Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-slate-900 placeholder-slate-400"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-slate-900 placeholder-slate-400"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* User Type */}
                <div className="group">
                  <label htmlFor="userType" className="block text-sm font-semibold text-slate-900 mb-3">
                    I am a
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-slate-900 appearance-none bg-white"
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Healthcare Provider</option>
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Subject */}
                <div className="group">
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-900 mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-slate-900 placeholder-slate-400"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                {/* Message */}
                <div className="group">
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-3">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-slate-900 placeholder-slate-400 resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="group w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex items-center justify-center gap-3"
                  >
                    <FaPaperPlane className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-teal-200/20 to-blue-200/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaQuoteLeft className="w-3 h-3" />
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">Questions</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our platform and services
            </p>
          </div>

          {/* FAQ Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-200">
              <div className="flex space-x-2">
                {['general', 'technical', 'billing'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs[activeTab].map((faq, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 transition-all duration-300"
                >
                  <span className="font-semibold text-slate-900 text-lg pr-4">{faq.question}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 flex items-center justify-center transition-all duration-300 ${expandedFaq === index ? 'rotate-180 bg-gradient-to-r from-blue-600 to-teal-600' : ''
                    }`}>
                    {expandedFaq === index ? (
                      <FaChevronUp className={`w-4 h-4 ${expandedFaq === index ? 'text-white' : 'text-blue-600'}`} />
                    ) : (
                      <FaChevronDown className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </button>
                {expandedFaq === index && (
                  <div className="px-8 pb-6">
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-slate-600 leading-relaxed text-lg">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-teal-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-teal-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaBuilding className="w-3 h-3" />
              Office Locations
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Visit Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">Offices</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Find us in major cities across the country. We're here to serve you with personalized healthcare solutions.
            </p>
          </div>

          {/* Office Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offices.map((office, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  {/* Gradient Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-teal-600"></div>

                  {/* Hover Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* City Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FaBuilding className="w-6 h-6 text-blue-600 group-hover:text-teal-600 transition-colors duration-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        {office.city}
                      </h3>
                    </div>

                    {/* Office Details */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                          <FaMapMarkerAlt className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 mb-1">Address</p>
                          <p className="text-slate-600 leading-relaxed">{office.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FaPhone className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 mb-1">Phone</p>
                          <a href={`tel:${office.phone}`} className="text-slate-600 hover:text-blue-600 transition-colors duration-300">
                            {office.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FaEnvelope className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 mb-1">Email</p>
                          <a href={`mailto:${office.email}`} className="text-slate-600 hover:text-blue-600 transition-colors duration-300">
                            {office.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Visit Button */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <button className="group/btn w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-2xl font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        Get Directions
                        <FaArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-xl group-hover:from-blue-300/30 group-hover:to-teal-300/30 transition-all duration-500"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-teal-200/20 to-blue-200/20 rounded-full blur-xl group-hover:from-teal-300/30 group-hover:to-blue-300/30 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
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
                <FaGlobe className="w-3 h-3" />
                Stay Connected
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Follow Us on <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Social Media</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
                Stay updated with the latest healthcare news, tips, and platform updates by following us on social media.
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6 mb-12">
              {[
                { Icon: FaFacebook, name: 'Facebook', color: 'hover:bg-blue-600' },
                { Icon: FaTwitter, name: 'Twitter', color: 'hover:bg-sky-500' },
                { Icon: FaLinkedin, name: 'LinkedIn', color: 'hover:bg-blue-700' },
                { Icon: FaInstagram, name: 'Instagram', color: 'hover:bg-pink-600' }
              ].map(({ Icon, name, color }, index) => (
                <a
                  key={index}
                  href="#"
                  className={`group w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-2 hover:scale-110 ${color}`}
                  aria-label={`Follow us on ${name}`}
                >
                  <Icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Stay in the Loop</h3>
              <p className="text-slate-300 mb-6">
                Subscribe to our newsletter for healthcare tips, platform updates, and exclusive content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300"
                  />
                </div>
                <button className="group bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2">
                  Subscribe
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Contact Summary */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <FaCheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Quick Response</h4>
                <p className="text-slate-300 text-sm">We respond to all inquiries within 24 hours</p>
              </div>
              <div className="text-center">
                <FaHeadset className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Expert Support</h4>
                <p className="text-slate-300 text-sm">Our team of healthcare experts is here to help</p>
              </div>
              <div className="text-center">
                <FaGlobe className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Global Reach</h4>
                <p className="text-slate-300 text-sm">Serving patients and providers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 
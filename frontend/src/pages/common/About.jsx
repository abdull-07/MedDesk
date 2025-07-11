import React from 'react';

const About = () => {
  const features = [
    {
      title: 'Easy Appointment Booking',
      description: 'Book appointments with your preferred doctors in just a few clicks',
      icon: (
        <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Find the Right Doctor',
      description: 'Search and filter doctors by specialty, experience, and patient reviews',
      icon: (
        <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      title: 'Secure Health Records',
      description: 'Your medical information is stored securely and accessible only to authorized personnel',
      icon: (
        <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: 'Smart Reminders',
      description: 'Get timely notifications about your upcoming appointments and medical schedules',
      icon: (
        <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Registered Patients' },
    { number: '500+', label: 'Expert Doctors' },
    { number: '50+', label: 'Specialties' },
    { number: '98%', label: 'Patient Satisfaction' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#E5F6F8] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#1D3557] sm:text-5xl md:text-6xl">
              About MedDesk
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-[#457B9D] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Transforming healthcare access through technology. Making it easier for patients
              to connect with healthcare providers and manage their medical appointments.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1D3557] sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-[#457B9D]">
              To provide a seamless and efficient healthcare appointment booking experience
              that benefits both patients and healthcare providers.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1D3557] sm:text-4xl mb-16">
              Key Features
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#E5F6F8] rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white rounded-full p-3">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-medium text-[#1D3557] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#457B9D]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#006D77] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-white mb-2">{stat.number}</p>
                <p className="text-[#E5F6F8]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1D3557] sm:text-4xl mb-8">
              Our Values
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-medium text-[#1D3557] mb-4">
                  Patient-Centric
                </h3>
                <p className="text-[#457B9D]">
                  We put patients first in everything we do, ensuring their comfort,
                  convenience, and care are our top priorities.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-medium text-[#1D3557] mb-4">
                  Innovation
                </h3>
                <p className="text-[#457B9D]">
                  We continuously improve our platform with the latest technology to
                  provide the best possible healthcare experience.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-medium text-[#1D3557] mb-4">
                  Trust & Security
                </h3>
                <p className="text-[#457B9D]">
                  We maintain the highest standards of data security and privacy to
                  protect our users' sensitive medical information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-[#E5F6F8] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1D3557] sm:text-4xl mb-8">
              Get in Touch
            </h2>
            <p className="text-xl text-[#457B9D] mb-8">
              Have questions about MedDesk? We're here to help!
            </p>
            <a
              href="mailto:support@meddesk.com"
              className="inline-block bg-[#006D77] text-white px-8 py-3 rounded-lg hover:bg-[#005c66] transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 
import { Link } from 'react-router-dom';
import {
  FaFileContract,
  FaUserCheck,
  FaStethoscope,
  FaCalendarCheck,
  FaUsers,
  FaUserMd,
  FaCreditCard,
  FaShieldAlt,
  FaCopyright,
  FaExclamationTriangle,
  FaEdit,
  FaBan,
  FaEnvelope,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';

const Terms = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: FaFileContract,
      color: 'from-blue-600 to-blue-700',
      content: `By accessing and using MedDesk's services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.`
    },
    {
      title: 'Service Description',
      icon: FaStethoscope,
      color: 'from-teal-600 to-teal-700',
      content: `MedDesk provides an online platform for scheduling medical appointments and managing healthcare-related services. Our platform connects patients with healthcare providers, facilitating appointment booking, medical record management, and related healthcare services.`
    },
    {
      title: 'User Registration',
      icon: FaUserCheck,
      color: 'from-green-600 to-green-700',
      subsections: [
        {
          subtitle: 'Account Creation',
          content: 'Users must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials.'
        },
        {
          subtitle: 'Account Types',
          content: 'We offer different account types for patients and healthcare providers. Each account type has specific terms and requirements.'
        }
      ]
    },
    {
      title: 'Appointment Booking',
      icon: FaCalendarCheck,
      color: 'from-purple-600 to-purple-700',
      subsections: [
        {
          subtitle: 'Booking Process',
          content: 'Users can book appointments through our platform subject to healthcare provider availability. Confirmation is required from both parties.'
        },
        {
          subtitle: 'Cancellation Policy',
          content: 'Appointments can be cancelled or rescheduled up to 24 hours before the scheduled time. Late cancellations may incur fees as determined by the healthcare provider.'
        }
      ]
    },
    {
      title: 'User Responsibilities',
      icon: FaUsers,
      color: 'from-indigo-600 to-indigo-700',
      content: [
        'Provide accurate information',
        'Maintain account security',
        'Comply with appointment policies',
        'Respect healthcare providers\' time',
        'Not misuse or abuse the platform',
        'Report any security concerns promptly'
      ]
    },
    {
      title: 'Healthcare Provider Terms',
      icon: FaUserMd,
      color: 'from-cyan-600 to-cyan-700',
      content: [
        'Maintain valid licenses and credentials',
        'Provide accurate availability information',
        'Respond to appointment requests promptly',
        'Maintain professional standards',
        'Comply with healthcare regulations'
      ]
    },
    {
      title: 'Payment Terms',
      icon: FaCreditCard,
      color: 'from-orange-600 to-orange-700',
      content: 'Payment processing is handled securely through our platform. Fees may apply for certain services, late cancellations, or no-shows. All fees will be clearly communicated before confirmation.'
    },
    {
      title: 'Privacy and Data Protection',
      icon: FaShieldAlt,
      color: 'from-emerald-600 to-emerald-700',
      content: `We are committed to protecting your privacy and personal data. Our handling of your information is governed by our Privacy Policy, which you can review `,
      link: {
        text: 'here',
        url: '/privacy'
      }
    },
    {
      title: 'Intellectual Property',
      icon: FaCopyright,
      color: 'from-pink-600 to-pink-700',
      content: 'All content, features, and functionality of the MedDesk platform are owned by MedDesk and protected by international copyright, trademark, and other intellectual property laws.'
    },
    {
      title: 'Limitation of Liability',
      icon: FaExclamationTriangle,
      color: 'from-yellow-600 to-yellow-700',
      content: 'MedDesk serves as a platform connecting users with healthcare providers. We are not responsible for the quality of medical care, medical advice, or treatment provided by healthcare providers.'
    },
    {
      title: 'Modifications to Terms',
      icon: FaEdit,
      color: 'from-violet-600 to-violet-700',
      content: 'We reserve the right to modify these terms at any time. Users will be notified of significant changes. Continued use of the platform after changes constitutes acceptance of new terms.'
    },
    {
      title: 'Termination',
      icon: FaBan,
      color: 'from-red-600 to-red-700',
      content: 'We reserve the right to terminate or suspend accounts that violate these terms or for any other reason at our discretion. Users may terminate their accounts at any time.'
    }
  ];

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
              <FaFileContract className="w-3 h-3" />
              Legal Terms
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Conditions</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services. Your use of MedDesk constitutes acceptance of these terms.
            </p>

            {/* Last Updated */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-slate-300">
                <FaClock className="w-4 h-4" />
                <span className="text-sm">Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section >

  {/* Content Section */ }
  < section className = "py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden" >
    {/* Background Elements */ }
    < div className = "absolute inset-0" >
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-30"></div>
        </div >

  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    {/* Introduction */}
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <FaInfoCircle className="w-3 h-3" />
        Important Information
      </div>
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 max-w-4xl mx-auto">
        <p className="text-xl text-slate-700 leading-relaxed">
          Welcome to MedDesk. These Terms and Conditions govern your use of our platform and services.
          Please read these terms carefully before using our services.
        </p>
      </div>
    </div>

    {/* Terms Sections */}
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div
          key={index}
          className="group relative bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
        >
          {/* Gradient Accent */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${section.color}`}></div>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                  {section.title}
                </h2>
              </div>
            </div>

            {/* Content */}
            {section.subsections ? (
              <div className="space-y-6 pl-16">
                {section.subsections.map((subsection, subIndex) => (
                  <div key={subIndex} className="border-l-2 border-slate-200 pl-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {subsection.subtitle}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {subsection.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pl-16">
                {Array.isArray(section.content) ? (
                  <div className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mt-0.5">
                          <FaCheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-600 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-600 leading-relaxed text-lg">
                    {section.content}
                    {section.link && (
                      <Link
                        to={section.link.url}
                        className="text-blue-600 hover:text-teal-600 font-semibold transition-colors duration-300 underline decoration-2 underline-offset-2"
                      >
                        {section.link.text}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-xl group-hover:from-blue-300/30 group-hover:to-teal-300/30 transition-all duration-500"></div>
        </div>
      ))}
    </div>

    {/* Contact Section */}
    <div className="mt-20">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}></div>

      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <FaEnvelope className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Questions About Our Terms?</h2>
        </div>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
          If you have any questions about these terms or our services, our legal team is here to help clarify any concerns you may have.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <FaEnvelope className="w-5 h-5" />
            Contact Legal Team
            <FaArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="mailto:legal@meddesk.com"
            className="inline-flex items-center gap-3 border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
          >
            <FaEnvelope className="w-5 h-5" />
            legal@meddesk.com
          </a>
        </div>
      </div>
    </div>
  </div>
        </div >
      </section >
    </div >
  );
};

export default Terms; 
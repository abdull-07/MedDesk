import { Link } from 'react-router-dom';
import {
  FaShieldAlt,
  FaInfoCircle,
  FaDatabase,
  FaUserCheck,
  FaHospital,
  FaShare,
  FaLock,
  FaUserShield,
  FaCookie,
  FaChild,
  FaGlobe,
  FaEdit,
  FaEnvelope,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
  FaEye,
  FaUserCog,
  FaFileAlt
} from 'react-icons/fa';

const Privacy = () => {
  const sections = [
    {
      title: 'Introduction',
      icon: FaInfoCircle,
      color: 'from-blue-600 to-blue-700',
      content: `At MedDesk, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. By using our service, you consent to the practices described in this policy.`
    },
    {
      title: 'Information We Collect',
      icon: FaDatabase,
      color: 'from-teal-600 to-teal-700',
      subsections: [
        {
          subtitle: 'Personal Information',
          content: [
            'Name and contact information',
            'Date of birth and gender',
            'Medical history and conditions',
            'Insurance information',
            'Payment details',
            'Emergency contact information'
          ]
        },
        {
          subtitle: 'Usage Information',
          content: [
            'Browser and device information',
            'IP address and location data',
            'Pages visited and features used',
            'Time spent on platform',
            'Appointment history'
          ]
        }
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: FaUserCog,
      color: 'from-green-600 to-green-700',
      content: [
        'Provide and improve our services',
        'Process appointments and payments',
        'Send appointment reminders and notifications',
        'Communicate about your account',
        'Analyze and improve platform performance',
        'Comply with legal obligations',
        'Protect against fraud and abuse'
      ]
    },
    {
      title: 'HIPAA Compliance',
      icon: FaHospital,
      color: 'from-purple-600 to-purple-700',
      content: `As a healthcare platform, we comply with the Health Insurance Portability and Accountability Act (HIPAA). We implement appropriate security measures to protect your health information and maintain compliance with federal regulations.`
    },
    {
      title: 'Information Sharing',
      icon: FaShare,
      color: 'from-indigo-600 to-indigo-700',
      content: [
        'Healthcare providers you choose',
        'Third-party service providers (with appropriate safeguards)',
        'Legal authorities when required by law',
        'Business partners with your explicit consent'
      ]
    },
    {
      title: 'Data Security',
      icon: FaLock,
      color: 'from-cyan-600 to-cyan-700',
      content: [
        'Encryption of sensitive data',
        'Regular security audits',
        'Access controls and authentication',
        'Secure data storage',
        'Employee training on privacy practices'
      ]
    },
    {
      title: 'Your Rights',
      icon: FaUserShield,
      color: 'from-orange-600 to-orange-700',
      content: [
        'Access your personal information',
        'Request corrections to your data',
        'Delete your account',
        'Opt-out of communications',
        'Request data portability',
        'File a privacy complaint'
      ]
    },
    {
      title: 'Cookies and Tracking',
      icon: FaCookie,
      color: 'from-emerald-600 to-emerald-700',
      content: 'We use cookies and similar tracking technologies to improve your experience on our platform. You can control cookie settings through your browser preferences.'
    },
    {
      title: "Children's Privacy",
      icon: FaChild,
      color: 'from-pink-600 to-pink-700',
      content: 'We do not knowingly collect information from children under 13. Parents or guardians can manage health information for minors through their accounts.'
    },
    {
      title: 'International Data Transfers',
      icon: FaGlobe,
      color: 'from-violet-600 to-violet-700',
      content: 'Your information may be transferred and processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers.'
    },
    {
      title: 'Changes to Privacy Policy',
      icon: FaEdit,
      color: 'from-yellow-600 to-yellow-700',
      content: 'We may update this privacy policy periodically. We will notify you of significant changes through our platform or via email.'
    },
    {
      title: 'Contact Information',
      icon: FaEnvelope,
      color: 'from-red-600 to-red-700',
      content: 'For privacy-related questions or concerns, please contact our Privacy Officer at privacy@meddesk.com or through our ',
      link: {
        text: 'contact page',
        url: '/contact'
      }
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-8 relative min-h-[70vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden flex items-center">
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
              <FaShieldAlt className="w-3 h-3" />
              Privacy & Security
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Policy</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your privacy is our priority. Learn how we protect, collect, and use your information to provide the best healthcare experience.
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
      </section>

      {/* Content Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Introduction */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaEye className="w-3 h-3" />
              Privacy Overview
            </div>
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 max-w-4xl mx-auto">
              <p className="text-xl text-slate-700 leading-relaxed">
                Your privacy is important to us. This Privacy Policy outlines our practices regarding the collection,
                use, and disclosure of your information through the MedDesk platform.
              </p>
            </div>
          </div>

          {/* Privacy Sections */}
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
                          <h3 className="text-xl font-semibold text-slate-900 mb-4">
                            {subsection.subtitle}
                          </h3>
                          <div className="space-y-3">
                            {subsection.content.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mt-0.5">
                                  <FaCheckCircle className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-slate-600 leading-relaxed">{item}</span>
                              </div>
                            ))}
                          </div>
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
                  <FaUserShield className="w-8 h-8" />
                  <h2 className="text-3xl font-bold">Privacy Questions?</h2>
                </div>
                <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                  If you have any questions about our privacy practices or would like to exercise your privacy rights,
                  our privacy team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                  >
                    <FaEnvelope className="w-5 h-5" />
                    Contact Privacy Team
                    <FaArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="mailto:privacy@meddesk.com"
                    className="inline-flex items-center gap-3 border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FaEnvelope className="w-5 h-5" />
                    privacy@meddesk.com
                  </a>
                </div>

                {/* Privacy Rights Summary */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <FaEye className="w-6 h-6 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Access Your Data</h4>
                    <p className="text-blue-100 text-sm">Request a copy of your personal information</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <FaEdit className="w-6 h-6 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Update Information</h4>
                    <p className="text-blue-100 text-sm">Correct or update your personal data</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <FaFileAlt className="w-6 h-6 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Data Portability</h4>
                    <p className="text-blue-100 text-sm">Export your data in a portable format</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy; 
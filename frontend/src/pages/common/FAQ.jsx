import { useState } from 'react';
import {
  FaChevronDown, FaChevronUp, FaSearch, FaQuestionCircle, FaHospital, FaCalendarCheck, FaUserMd,
  FaLaptop, FaCreditCard, FaEnvelope, FaPhone, FaComments, FaArrowRight, FaLightbulb, FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const FAQ = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const faqCategories = {
    general: {
      title: 'General Questions',
      icon: FaHospital,
      color: 'from-blue-600 to-blue-700',
      faqs: [
        {
          question: 'What is MedDesk?',
          answer: 'MedDesk is a comprehensive healthcare appointment scheduling platform that connects patients with verified healthcare providers. Our platform simplifies the process of finding and booking medical appointments.',
          type: 'info'
        },
        {
          question: 'How do I schedule an appointment?',
          answer: 'To schedule an appointment, simply log in to your account, search for your preferred doctor or specialty, select an available time slot, and confirm your booking. You\'ll receive an immediate confirmation via email.',
          type: 'success'
        },
        {
          question: 'Can I cancel or reschedule my appointment?',
          answer: 'Yes, you can cancel or reschedule appointments through your dashboard up to 24 hours before the scheduled time. Late cancellations may incur a fee as per our cancellation policy.',
          type: 'warning'
        },
        {
          question: 'Is my medical information secure?',
          answer: 'Yes, we take data security very seriously. Our platform is HIPAA-compliant and uses state-of-the-art encryption to protect your medical information. We never share your data without your explicit consent.',
          type: 'success'
        }
      ]
    },
    appointments: {
      title: 'Appointments',
      icon: FaCalendarCheck,
      color: 'from-teal-600 to-teal-700',
      faqs: [
        {
          question: 'How far in advance can I book an appointment?',
          answer: 'You can book appointments up to 3 months in advance, depending on the healthcare provider\'s availability.',
          type: 'info'
        },
        {
          question: 'What happens if I miss my appointment?',
          answer: 'Missed appointments without prior cancellation may incur a fee. Please contact your healthcare provider\'s office directly to discuss their specific policies.',
          type: 'warning'
        },
        {
          question: 'Do I need to arrive early for my appointment?',
          answer: 'Yes, we recommend arriving 15 minutes before your scheduled appointment time to complete any necessary paperwork or check-in procedures.',
          type: 'info'
        },
        {
          question: 'Can I book appointments for family members?',
          answer: 'Yes, you can add family members to your account and manage their appointments. You\'ll need to provide their basic information and consent.',
          type: 'success'
        }
      ]
    },
    doctors: {
      title: 'Healthcare Providers',
      icon: FaUserMd,
      color: 'from-green-600 to-green-700',
      faqs: [
        {
          question: 'How are doctors verified on MedDesk?',
          answer: 'All healthcare providers undergo a thorough verification process, including license verification, background checks, and credential validation.',
          type: 'success'
        },
        {
          question: 'Can I choose my preferred doctor?',
          answer: 'Yes, you can search for specific doctors, browse by specialty, or filter by various criteria like location, availability, and patient ratings.',
          type: 'info'
        },
        {
          question: 'What specialties are available?',
          answer: 'We offer access to a wide range of specialties including but not limited to Primary Care, Pediatrics, Cardiology, Dermatology, and more.',
          type: 'info'
        }
      ]
    },
    technical: {
      title: 'Technical Support',
      icon: FaLaptop,
      color: 'from-purple-600 to-purple-700',
      faqs: [
        {
          question: 'How do I reset my password?',
          answer: 'Click the "Forgot Password" link on the login page, enter your email address, and follow the instructions sent to your inbox.',
          type: 'info'
        },
        {
          question: 'Which browsers are supported?',
          answer: 'MedDesk works best with the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.',
          type: 'info'
        },
        {
          question: 'Is there a mobile app available?',
          answer: 'Yes, our mobile app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store.',
          type: 'success'
        }
      ]
    },
    billing: {
      title: 'Billing & Insurance',
      icon: FaCreditCard,
      color: 'from-orange-600 to-orange-700',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, PayPal, and HSA/FSA cards for payment.',
          type: 'info'
        },
        {
          question: 'Do you accept insurance?',
          answer: 'Insurance coverage depends on individual healthcare providers. You can filter doctors by insurance networks and verify coverage during booking.',
          type: 'info'
        },
        {
          question: 'Are there any booking fees?',
          answer: 'Basic appointment booking is free. Some providers may charge consultation fees or require deposits, which will be clearly indicated during booking.',
          type: 'success'
        }
      ]
    }
  };

  const filterFaqs = (query) => {
    if (!query) return faqCategories;

    const filtered = {};
    Object.entries(faqCategories).forEach(([category, data]) => {
      const matchingFaqs = data.faqs.filter(
        faq =>
          faq.question.toLowerCase().includes(query.toLowerCase()) ||
          faq.answer.toLowerCase().includes(query.toLowerCase())
      );
      if (matchingFaqs.length > 0) {
        filtered[category] = {
          ...data,
          faqs: matchingFaqs
        };
      }
    });
    return filtered;
  };

  const filteredCategories = filterFaqs(searchQuery);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return FaCheckCircle;
      case 'warning':
        return FaExclamationTriangle;
      case 'info':
      default:
        return FaLightbulb;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
      default:
        return 'text-blue-500';
    }
  };

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
              <FaQuestionCircle className="w-3 h-3" />
              Help Center
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Questions</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Find quick answers to common questions about MedDesk. Can't find what you're looking for? We're here to help.
            </p>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-1">
                  <div className="relative">
                    <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search frequently asked questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-transparent text-slate-900 placeholder-slate-500 focus:outline-none text-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Category Tabs */}
          <div className="flex justify-center mb-16">
            <div className="bg-white rounded-3xl p-2 shadow-xl border border-slate-200">
              <div className="flex flex-wrap justify-center gap-2">
                {Object.entries(filteredCategories).map(([category, data]) => {
                  const isActive = activeTab === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveTab(category)}
                      className={`group relative flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${isActive
                        ? `bg-gradient-to-r ${data.color} text-white shadow-lg transform scale-105`
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                        ? 'bg-white/20'
                        : 'bg-slate-100 group-hover:bg-slate-200'
                        }`}>
                        <data.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'
                          }`} />
                      </div>
                      <span className="text-sm">{data.title}</span>
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FAQ Items */}
          {filteredCategories[activeTab] && (
            <div className="max-w-4xl mx-auto space-y-6">
              {filteredCategories[activeTab].faqs.map((faq, index) => {
                const isExpanded = expandedFaq === index;
                const TypeIcon = getTypeIcon(faq.type);
                const typeColor = getTypeColor(faq.type);

                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Gradient Accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${filteredCategories[activeTab].color}`}></div>

                    {/* Question Button */}
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : index)}
                      className="w-full p-8 text-left flex items-start justify-between hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-teal-50/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        {/* Type Icon */}
                        <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <TypeIcon className={`w-5 h-5 ${typeColor}`} />
                        </div>

                        {/* Question Text */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 leading-relaxed">
                            {faq.question}
                          </h3>
                        </div>
                      </div>

                      {/* Chevron */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-teal-600 flex items-center justify-center transition-all duration-300 ml-4 ${isExpanded ? 'rotate-180 bg-gradient-to-r from-blue-600 to-teal-600' : ''
                        }`}>
                        <FaChevronDown className={`w-4 h-4 transition-colors duration-300 ${isExpanded ? 'text-white' : 'text-slate-600 group-hover:text-white'
                          }`} />
                      </div>
                    </button>

                    {/* Answer */}
                    {isExpanded && (
                      <div className="px-8 pb-8">
                        <div className="pl-14 pt-4 border-t border-slate-100">
                          <p className="text-slate-700 leading-relaxed text-lg">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-xl group-hover:from-blue-300/30 group-hover:to-teal-300/30 transition-all duration-500"></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help Section */}
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
                <FaComments className="w-3 h-3" />
                Need More Help?
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Still Have <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Questions?</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">help you with any questions or concerns you may have.
              </p>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                Can't find what you're lookingdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
                <FaEnvelope className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Email Support</h3>
                <p className="text-slate-300 mb-4">Get help via email</p>
                <a href="mailto:support@meddesk.com" className="text-blue-400 hover:text-teal-400 transition-colors">
                  support@meddesk.com
                </a>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                <FaPhone className="w-8 h-8 text-teal-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Phone Support</h3>
                <p className="text-slate-300 mb-4">Call us directly</p>
                <a href="tel:+15551234567" className="text-teal-400 hover:text-blue-400 transition-colors">
                  +1 (555) 123-4567
                </a>
              </div>

              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                {/* Coming Soon Badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                  Coming Soon
                </div>
                <FaComments className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                <p className="text-slate-300 mb-4">Chat with our team</p>
                <span className="text-green-400">Available 24/7</span>
              </div>
            </div>

            {/* Main CTA */}
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="/contact"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-10 py-5 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
              >
                <FaEnvelope className="w-5 h-5" />
                Contact Support Team
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>

              <a
                href="tel:+15551234567"
                className="group inline-flex items-center gap-3 border-2 border-slate-500 text-white px-10 py-5 rounded-2xl font-bold hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300 transform hover:-translate-y-2"
              >
                <FaPhone className="w-5 h-5" />
                Call Now
              </a>
            </div>

            {/* Support Hours */}
            <div className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 max-w-2xl mx-auto">
              <h4 className="font-semibold mb-4">Support Hours</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                <div>
                  <strong className="text-white">Monday - Friday:</strong> 9:00 AM - 8:00 PM EST
                </div>
                <div>
                  <strong className="text-white">Weekend:</strong> 10:00 AM - 6:00 PM EST
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ; 
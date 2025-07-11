import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';

const FAQ = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = {
    general: {
      title: 'General Questions',
      icon: '🏥',
      faqs: [
        {
          question: 'What is MedDesk?',
          answer: 'MedDesk is a comprehensive healthcare appointment scheduling platform that connects patients with verified healthcare providers. Our platform simplifies the process of finding and booking medical appointments.'
        },
        {
          question: 'How do I schedule an appointment?',
          answer: 'To schedule an appointment, simply log in to your account, search for your preferred doctor or specialty, select an available time slot, and confirm your booking. You\'ll receive an immediate confirmation via email.'
        },
        {
          question: 'Can I cancel or reschedule my appointment?',
          answer: 'Yes, you can cancel or reschedule appointments through your dashboard up to 24 hours before the scheduled time. Late cancellations may incur a fee as per our cancellation policy.'
        },
        {
          question: 'Is my medical information secure?',
          answer: 'Yes, we take data security very seriously. Our platform is HIPAA-compliant and uses state-of-the-art encryption to protect your medical information. We never share your data without your explicit consent.'
        }
      ]
    },
    appointments: {
      title: 'Appointments',
      icon: '📅',
      faqs: [
        {
          question: 'How far in advance can I book an appointment?',
          answer: 'You can book appointments up to 3 months in advance, depending on the healthcare provider\'s availability.'
        },
        {
          question: 'What happens if I miss my appointment?',
          answer: 'Missed appointments without prior cancellation may incur a fee. Please contact your healthcare provider\'s office directly to discuss their specific policies.'
        },
        {
          question: 'Do I need to arrive early for my appointment?',
          answer: 'Yes, we recommend arriving 15 minutes before your scheduled appointment time to complete any necessary paperwork or check-in procedures.'
        },
        {
          question: 'Can I book appointments for family members?',
          answer: 'Yes, you can add family members to your account and manage their appointments. You\'ll need to provide their basic information and consent.'
        }
      ]
    },
    doctors: {
      title: 'Healthcare Providers',
      icon: '👨‍⚕️',
      faqs: [
        {
          question: 'How are doctors verified on MedDesk?',
          answer: 'All healthcare providers undergo a thorough verification process, including license verification, background checks, and credential validation.'
        },
        {
          question: 'Can I choose my preferred doctor?',
          answer: 'Yes, you can search for specific doctors, browse by specialty, or filter by various criteria like location, availability, and patient ratings.'
        },
        {
          question: 'What specialties are available?',
          answer: 'We offer access to a wide range of specialties including but not limited to Primary Care, Pediatrics, Cardiology, Dermatology, and more.'
        }
      ]
    },
    technical: {
      title: 'Technical Support',
      icon: '💻',
      faqs: [
        {
          question: 'How do I reset my password?',
          answer: 'Click the "Forgot Password" link on the login page, enter your email address, and follow the instructions sent to your inbox.'
        },
        {
          question: 'Which browsers are supported?',
          answer: 'MedDesk works best with the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.'
        },
        {
          question: 'Is there a mobile app available?',
          answer: 'Yes, our mobile app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store.'
        }
      ]
    },
    billing: {
      title: 'Billing & Insurance',
      icon: '💳',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, PayPal, and HSA/FSA cards for payment.'
        },
        {
          question: 'Do you accept insurance?',
          answer: 'Insurance coverage depends on individual healthcare providers. You can filter doctors by insurance networks and verify coverage during booking.'
        },
        {
          question: 'Are there any booking fees?',
          answer: 'Basic appointment booking is free. Some providers may charge consultation fees or require deposits, which will be clearly indicated during booking.'
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-[#006D77] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-[#83C5BE] mb-8">
              Find answers to common questions about MedDesk
            </p>
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-[#1D3557] pr-12 focus:outline-none focus:ring-2 focus:ring-[#83C5BE]"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#006D77]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(filteredCategories).map(([category, data]) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === category
                    ? 'bg-[#006D77] text-white shadow-lg'
                    : 'bg-[#E5F6F8] text-[#006D77] hover:bg-[#006D77] hover:text-white'
                }`}
              >
                <span>{data.icon}</span>
                <span>{data.title}</span>
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          {filteredCategories[activeTab] && (
            <div className="max-w-4xl mx-auto space-y-4">
              {filteredCategories[activeTab].faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-[#006D77] transition-colors duration-300"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#E5F6F8] transition-colors duration-300"
                  >
                    <span className="font-medium text-[#1D3557] pr-8">{faq.question}</span>
                    {expandedFaq === index ? (
                      <FaChevronUp className="text-[#006D77] flex-shrink-0" />
                    ) : (
                      <FaChevronDown className="text-[#006D77] flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 py-4 bg-[#E5F6F8]">
                      <p className="text-[#457B9D] leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-16 bg-[#E5F6F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#1D3557]">Still Need Help?</h2>
          <p className="text-[#457B9D] mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you with any questions you may have.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#006D77] text-white font-semibold hover:bg-[#005A63] transition-colors duration-300"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
};

export default FAQ; 
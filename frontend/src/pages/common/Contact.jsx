import { useState } from 'react';
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, 
  FaQuestionCircle, FaChevronDown, FaChevronUp,
  FaFacebook, FaTwitter, FaLinkedin, FaInstagram
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
      <section className="relative py-20 bg-[#006D77] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-[#83C5BE]">
              We're here to help. Reach out to us with any questions or concerns.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className="bg-[#E5F6F8] rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#006D77] text-white mb-6">
                  <info.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-[#1D3557]">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, i) => (
                    <div key={i} className="text-[#457B9D]">
                      <p className="font-medium">{detail.label}</p>
                      <p>{detail.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-[#E5F6F8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-3xl font-bold mb-8 text-[#1D3557] text-center">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#1D3557] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#006D77] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1D3557] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#006D77] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-[#1D3557] mb-2">
                  I am a
                </label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#006D77] focus:border-transparent"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#1D3557] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#006D77] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#1D3557] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#006D77] focus:border-transparent"
                  required
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-[#006D77] text-white py-4 rounded-lg font-semibold hover:bg-[#005A63] transition-colors duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-[#1D3557] text-center">
            Frequently Asked Questions
          </h2>

          {/* FAQ Tabs */}
          <div className="flex justify-center mb-8 space-x-4">
            {['general', 'technical', 'billing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 ${
                  activeTab === tab
                    ? 'bg-[#006D77] text-white'
                    : 'bg-[#E5F6F8] text-[#006D77] hover:bg-[#006D77] hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs[activeTab].map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#E5F6F8] transition-colors duration-300"
                >
                  <span className="font-medium text-[#1D3557]">{faq.question}</span>
                  {expandedFaq === index ? (
                    <FaChevronUp className="text-[#006D77]" />
                  ) : (
                    <FaChevronDown className="text-[#006D77]" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-[#E5F6F8]">
                    <p className="text-[#457B9D]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations Section */}
      <section className="py-20 bg-[#E5F6F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-[#1D3557] text-center">
            Our Offices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offices.map((office, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold mb-4 text-[#1D3557]">{office.city}</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="w-5 h-5 text-[#006D77] mt-1 mr-3" />
                    <p className="text-[#457B9D]">{office.address}</p>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="w-5 h-5 text-[#006D77] mr-3" />
                    <p className="text-[#457B9D]">{office.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="w-5 h-5 text-[#006D77] mr-3" />
                    <p className="text-[#457B9D]">{office.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 bg-[#006D77]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8 text-white">Connect With Us</h2>
            <div className="flex justify-center space-x-6">
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-[#006D77] transition-colors duration-300"
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 
import { Link } from 'react-router-dom';

const Privacy = () => {
  const sections = [
    {
      title: 'Introduction',
      content: `At MedDesk, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. By using our service, you consent to the practices described in this policy.`
    },
    {
      title: 'Information We Collect',
      subsections: [
        {
          subtitle: 'Personal Information',
          content: `• Name and contact information
• Date of birth and gender
• Medical history and conditions
• Insurance information
• Payment details
• Emergency contact information`
        },
        {
          subtitle: 'Usage Information',
          content: `• Browser and device information
• IP address and location data
• Pages visited and features used
• Time spent on platform
• Appointment history`
        }
      ]
    },
    {
      title: 'How We Use Your Information',
      content: `We use your information to:
      • Provide and improve our services
      • Process appointments and payments
      • Send appointment reminders and notifications
      • Communicate about your account
      • Analyze and improve platform performance
      • Comply with legal obligations
      • Protect against fraud and abuse`
    },
    {
      title: 'HIPAA Compliance',
      content: `As a healthcare platform, we comply with the Health Insurance Portability and Accountability Act (HIPAA). We implement appropriate security measures to protect your health information and maintain compliance with federal regulations.`
    },
    {
      title: 'Information Sharing',
      content: `We share your information only with:
      • Healthcare providers you choose
      • Third-party service providers (with appropriate safeguards)
      • Legal authorities when required by law
      • Business partners with your explicit consent`
    },
    {
      title: 'Data Security',
      content: `We implement robust security measures including:
      • Encryption of sensitive data
      • Regular security audits
      • Access controls and authentication
      • Secure data storage
      • Employee training on privacy practices`
    },
    {
      title: 'Your Rights',
      content: `You have the right to:
      • Access your personal information
      • Request corrections to your data
      • Delete your account
      • Opt-out of communications
      • Request data portability
      • File a privacy complaint`
    },
    {
      title: 'Cookies and Tracking',
      content: 'We use cookies and similar tracking technologies to improve your experience on our platform. You can control cookie settings through your browser preferences.'
    },
    {
      title: "Children's Privacy",
      content: 'We do not knowingly collect information from children under 13. Parents or guardians can manage health information for minors through their accounts.'
    },
    {
      title: 'International Data Transfers',
      content: 'Your information may be transferred and processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers.'
    },
    {
      title: 'Changes to Privacy Policy',
      content: 'We may update this privacy policy periodically. We will notify you of significant changes through our platform or via email.'
    },
    {
      title: 'Contact Information',
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
      <section className="relative py-20 bg-[#006D77] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-[#83C5BE]">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="prose max-w-none mb-16">
            <p className="text-lg text-[#457B9D] leading-relaxed">
              Your privacy is important to us. This Privacy Policy outlines our practices regarding the collection,
              use, and disclosure of your information through the MedDesk platform.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-gray-200 pb-8 last:border-0">
                <h2 className="text-2xl font-bold text-[#1D3557] mb-4">
                  {section.title}
                </h2>
                {section.subsections ? (
                  <div className="space-y-6">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex}>
                        <h3 className="text-xl font-semibold text-[#1D3557] mb-2">
                          {subsection.subtitle}
                        </h3>
                        <div className="text-[#457B9D] leading-relaxed whitespace-pre-line">
                          {subsection.content}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#457B9D] leading-relaxed whitespace-pre-line">
                    {section.content}
                    {section.link && (
                      <Link 
                        to={section.link.url}
                        className="text-[#006D77] hover:underline"
                      >
                        {section.link.text}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 p-8 bg-[#E5F6F8] rounded-xl">
            <h2 className="text-2xl font-bold text-[#1D3557] mb-4">
              Privacy Questions?
            </h2>
            <p className="text-[#457B9D] mb-6">
              If you have any questions about our privacy practices or would like to exercise your privacy rights,
              please don't hesitate to contact us.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#006D77] text-white font-semibold hover:bg-[#005A63] transition-colors duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy; 
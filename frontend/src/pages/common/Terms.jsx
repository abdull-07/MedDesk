import { Link } from 'react-router-dom';

const Terms = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing and using MedDesk's services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.`
    },
    {
      title: 'Service Description',
      content: `MedDesk provides an online platform for scheduling medical appointments and managing healthcare-related services. Our platform connects patients with healthcare providers, facilitating appointment booking, medical record management, and related healthcare services.`
    },
    {
      title: 'User Registration',
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
      content: `Users agree to:
      • Provide accurate information
      • Maintain account security
      • Comply with appointment policies
      • Respect healthcare providers' time
      • Not misuse or abuse the platform
      • Report any security concerns promptly`
    },
    {
      title: 'Healthcare Provider Terms',
      content: `Healthcare providers using our platform must:
      • Maintain valid licenses and credentials
      • Provide accurate availability information
      • Respond to appointment requests promptly
      • Maintain professional standards
      • Comply with healthcare regulations`
    },
    {
      title: 'Payment Terms',
      content: 'Payment processing is handled securely through our platform. Fees may apply for certain services, late cancellations, or no-shows. All fees will be clearly communicated before confirmation.'
    },
    {
      title: 'Privacy and Data Protection',
      content: `We are committed to protecting your privacy and personal data. Our handling of your information is governed by our Privacy Policy, which you can review `,
      link: {
        text: 'here',
        url: '/privacy'
      }
    },
    {
      title: 'Intellectual Property',
      content: 'All content, features, and functionality of the MedDesk platform are owned by MedDesk and protected by international copyright, trademark, and other intellectual property laws.'
    },
    {
      title: 'Limitation of Liability',
      content: 'MedDesk serves as a platform connecting users with healthcare providers. We are not responsible for the quality of medical care, medical advice, or treatment provided by healthcare providers.'
    },
    {
      title: 'Modifications to Terms',
      content: 'We reserve the right to modify these terms at any time. Users will be notified of significant changes. Continued use of the platform after changes constitutes acceptance of new terms.'
    },
    {
      title: 'Termination',
      content: 'We reserve the right to terminate or suspend accounts that violate these terms or for any other reason at our discretion. Users may terminate their accounts at any time.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-[#006D77] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Terms & Conditions</h1>
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
              Welcome to MedDesk. These Terms and Conditions govern your use of our platform and services. 
              Please read these terms carefully before using our services.
            </p>
          </div>

          {/* Terms Sections */}
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
                        <p className="text-[#457B9D] leading-relaxed">
                          {subsection.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#457B9D] leading-relaxed">
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
              Questions About Our Terms?
            </h2>
            <p className="text-[#457B9D] mb-6">
              If you have any questions about these terms or our services, please don't hesitate to contact us.
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

export default Terms; 
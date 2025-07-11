import { Link } from 'react-router-dom';
import { 
  FaUserMd, FaCalendarCheck, FaUserPlus,
  FaHeartbeat, FaBaby, FaBrain, FaEye, FaTooth,
  FaClock, FaCheckCircle, FaShieldAlt, FaStethoscope,
  FaChartLine, FaBell, FaComments, FaDesktop, FaMobile,
  FaUserCog, FaStar, FaFileMedical, FaCalendarAlt,
  FaPrescription, FaHistory, FaArrowRight
} from 'react-icons/fa';

const Home = () => {
  const specialties = [
    { 
      icon: FaHeartbeat, 
      name: 'Cardiology',
      description: 'Heart & Cardiovascular Care'
    },
    { 
      icon: FaBaby, 
      name: 'Pediatrics',
      description: 'Child Healthcare'
    },
    { 
      icon: FaBrain, 
      name: 'Neurology',
      description: 'Brain & Nervous System'
    },
    { 
      icon: FaEye, 
      name: 'Ophthalmology',
      description: 'Eye Care Services'
    },
    { 
      icon: FaTooth, 
      name: 'Dentistry',
      description: 'Dental Care'
    },
    { 
      icon: FaStethoscope, 
      name: 'General Medicine',
      description: 'Primary Healthcare'
    }
  ];

  const benefits = [
    {
      icon: FaCalendarAlt,
      title: "Smart Scheduling",
      description: "Book appointments instantly, 24/7 access to healthcare professionals",
      features: ["Quick Booking", "Instant Confirmation", "Flexible Timing"]
    },
    {
      icon: FaUserMd,
      title: "Expert Doctors",
      description: "Access to verified specialists and healthcare experts near you",
      features: ["Verified Profiles", "Specialist Search", "Doctor Reviews"]
    },
    {
      icon: FaFileMedical,
      title: "Digital Records",
      description: "Secure access to your complete medical history and reports",
      features: ["Easy Access", "Secure Storage", "Share Reports"]
    },
    {
      icon: FaShieldAlt,
      title: "Data Security",
      description: "Enterprise-grade security for your sensitive health information",
      features: ["HIPAA Compliant", "Encrypted Data", "Private Access"]
    },
    {
      icon: FaBell,
      title: "Smart Alerts",
      description: "Never miss appointments with automated notifications",
      features: ["SMS Alerts", "Email Reminders", "Calendar Sync"]
    },
    {
      icon: FaComments,
      title: "Easy Connect",
      description: "Direct messaging with your healthcare providers",
      features: ["Chat Support", "Video Calls", "File Sharing"]
    }
  ];

  const steps = [
    {
      icon: FaUserPlus,
      title: 'Sign Up',
      description: 'Create your free account'
    },
    {
      icon: FaUserMd,
      title: 'Choose Doctor',
      description: 'Select from verified specialists'
    },
    {
      icon: FaCalendarCheck,
      title: 'Book Appointment',
      description: 'Schedule your visit'
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      image: "/testimonials/doctor1.jpg",
      content: "MedDesk has streamlined my practice. The scheduling system is intuitive and saves me hours each week.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Patient",
      image: "/testimonials/patient1.jpg",
      content: "Finding and booking appointments with specialists has never been easier. Excellent service!",
      rating: 5
    },
    {
      name: "Dr. James Wilson",
      role: "Pediatrician",
      image: "/testimonials/doctor2.jpg",
      content: "The platform is secure and reliable. My patients love the easy booking process.",
      rating: 5
    }
  ];



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#1D3557] text-white relative min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              MedDesk
            </h1>
            <p className="text-2xl md:text-3xl mb-12 text-[#A8DADC]">
              Book doctors. Anytime. Anywhere.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/doctor/sign-up"
                className="bg-[#457B9D] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#A8DADC] hover:text-[#1D3557] transition-colors transform hover:scale-105"
              >
                Join as Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#1D3557]">
            How It Works
          </h2>
          <p className="text-xl text-[#457B9D] text-center mb-16">
            Get started with MedDesk in three simple steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-[#F1FAEE] rounded-full p-6 inline-flex">
                    <step.icon className="h-12 w-12 text-[#457B9D]" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-[#1D3557]">{step.title}</h3>
                <p className="text-[#457B9D] text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 bg-[#F1FAEE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#1D3557]">
            Our Specialties
          </h2>
          <p className="text-xl text-[#457B9D] text-center mb-16">
            Find the right specialist for your needs
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialties.map((specialty, index) => (
              <Link
                key={index}
                to={`/doctors/${specialty.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-[var(--success-color)] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-6">
                    <specialty.icon className="h-12 w-12 text-[#457B9D] group-hover:text-white transition-colors duration-300" />
                    <div className="h-10 w-10 rounded-full bg-[#F1FAEE] group-hover:bg-white/20 flex items-center justify-center transition-colors duration-300">
                      <FaArrowRight className="h-5 w-5 text-[#457B9D] group-hover:text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1D3557] group-hover:text-white mb-2 transition-colors duration-300">
                    {specialty.name}
                </h3>
                  <p className="text-[#457B9D] group-hover:text-white/90 transition-colors duration-300">
                    {specialty.description}
                  </p>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#1D3557]">
              Why Choose MedDesk
            </h2>
            <p className="text-xl text-[#457B9D]">
              Experience the future of healthcare management with our innovative features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Main Card */}
                <div className="relative overflow-hidden rounded-2xl">
                  {/* Top Gradient Bar */}
                  <div className="h-2 w-full bg-gradient-to-r from-[var(--success-color)] to-[var(--success-color)]/70"></div>

                  {/* Content Container */}
                  <div className="p-8">
                    {/* Icon and Title Row */}
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--success-color)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <benefit.icon className="w-6 h-6 text-[var(--success-color)]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#1D3557] group-hover:text-[var(--success-color)] transition-colors duration-300">
                          {benefit.title}
                        </h3>
                        <p className="text-[#457B9D] mt-1 text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 pl-16">
                      {benefit.features.map((feature, i) => (
                        <div 
                          key={i}
                          className="flex items-center space-x-2 text-[#457B9D] group-hover:text-[#1D3557] transition-colors duration-300"
                        >
                          <svg className="w-4 h-4 text-[var(--success-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Border with Animation */}
                  <div className="absolute inset-x-0 bottom-0 h-[2px]">
                    <div className="absolute inset-0 bg-[var(--success-color)] opacity-20"></div>
                    <div className="absolute inset-0 bg-[var(--success-color)] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </div>

                {/* Card Border */}
                <div className="absolute inset-0 rounded-2xl border border-gray-100 group-hover:border-[var(--success-color)] transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#F1FAEE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#1D3557]">
            What Our Users Say
          </h2>
          <p className="text-xl text-[#457B9D] text-center mb-16">
            Trusted by thousands of doctors and patients
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#457B9D] flex items-center justify-center text-white text-2xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-[#1D3557]">{testimonial.name}</h3>
                    <p className="text-[#457B9D]">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-[#E63946] w-5 h-5" />
                  ))}
                </div>
                <p className="text-[#457B9D] italic">"{testimonial.content}"</p>
              </div>
            ))}
            </div>
            </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#006D77] relative">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-[#A8DADC] mb-12">
              Join thousands of doctors and patients already using MedDesk
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/sign-up"
                className="bg-[#457B9D] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#A8DADC] hover:text-[#1D3557] transition-colors transform hover:scale-105"
              >
                Sign Up Now
              </Link>
              {/* <Link
                to="/book-appointment"
                className="border-2 border-[#A8DADC] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#A8DADC] hover:text-[#1D3557] transition-colors transform hover:scale-105"
              >
                Book Appointment
              </Link> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
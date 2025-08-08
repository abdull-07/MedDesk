import { Link } from 'react-router-dom';
import {
  FaHome, FaInfoCircle, FaEnvelope, FaQuestionCircle, FaFileContract, FaShieldAlt, FaFacebook,
  FaTwitter, FaLinkedin, FaInstagram, FaStethoscope, FaPhone, FaMapMarkerAlt, FaArrowUp, FaHeart,
  FaUserMd, FaCalendarCheck, FaClock
} from 'react-icons/fa';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'About', path: '/about', icon: FaInfoCircle },
    { name: 'Contact', path: '/contact', icon: FaEnvelope },
    { name: 'FAQ', path: '/faq', icon: FaQuestionCircle },
  ];

  const legalLinks = [
    { name: 'Terms & Conditions', path: '/terms', icon: FaFileContract },
    { name: 'Privacy Policy', path: '/privacy', icon: FaShieldAlt },
  ];

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com', icon: FaFacebook, color: 'hover:text-blue-500' },
    { name: 'Twitter', url: 'https://twitter.com', icon: FaTwitter, color: 'hover:text-sky-400' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: FaLinkedin, color: 'hover:text-blue-600' },
    { name: 'Instagram', url: 'https://instagram.com', icon: FaInstagram, color: 'hover:text-pink-500' },
  ];

  const contactInfo = [
    { icon: FaPhone, label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: FaEnvelope, label: 'Email', value: 'support@meddesk.com' },
    { icon: FaMapMarkerAlt, label: 'Address', value: '123 Healthcare Ave, Medical City' },
  ];

  const features = [
    { icon: FaUserMd, text: '10,000+ Verified Doctors' },
    { icon: FaCalendarCheck, text: 'Easy Appointment Booking' },
    { icon: FaClock, text: '24/7 Customer Support' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center">
                  <FaStethoscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                  MedDesk
                </h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Transforming healthcare access through innovative technology. Connect with verified doctors, book appointments instantly, and manage your health journey with ease.
              </p>

              {/* Features */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600/20 to-teal-600/20 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-slate-300">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300"
                    >
                      <div className="w-6 h-6 bg-slate-700 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-teal-600 rounded-lg flex items-center justify-center transition-all duration-300">
                        <link.icon className="w-3 h-3" />
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="lg:col-span-2">
              <h4 className="text-xl font-bold mb-6 text-white">Legal</h4>
              <ul className="space-y-4">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300"
                    >
                      <div className="w-6 h-6 bg-slate-700 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-teal-600 rounded-lg flex items-center justify-center transition-all duration-300">
                        <link.icon className="w-3 h-3" />
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-4">
              <h4 className="text-xl font-bold mb-6 text-white">Get in Touch</h4>
              <div className="space-y-4 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600/20 to-teal-600/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                      <info.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-400 mb-1">{info.label}</div>
                      <div className="text-slate-300">{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h5 className="text-lg font-semibold mb-4 text-white">Follow Us</h5>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group w-12 h-12 bg-slate-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-600 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 ${social.color}`}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <social.icon className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-300" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-12">
            <div className="text-center max-w-2xl mx-auto">
              <h4 className="text-2xl font-bold mb-4 text-white">Stay Updated</h4>
              <p className="text-slate-300 mb-6">
                Subscribe to our newsletter for the latest healthcare tips, platform updates, and exclusive content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300"
                />
                <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/20">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-slate-300">
                © {new Date().getFullYear()} MedDesk. All rights reserved.
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 flex items-center space-x-1">
                <span>Made with</span>
                <FaHeart className="w-4 h-4 text-red-400 animate-pulse" />
                <span>for better healthcare</span>
              </span>
            </div>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="group bg-gradient-to-r from-blue-600 to-teal-600 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"
              aria-label="Scroll to top"
            >
              <FaArrowUp className="w-4 h-4 group-hover:animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </footer >
  );
}
export default Footer; 
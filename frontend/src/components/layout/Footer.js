import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, Github, Twitter, Mail, Shield, Lock, Users } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Security', href: '#security' },
      { name: 'How it Works', href: '#how-it-works' },
      { name: 'Pricing', href: '#pricing' },
    ],
    resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
      { name: 'Guides', href: '/guides' },
      { name: 'FAQ', href: '/faq' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Compliance', href: '/compliance' },
    ],
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure Voting',
      description: 'Military-grade encryption and blockchain security',
    },
    {
      icon: Lock,
      title: 'Transparent',
      description: 'All votes are publicly verifiable on the blockchain',
    },
    {
      icon: Users,
      title: 'Democratic',
      description: 'One person, one vote - guaranteed by smart contracts',
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Vote className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">FirstVote</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              The future of democratic voting is here. Secure, transparent, and 
              tamper-proof elections powered by blockchain technology.
            </p>
            
            {/* Feature highlights */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-900">{feature.title}</span>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links sections */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stay updated
              </h3>
              <p className="text-gray-600">
                Get the latest news about blockchain voting and election security.
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="input flex-1 min-w-0"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              <p className="text-gray-600 text-sm">
                © {currentYear} FirstVote. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <span>Built with</span>
                <span className="text-red-500">❤️</span>
                <span>for democracy</span>
              </div>
            </div>
            
            {/* Social links */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@firstvote.com"
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Technical info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Powered by Ethereum</span>
                <span>•</span>
                <span>Secured by Blockchain</span>
                <span>•</span>
                <span>Open Source</span>
              </div>
              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                <span>Network: Ethereum Mainnet</span>
                <span>•</span>
                <span>Status: Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

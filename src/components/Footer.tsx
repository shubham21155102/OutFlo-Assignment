import React from 'react';
import { Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo + Founder Section */}
          <div>
            <a href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <img
                  src="logo.png"
                  alt="OutFlo logo"
                  className="w-6 h-6 rounded shadow-sm"
                />
              </div>
              <span className="font-display text-2xl font-bold text-white">OutFlo</span>
            </a>

            <div className="flex items-center space-x-2 text-gray-400">
              <button className="flex items-center space-x-1 hover:text-indigo-400 transition-colors">
                <Linkedin className="w-5 h-5" />
                <span className="text-sm">Follow us on LinkedIn</span>
              </button>
            </div>

            <p className="mt-4 text-gray-400 text-sm max-w-xs">
              "We needed an affordable and reliable way to book meetings using multiple LinkedIn
              accounts—without all the manual work. So we built it for you."
            </p>

            <div className="mt-4 flex items-center space-x-3">
              <img
                src="/assets/Founder.jpg"
                alt="Tushar Singla"
                className="w-10 h-10 rounded-full object-cover border border-indigo-600/20"
              />
              <div>
                <a className="font-medium text-white cursor-pointer hover:text-indigo-400">
                  Tushar Singla
                </a>
                <p className="text-xs text-gray-400">Founder & CEO @OutFlo</p>
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-white">About</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About us</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              <li><a className="cursor-pointer text-gray-400 hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-white">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#benefits" className="text-gray-400 hover:text-white transition-colors">Benefits</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How it Works</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
              <li><a className="cursor-pointer text-gray-400 hover:text-white transition-colors">Contact us</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400">
          <p>© 2025 OutFlo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
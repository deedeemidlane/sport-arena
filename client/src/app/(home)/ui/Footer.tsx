import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12 mt-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">SportCourt</h3>
            <p className="text-gray-600">
              Book your favorite sports courts with ease. Play more, worry less.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">How It Works</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Sports</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary">Football</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Volleyball</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Pickle Ball</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2024 SportCourt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

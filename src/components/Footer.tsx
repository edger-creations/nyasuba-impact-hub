
import { Link } from "react-router-dom";
import PentagonLogo from "./PentagonLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-10 pb-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <PentagonLogo />
              <span className="font-semibold text-lg">
                Esther Nyasuba Foundation
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Empowering communities, uplifting lives, and creating lasting change through various initiatives.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-enf-green dark:hover:text-enf-light-green">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-enf-green dark:hover:text-enf-light-green">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-enf-green dark:hover:text-enf-light-green">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm text-gray-600 dark:text-gray-400 hover:text-enf-green dark:hover:text-enf-light-green">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-enf-green dark:hover:text-enf-light-green">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-enf-green dark:hover:text-enf-light-green">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-400">
                Email: info@esthernyasubafoundation.org
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400">
                Phone: +254 700 000 000
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400">
                Location: Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Copyright © {currentYear} Esther Nyasuba Foundation || All Rights Reserved.
            </p>
            <div className="flex items-center gap-3">
              <Link to="/privacy" className="text-xs text-gray-600 dark:text-gray-400 hover:text-enf-green dark:hover:text-enf-light-green">
                Privacy
              </Link>
              <Link to="/cookies" className="text-xs text-gray-600 dark:text-gray-400 hover:text-enf-green dark:hover:text-enf-light-green">
                Cookie Policy
              </Link>
              <Link to="/legal" className="text-xs text-gray-600 dark:text-gray-400 hover:text-enf-green dark:hover:text-enf-light-green">
                Legal Information
              </Link>
              <Link to="/terms" className="text-xs text-gray-600 dark:text-gray-400 hover:text-enf-green dark:hover:text-enf-light-green">
                Conditions Of Use
              </Link>
              <Link to="/sitemap" className="text-xs text-gray-600 dark:text-gray-400 hover:text-enf-green dark:hover:text-enf-light-green">
                SiteMap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

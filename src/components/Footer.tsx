// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-8">
        {/* About Section */}
        <div>
          <h3 className="text-black dark:text-white font-bold text-lg mb-4">VoteChain</h3>
          <p className="text-sm">
            Powering fair and transparent voting for competitions and events of all sizes.
          </p>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-black dark:text-white font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/events" className="hover:text-black dark:hover:text-white">Events</Link></li>
            <li><Link href="/leaderboard" className="hover:text-black dark:hover:text-white">Leaderboard</Link></li>
            <li><Link href="/results" className="hover:text-black dark:hover:text-white">Results</Link></li>
            <li><Link href="/auth/signin" className="hover:text-black dark:hover:text-white">Sign In</Link></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-black dark:text-white font-bold text-lg mb-4">Contact</h3>
          <p className="text-sm">
            Chitkara University, Punjab
          </p>
          <p className="text-sm mt-2">
            Email: <a href="mailto:support@votechain.com" className="hover:text-black dark:hover:text-white">support@votechain.com</a>
          </p>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-black dark:text-white font-bold text-lg mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white">
              <FaTwitter size={20} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white">
              <FaGithub size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs mt-10 border-t border-neutral-200 dark:border-neutral-800 pt-6">
        © 2024 VoteChain. All Rights Reserved.
      </div>
    </footer>
  );
};
import React, { useState } from 'react';
import Link from 'next/link';
import { GlassButton, Tooltip } from './ui';

export default function Navigation() {
  const [activeLink, setActiveLink] = useState('/');
  
  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/properties', label: 'Properties' },
    { href: '/design', label: 'Design' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full px-8 py-4 bg-space-black/70 backdrop-blur-card z-50 flex justify-between items-center">
      <div className="text-2xl font-bold">
        <Link href="/" legacyBehavior>
          <a className="text-clinical-white hover:text-soft-mint transition-colors duration-200">
            <span className="bg-gradient-to-r from-soft-mint to-electric-coral bg-clip-text text-transparent">IRONWOOD</span>
          </a>
        </Link>
      </div>
      
      <div className="flex gap-8">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} legacyBehavior>
            <a 
              className={`text-lg transition-colors duration-200 ${
                activeLink === link.href 
                  ? 'text-soft-mint' 
                  : 'text-clinical-white hover:text-soft-mint'
              }`}
              onClick={() => setActiveLink(link.href)}
            >
              {link.label}
            </a>
          </Link>
        ))}
      </div>
      
      <div>
        <Tooltip content="Open settings">
          <GlassButton 
            variant="outline" 
            size="small" 
            className="mr-2"
            onClick={() => console.log('Settings clicked')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </GlassButton>
        </Tooltip>
        
        <GlassButton 
          variant="primary"
          onClick={() => console.log('New project clicked')}
        >
          New Project
        </GlassButton>
      </div>
    </nav>
  );
}
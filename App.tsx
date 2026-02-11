
import React, { useState, useEffect } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import UserHeader from './components/UserHeader';
import ServiceCard from './components/ServiceCard';
import CardCreator from './components/CardCreator';
import { DEFAULT_SERVICES } from './constants';
import { ServiceLink } from './types';
import { motion } from 'framer-motion';

const HOME_URL = 'https://vs-home.netlify.app';

const App: React.FC = () => {
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
  const [services, setServices] = useState<ServiceLink[]>([]);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkAccessAndInitialize = () => {
      // 1. Check for valid access conditions
      const isAdmin = localStorage.getItem('vs_admin_access') === 'true';
      const hasSessionAccess = sessionStorage.getItem('vs_portal_session_access') === 'true';
      
      const urlParams = new URLSearchParams(window.location.search);
      const isAdminBypass = urlParams.get('admin') === 'true';
      const isVerifiedFromUrl = urlParams.get('source') === 'verified' || urlParams.get('auth') === 'success';

      const referrer = document.referrer;
      // Access granted if coming from another site (non-empty referrer not matching current hostname)
      const isFromExternal = referrer !== "" && !referrer.includes(window.location.hostname);

      if (isAdmin || hasSessionAccess || isVerifiedFromUrl || isAdminBypass || isFromExternal) {
        // Grant access and persist for the session
        sessionStorage.setItem('vs_portal_session_access', 'true');
        if (isAdminBypass) localStorage.setItem('vs_admin_access', 'true');
        
        setAccessGranted(true);
        
        // Cleanup URL params for cleaner UX
        if (isVerifiedFromUrl || isAdminBypass) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else {
        // DIRECT ENTRY DETECTED - Redirect to Home
        window.location.href = HOME_URL;
      }
    };

    checkAccessAndInitialize();

    // Load Services
    const saved = localStorage.getItem('vs_services');
    if (saved) {
      try {
        setServices(JSON.parse(saved));
      } catch (e) {
        setServices(DEFAULT_SERVICES);
      }
    } else {
      setServices(DEFAULT_SERVICES);
    }
    
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleAddService = (newService: ServiceLink) => {
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    localStorage.setItem('vs_services', JSON.stringify(updatedServices));
  };

  // While checking access, show a minimalist tech loader
  if (accessGranted === null) {
    return (
      <div className="bg-[#0a0f1d] min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  // If we got here and accessGranted is false (rare due to immediate redirect), don't render content
  if (!accessGranted) return null;

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <AnimatedBackground />
      
      <UserHeader onOpenCreator={() => setIsCreatorOpen(true)} />

      <main className="flex-grow container mx-auto px-4 py-20 md:py-32 flex flex-col items-center z-10">
        
        {/* Hero Section - Ultra Responsive Text */}
        <div className="text-center mb-12 md:mb-24 px-2 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h2 
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="text-[10px] md:text-xs font-black text-blue-400 uppercase mb-4 md:mb-8 tracking-[0.4em]"
            >
              Enterprise Solutions Portal
            </motion.h2>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 md:mb-10 leading-[1.1] md:leading-[0.95]">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30">
                Infinite
              </span>
              <br />
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                Capability
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-gray-400 text-sm sm:text-base md:text-xl leading-relaxed font-light px-4 md:px-0">
              Your centralized gateway to high-performance tools, creative platforms, and advanced learning environments.
            </p>
          </motion.div>
        </div>

        {/* Dynamic Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl px-2 md:px-6 mb-12">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index} 
            />
          ))}
        </div>
      </main>

      <footer className="w-full py-12 text-center z-10 opacity-30 px-6 mt-auto">
        <div className="h-px w-20 mx-auto bg-blue-500/20 mb-10" />
        <p className="text-gray-500 text-[10px] font-bold tracking-[0.4em] uppercase">
          &copy; {new Date().getFullYear()} Vishwajith Solutions &bull; Verified Portal Stream
        </p>
      </footer>

      <CardCreator 
        isOpen={isCreatorOpen} 
        onClose={() => setIsCreatorOpen(false)}
        onAddService={handleAddService}
      />
    </div>
  );
};

export default App;

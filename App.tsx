
import React, { useState, useEffect } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import UserHeader from './components/UserHeader';
import ServiceCard from './components/ServiceCard';
import AccessDenied from './components/AccessDenied';
import CardCreator from './components/CardCreator';
import { DEFAULT_SERVICES } from './constants';
import { ServiceLink } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
  const [services, setServices] = useState<ServiceLink[]>([]);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Robust Access Logic
    const checkAccess = () => {
      // Check for persistent admin access
      const isAdmin = localStorage.getItem('vs_admin_access') === 'true';
      
      // Check for session-based access (granted earlier in the same session)
      const hasSessionAccess = sessionStorage.getItem('vs_portal_session_access') === 'true';
      
      // Check for URL parameters (e.g., ?source=verified or ?auth=success)
      const urlParams = new URLSearchParams(window.location.search);
      const isVerifiedFromUrl = urlParams.get('source') === 'verified' || urlParams.get('auth') === 'success';

      // Check for Referrer (may be empty due to browser security/Referrer-Policy)
      const referrer = document.referrer;
      const isInternalReferrer = referrer && referrer.includes(window.location.hostname);
      const hasExternalReferrer = referrer !== "" && !isInternalReferrer;

      if (isAdmin || hasSessionAccess || isVerifiedFromUrl || hasExternalReferrer) {
        // If granted, store in sessionStorage so refresh doesn't block the user
        sessionStorage.setItem('vs_portal_session_access', 'true');
        setAccessGranted(true);
        
        // Clean up URL parameters for a cleaner UX
        if (isVerifiedFromUrl) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else {
        setAccessGranted(false);
      }
    };

    checkAccess();

    // 2. Load Services
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

  const handleAdminAuth = () => {
    localStorage.setItem('vs_admin_access', 'true');
    sessionStorage.setItem('vs_portal_session_access', 'true');
    setAccessGranted(true);
  };

  const handleAddService = (newService: ServiceLink) => {
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    localStorage.setItem('vs_services', JSON.stringify(updatedServices));
  };

  if (accessGranted === null) {
    return <div className="bg-[#0a0f1d] min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>;
  }

  if (accessGranted === false) {
    return <AccessDenied onAdminLogin={handleAdminAuth} />;
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <AnimatedBackground />
      
      <UserHeader onOpenCreator={() => setIsCreatorOpen(true)} />

      <main className="flex-grow container mx-auto px-4 py-20 md:py-32 flex flex-col items-center z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-24 px-4 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h2 
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="text-[10px] md:text-xs font-black text-blue-400 uppercase mb-4 md:mb-8 tracking-[0.4em]"
            >
              Central Intelligence Hub
            </motion.h2>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 md:mb-10 leading-[1.1] md:leading-[0.95]">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30">
                Limitless
              </span>
              <br />
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                Innovation
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-gray-400 text-sm sm:text-base md:text-xl leading-relaxed font-light px-4">
              A high-security, immersive portal providing seamless integration with the complete suite of Vishwajith Solutions digital assets.
            </p>
          </motion.div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl px-2 md:px-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index} 
            />
          ))}
        </div>
      </main>

      <footer className="w-full py-12 text-center z-10 opacity-30 px-6">
        <div className="h-px w-24 mx-auto bg-blue-500/20 mb-10" />
        <p className="text-gray-500 text-[10px] font-bold tracking-[0.4em] uppercase">
          &copy; {new Date().getFullYear()} Vishwajith Solutions &bull; Authorized Access Only
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

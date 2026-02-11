
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
    // 1. Access Logic: Check if user is coming from another site or is a verified admin
    const isAdmin = localStorage.getItem('vs_admin_access') === 'true';
    const hasReferrer = document.referrer !== "" && !document.referrer.includes(window.location.hostname);
    
    // In production, you might want to check for a specific domain here
    // e.g., document.referrer.includes('your-main-site.com')
    
    if (isAdmin || hasReferrer) {
      setAccessGranted(true);
    } else {
      setAccessGranted(false);
    }

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
    
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAdminAuth = () => {
    localStorage.setItem('vs_admin_access', 'true');
    setAccessGranted(true);
  };

  const handleAddService = (newService: ServiceLink) => {
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    localStorage.setItem('vs_services', JSON.stringify(updatedServices));
  };

  // Prevent flash of content during check
  if (accessGranted === null) return <div className="bg-[#0a0f1d] min-h-screen" />;

  if (accessGranted === false) {
    return <AccessDenied onAdminLogin={handleAdminAuth} />;
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <AnimatedBackground />
      
      <UserHeader onOpenCreator={() => setIsCreatorOpen(true)} />

      <main className="flex-grow container mx-auto px-4 py-20 md:py-32 flex flex-col items-center z-10">
        
        {/* Hero Text */}
        <div className="text-center mb-12 md:mb-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h2 
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.2em" }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-[10px] md:text-xs font-black text-blue-400 uppercase mb-4 md:mb-6 tracking-[0.3em]"
            >
              Unified Control Center
            </motion.h2>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 md:mb-8 leading-[1] md:leading-[0.9]">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                Future-Ready
              </span>
              <br />
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                Ecosystem
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-gray-400 text-base md:text-lg leading-relaxed font-light px-2">
              Our advanced portal provides secure, high-speed access to all Vishwajith Solutions platforms in one immersive environment.
            </p>
          </motion.div>
        </div>

        {/* Cards Grid - Optimized for mobile tap targets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl px-2 md:px-4">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index} 
            />
          ))}
        </div>
      </main>

      <footer className="w-full py-10 text-center z-10 opacity-30 px-6">
        <div className="h-px w-full max-w-xs mx-auto bg-gradient-to-r from-transparent via-blue-500/20 to-transparent mb-8" />
        <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">
          &copy; {new Date().getFullYear()} Vishwajith Solutions • Encrypted Portal Access
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

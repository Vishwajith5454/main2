
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ServiceLink } from '../types';
import { ArrowRight, Lock, ExternalLink } from 'lucide-react';
import { getIconByName } from '../utils';

interface ServiceCardProps {
  service: ServiceLink;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 80, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 80, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isTouchDevice) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const Icon = getIconByName(service.iconName);

  const cardContent = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX: isHovered && !isTouchDevice ? rotateX : 0,
        rotateY: isHovered && !isTouchDevice ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={`
        relative h-full w-full rounded-[2.5rem] p-6 md:p-8
        bg-slate-900/40 border border-white/5 backdrop-blur-md
        shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        cursor-pointer
        group
        overflow-hidden
        transition-all duration-700 ease-out
        ${service.status === 'coming-soon' ? 'opacity-60' : 'hover:border-white/20 hover:bg-slate-900/60'}
      `}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {service.lottieUrl ? (
          <div className="w-full h-full flex items-center justify-center opacity-40 group-hover:opacity-60 transition-all duration-1000 scale-125 md:scale-150">
             {/* @ts-ignore */}
             <dotlottie-wc 
                src={service.lottieUrl} 
                autoplay 
                loop 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
             />
          </div>
        ) : (
          <motion.img 
            src={service.imageUrl} 
            alt={service.title}
            className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-1000"
            animate={{ scale: isHovered ? 1.15 : 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/20 to-slate-950/90" />
      </div>

      {/* Content Container */}
      <div style={{ transform: isTouchDevice ? "none" : "translateZ(60px)" }} className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6 md:mb-8">
          <div className={`
            p-3 md:p-4 rounded-2xl bg-gradient-to-br ${service.color}
            shadow-2xl shadow-black/50 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3
          `}>
            <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          
          <motion.div
            animate={{ x: isHovered ? 5 : 0, y: isHovered ? -5 : 0 }}
            className="p-2 md:p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-colors"
          >
            {service.status === 'coming-soon' ? <Lock className="w-4 h-4 text-gray-500" /> : <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white" />}
          </motion.div>
        </div>

        <div className="mt-auto">
          <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3 tracking-tight group-hover:translate-x-1 transition-transform duration-500">
            {service.title}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 font-medium group-hover:text-gray-200 transition-colors duration-500">
            {service.description}
          </p>

          <div className="flex items-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
            {service.status === 'coming-soon' ? (
              <span className="flex items-center gap-2 text-gray-600">
                Encrypted Access
              </span>
            ) : (
              <span className="flex items-center gap-3 text-blue-400 group-hover:text-blue-300 transition-all duration-300">
                Initialize <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform duration-500" />
              </span>
            )}
          </div>
        </div>
      </div>
      
      {!isTouchDevice && (
        <motion.div
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-20"
          style={{
            background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  );

  return (
    <motion.div
      className="block h-[380px] md:h-[420px] w-full perspective-1000"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {service.url && service.status === 'active' ? (
        <a href={service.url} target="_blank" rel="noopener noreferrer" className="block h-full">
          {cardContent}
        </a>
      ) : (
        cardContent
      )}
    </motion.div>
  );
};

export default ServiceCard;

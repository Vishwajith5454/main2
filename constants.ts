
import { ServiceLink } from './types';

export const DEFAULT_SERVICES: ServiceLink[] = [
  {
    id: "edu-1",
    title: "Online Education",
    description: "Access our premium learning management system and courses.",
    url: "https://vs-education.netlify.app",
    iconName: "GraduationCap",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    lottieUrl: "https://lottie.host/06c9851c-f260-47e6-977b-7098bd2e6924/ZNIinM5yux.lottie",
    status: 'active',
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: "blog-1",
    title: "Blog",
    description: "Read the latest insights, tutorials, and tech news.",
    url: "https://vishwajithsolutions.netlify.app/getin",
    iconName: "BookOpen",
    imageUrl: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=800&auto=format&fit=crop",
    lottieUrl: "https://lottie.host/531aa2a9-2e68-4230-b845-343c9b8709a8/OHVIccPCCO.lottie",
    status: 'active',
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "img-1",
    title: "Image Based Tools",
    description: "AI-powered image generation and analysis tools.",
    url: "#", 
    iconName: "Image",
    imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop",
    status: 'active',
    color: "from-emerald-500 to-teal-400"
  },
  {
    id: "soon-1",
    title: "Coming Soon",
    description: "Exciting new features and products are in development.",
    url: undefined,
    iconName: "Rocket",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    status: 'coming-soon',
    color: "from-orange-500 to-yellow-400"
  }
];

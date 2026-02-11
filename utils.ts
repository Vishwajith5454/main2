
import { 
  GraduationCap, 
  BookOpen, 
  Image as ImageIcon, 
  Rocket, 
  Code, 
  Cpu, 
  Globe, 
  Zap, 
  MessageSquare, 
  BarChart, 
  Shield, 
  Music, 
  Video,
  Box,
  Cloud
} from 'lucide-react';

export const ICON_MAP: Record<string, any> = {
  GraduationCap,
  BookOpen,
  Image: ImageIcon,
  Rocket,
  Code,
  Cpu,
  Globe,
  Zap,
  MessageSquare,
  BarChart,
  Shield,
  Music,
  Video,
  Box,
  Cloud
};

export const getIconByName = (name: string) => {
  return ICON_MAP[name] || Box;
};

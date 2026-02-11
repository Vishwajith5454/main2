
export interface ServiceLink {
  id: string;
  title: string;
  description: string;
  url?: string;
  iconName: string;
  imageUrl: string;
  lottieUrl?: string;
  status: 'active' | 'coming-soon' | 'maintenance';
  color: string;
}

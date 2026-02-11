import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, Lock, ArrowRight } from 'lucide-react';
import { ServiceLink } from '../types';

interface CardCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (service: ServiceLink) => void;
}

const CardCreator: React.FC<CardCreatorProps> = ({ isOpen, onClose, onAddService }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset slightly to avoid UI flash during exit animation
      const timer = setTimeout(() => {
        setIsAuthenticated(false);
        setPassword('');
        setError('');
        setPrompt('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'VISHWAJITH2010') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Use recommended model for basic text tasks
      const model = 'gemini-3-flash-preview';
      
      const response = await ai.models.generateContent({
        model: model,
        contents: `Create a JSON object for a website service card based on this request: "${prompt}".
        
        It must strictly follow this JSON schema:
        {
          "title": "string (Short catchy title)",
          "description": "string (Short description under 100 chars)",
          "url": "string (A valid URL, if user didn't specify, use '#')",
          "iconName": "string (One of: GraduationCap, BookOpen, Image, Rocket, Code, Cpu, Globe, Zap, MessageSquare, BarChart, Shield, Music, Video, Box, Cloud)",
          "status": "string (One of: 'active', 'coming-soon', 'maintenance')",
          "color": "string (Tailwind gradient classes e.g. 'from-purple-500 to-pink-500')",
          "imageUrl": "string (A high quality, real Unsplash image URL that matches the context. Use format: 'https://images.unsplash.com/photo-ID?q=80&w=800&auto=format&fit=crop')"
        }
        
        For the imageUrl, since you cannot browse, please provide a valid, static Unsplash photo URL that you 'know' or use a generic one if unsure, but try to match the context (e.g. coding, tech, nature).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              url: { type: Type.STRING },
              iconName: { type: Type.STRING },
              status: { type: Type.STRING, enum: ['active', 'coming-soon', 'maintenance'] },
              color: { type: Type.STRING },
              imageUrl: { type: Type.STRING }
            },
            required: ['title', 'description', 'url', 'iconName', 'status', 'color', 'imageUrl']
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      
      const newService: ServiceLink = {
        id: Date.now().toString(),
        ...data
      };

      onAddService(newService);
      // We don't close immediately to allow adding more? Or close? 
      // User flow suggests closing is better.
      onClose();

    } catch (err) {
      console.error(err);
      setError("Failed to generate card. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] z-50 bg-slate-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  {isAuthenticated ? (
                     <Sparkles className="w-5 h-5 text-blue-400" />
                  ) : (
                     <Lock className="w-5 h-5 text-blue-400" />
                  )}
                  <h2 className="text-xl font-bold text-white">
                    {isAuthenticated ? 'AI Solution Creator' : 'Admin Verification'}
                  </h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isAuthenticated ? (
                // Password Form
                <form onSubmit={handleLogin} className="space-y-4 py-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Enter Administrator Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-600"
                      placeholder="••••••••••••"
                      autoFocus
                    />
                  </div>
                  
                  {error && <p className="text-red-400 text-sm animate-pulse">{error}</p>}

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
                    >
                      Verify <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                // Existing Generator UI
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Describe the solution you want to add
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., A crypto dashboard tool with dark theme and data visualization..."
                      className="w-full h-32 bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    />
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isLoading || !prompt.trim()}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate & Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CardCreator;
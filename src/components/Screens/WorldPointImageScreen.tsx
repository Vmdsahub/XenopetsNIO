import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useGameStore } from "../../store/gameStore";

interface InteractivePoint {
  id: string;
  name: string;
  x: number;
  y: number;
  imageUrl: string;
  description: string;
  icon: React.ReactNode;
  glowColor: string;
}

export const WorldPointImageScreen: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<InteractivePoint | null>(
    null,
  );
  const { setCurrentScreen } = useGameStore();

  useEffect(() => {
    // Retrieve the selected point data from localStorage
    const storedPoint = localStorage.getItem("selectedWorldPoint");
    if (storedPoint) {
      setSelectedPoint(JSON.parse(storedPoint));
    } else {
      // If no point data, redirect back to world screen
      setCurrentScreen("world");
    }
  }, [setCurrentScreen]);

  const goBackToWorld = () => {
    // Clean up localStorage and go back
    localStorage.removeItem("selectedWorldPoint");
    setCurrentScreen("world");
  };

  if (!selectedPoint) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Header with back button */}
      <motion.div
        className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white p-4 rounded-t-3xl border-t border-x border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <motion.button
            onClick={goBackToWorld}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </motion.button>

          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              {selectedPoint.icon}
            </div>
            <h1 className="text-lg font-bold">{selectedPoint.name}</h1>
          </div>
        </div>
      </motion.div>

      {/* Large Image - Same size as the map (h-96) */}
      <motion.div
        className="relative h-96 overflow-hidden border-x border-gray-700 bg-black"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.img
          src={selectedPoint.imageUrl}
          alt={selectedPoint.name}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        {/* Floating particles effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-10, -30, -10],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Image title overlay */}
        <motion.div
          className="absolute bottom-4 left-4 right-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-black/60 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-white font-bold text-lg">
                {selectedPoint.name}
              </h2>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Description Section */}
      <motion.div
        className="bg-gradient-to-b from-gray-900 to-black text-white p-6 rounded-b-3xl border-b border-x border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="space-y-4">
          {/* Description */}
          <div>
            <h3 className="text-lg font-bold mb-2 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
              Sobre esta Região
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {selectedPoint.description}
            </p>
          </div>

          {/* Mystical Info */}
          <motion.div
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-4 border border-purple-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-2 text-purple-300 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Região Mística</span>
            </div>
            <p className="text-gray-400 text-xs">
              Esta região contém energias especiais que podem ser exploradas no
              futuro. Continue explorando o universo para descobrir mais
              segredos cósmicos.
            </p>
          </motion.div>

          {/* Back Button */}
          <motion.button
            onClick={goBackToWorld}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Voltar ao Mapa Universal
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

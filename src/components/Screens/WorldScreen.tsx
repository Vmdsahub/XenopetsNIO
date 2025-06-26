import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Sparkles,
  Globe,
  Star,
  Rocket,
  Zap,
  Target,
  RotateCcw,
} from "lucide-react";
import { useGameStore } from "../../store/gameStore";

interface InteractivePoint {
  id: string;
  name: string;
  x: number; // percentage from left
  y: number; // percentage from top
  imageUrl: string;
  description: string;
  icon: React.ReactNode;
  glowColor: string;
}

const interactivePoints: InteractivePoint[] = [
  {
    id: "nebula_1",
    name: "Nebulosa Cristalina",
    x: 20,
    y: 30,
    imageUrl:
      "https://images.pexels.com/photos/32657005/pexels-photo-32657005.jpeg",
    description:
      "Uma nebulosa misteriosa onde cristais cósmicos se formam naturalmente, criando paisagens de tirar o fôlego.",
    icon: <Sparkles className="w-5 h-5" />,
    glowColor: "shadow-purple-400/50",
  },
  {
    id: "galaxy_core",
    name: "Núcleo Galáctico",
    x: 75,
    y: 25,
    imageUrl:
      "https://images.pexels.com/photos/17505898/pexels-photo-17505898.jpeg",
    description:
      "O coração pulsante da galáxia, onde estrelas nascem e morrem em um ciclo eterno de criação.",
    icon: <Globe className="w-5 h-5" />,
    glowColor: "shadow-blue-400/50",
  },
  {
    id: "cosmic_forest",
    name: "Floresta Cósmica",
    x: 45,
    y: 60,
    imageUrl:
      "https://images.pexels.com/photos/8344071/pexels-photo-8344071.jpeg",
    description:
      "Estruturas luminescentes que se assemelham a árvores flutuam no espaço, criando um jardim celestial.",
    icon: <Star className="w-5 h-5" />,
    glowColor: "shadow-cyan-400/50",
  },
  {
    id: "stargate",
    name: "Portal Estelar",
    x: 65,
    y: 75,
    imageUrl:
      "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg",
    description:
      "Um portal dimensional que conecta diferentes regiões do universo, guardado por antigas civilizações.",
    icon: <Rocket className="w-5 h-5" />,
    glowColor: "shadow-amber-400/50",
  },
  {
    id: "energy_field",
    name: "Campo de Energia",
    x: 30,
    y: 80,
    imageUrl:
      "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg",
    description:
      "Uma região onde energia pura flui livremente, criando fenômenos luminosos espetaculares.",
    icon: <Zap className="w-5 h-5" />,
    glowColor: "shadow-emerald-400/50",
  },
  {
    id: "void_station",
    name: "Estação do Vazio",
    x: 85,
    y: 50,
    imageUrl:
      "https://images.pexels.com/photos/586415/pexels-photo-586415.jpeg",
    description:
      "Uma estação abandonada que flutua no vazio espacial, contendo segredos de civilizações perdidas.",
    icon: <Home className="w-5 h-5" />,
    glowColor: "shadow-red-400/50",
  },
];

export const WorldScreen: React.FC = () => {
  const [mapTransform, setMapTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { setCurrentScreen } = useGameStore();

  // Handle mouse/touch start
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    const clientX = e.clientX;
    const clientY = e.clientY;
    setDragStart({ x: clientX - mapTransform.x, y: clientY - mapTransform.y });
    if (mapContainerRef.current) {
      mapContainerRef.current.setPointerCapture(e.pointerId);
    }
  };

  // Handle mouse/touch move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const clientX = e.clientX;
    const clientY = e.clientY;
    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;

    setMapTransform((prev) => ({ ...prev, x: newX, y: newY }));
    setLastPosition({ x: newX, y: newY });
  };

  // Handle mouse/touch end
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (mapContainerRef.current) {
      mapContainerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  // Reset map to center
  const resetMapPosition = () => {
    setMapTransform({ x: 0, y: 0, scale: 1 });
    setLastPosition({ x: 0, y: 0 });
  };

  // Handle point click
  const handlePointClick = (point: InteractivePoint) => {
    if (isDragging) return; // Don't trigger if dragging

    // Create a serializable version of the point data
    const serializablePoint = {
      id: point.id,
      name: point.name,
      x: point.x,
      y: point.y,
      imageUrl: point.imageUrl,
      description: point.description,
      iconName: getIconName(point.icon),
      glowColor: point.glowColor,
    };

    // Store the selected point data in localStorage to access in the image screen
    localStorage.setItem(
      "selectedWorldPoint",
      JSON.stringify(serializablePoint),
    );
    setCurrentScreen("worldPointImage");
  };

  // Helper function to get icon name from React component
  const getIconName = (icon: React.ReactNode): string => {
    if (React.isValidElement(icon)) {
      switch (icon.type) {
        case Sparkles:
          return "Sparkles";
        case Globe:
          return "Globe";
        case Star:
          return "Star";
        case Rocket:
          return "Rocket";
        case Zap:
          return "Zap";
        case Home:
          return "Home";
        default:
          return "Sparkles";
      }
    }
    return "Sparkles";
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white p-6 rounded-t-3xl border-t border-x border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center">
          <motion.div
            className="inline-flex items-center space-x-2 mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Globe className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold">Universo Xenopets</h1>
            <Globe className="w-6 h-6 text-cyan-400" />
          </motion.div>
          <p className="text-purple-200 text-sm">
            Explore o cosmos e descubra regiões místicas
          </p>
          <div className="flex justify-center space-x-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Map Container */}
      <motion.div
        className="relative h-96 overflow-hidden bg-black border-x border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Animated Stars Background */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
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

        {/* Draggable Map */}
        <div
          ref={mapContainerRef}
          className={`absolute inset-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            transform: `translate(${mapTransform.x}px, ${mapTransform.y}px) scale(${mapTransform.scale})`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Cosmic Background Elements */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 45% 60%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 85% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 30% 80%, rgba(251, 191, 36, 0.3) 0%, transparent 50%)
              `,
            }}
          >
            {/* Flowing Energy Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <linearGradient
                  id="energyGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              {interactivePoints.map((point, index) => {
                const nextPoint =
                  interactivePoints[(index + 1) % interactivePoints.length];
                return (
                  <motion.path
                    key={`line-${point.id}`}
                    d={`M ${point.x * 4} ${point.y * 3.84} Q ${(point.x + nextPoint.x) * 2} ${(point.y + nextPoint.y) * 1.92} ${nextPoint.x * 4} ${nextPoint.y * 3.84}`}
                    stroke="url(#energyGradient)"
                    strokeWidth="1"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 3,
                      delay: index * 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                );
              })}
            </svg>

            {/* Interactive Points */}
            {interactivePoints.map((point, index) => (
              <motion.button
                key={point.id}
                onClick={() => handlePointClick(point)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-lg ${point.glowColor} transition-all duration-300 hover:scale-110 border-2 border-white/30`}
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.5 }}
                whileHover={{
                  scale: 1.2,
                  boxShadow: "0 0 30px rgba(147, 51, 234, 0.8)",
                }}
                whileTap={{ scale: 0.9 }}
              >
                {point.icon}

                {/* Pulsing Ring Animation */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/50"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                />

                {/* Point Name Label */}
                <motion.div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  {point.name}
                </motion.div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          {/* Reset Button */}
          <motion.button
            onClick={resetMapPosition}
            className="bg-black/60 backdrop-blur-sm text-white p-3 rounded-full border border-white/20 hover:bg-black/80 transition-colors shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Voltar ao centro"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Instructions */}
        <motion.div
          className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg border border-white/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span>Arraste para explorar</span>
          </div>
        </motion.div>

        {/* Points Counter */}
        <motion.div
          className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg border border-white/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          {interactivePoints.length} regiões descobertas
        </motion.div>
      </motion.div>

      {/* Points List */}
      <motion.div
        className="bg-gradient-to-b from-gray-900 to-black text-white p-6 rounded-b-3xl border-b border-x border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-amber-400" />
          Regiões Descobertas
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {interactivePoints.map((point, index) => (
            <motion.button
              key={point.id}
              onClick={() => handlePointClick(point)}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-left hover:bg-gray-700/50 transition-all duration-300 hover:border-purple-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  {React.cloneElement(point.icon as React.ReactElement, {
                    className: "w-3 h-3",
                  })}
                </div>
                <span className="text-sm font-medium text-gray-200">
                  {point.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

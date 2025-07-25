import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Sparkles, Globe, Star, Rocket, Zap } from "lucide-react";

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
  const [selectedPoint, setSelectedPoint] = useState<InteractivePoint | null>(
    null,
  );
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });

  const handlePointClick = (point: InteractivePoint) => {
    setSelectedPoint(point);
  };

  const closeModal = () => {
    setSelectedPoint(null);
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

      {/* Draggable Universe Map */}
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

        {/* Draggable Map Container */}
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag
          dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
          dragElastic={0.1}
          onDrag={(_, info) => {
            setMapPosition({ x: info.offset.x, y: info.offset.y });
          }}
          whileDrag={{ scale: 1.02 }}
        >
          {/* Cosmic Background Elements */}
          <motion.div
            className="absolute inset-0"
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
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  {point.name}
                </motion.div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Drag Instructions */}
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

      {/* Image Modal */}
      <AnimatePresence>
        {selectedPoint && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-purple-500/30">
                {/* Modal Header */}
                <div className="relative p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        {selectedPoint.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {selectedPoint.name}
                      </h3>
                    </div>
                    <motion.button
                      onClick={closeModal}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={selectedPoint.imageUrl}
                    alt={selectedPoint.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Description */}
                <div className="p-6">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {selectedPoint.description}
                  </p>

                  <motion.div
                    className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-4 border border-purple-500/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center space-x-2 text-purple-300">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Região Mística
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      Esta região contém energias especiais que podem ser
                      exploradas no futuro.
                    </p>
                  </motion.div>

                  <motion.button
                    onClick={closeModal}
                    className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Fechar Exploração
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

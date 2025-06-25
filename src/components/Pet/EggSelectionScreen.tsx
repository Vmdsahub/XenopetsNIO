import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Zap, Brain, Shield, Star, Lock } from "lucide-react";
import { useGameStore } from "../../store/gameStore";

interface Egg {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  description: string;
  species: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic";
  bonuses: {
    strength?: number;
    intelligence?: number;
    dexterity?: number;
    speed?: number;
    health?: number;
    luck?: number;
  };
}

const eggs: Egg[] = [
  {
    id: "dragon-egg",
    name: "Ovo de Dragão",
    emoji: "🥚",
    gradient: "from-red-500 via-orange-500 to-yellow-500",
    description: "Um ovo ardente que pulsa com poder ancestral",
    species: "Dragon",
    rarity: "Epic",
    bonuses: { strength: 3, intelligence: 2, health: 1 },
  },
  {
    id: "phoenix-egg",
    name: "Ovo de Fênix",
    emoji: "🔥",
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
    description: "Um ovo cintilante envolvido em chamas etéreas",
    species: "Phoenix",
    rarity: "Rare",
    bonuses: { speed: 3, health: 2, luck: 1 },
  },
  {
    id: "griffin-egg",
    name: "Ovo de Grifo",
    emoji: "🪶",
    gradient: "from-blue-500 via-teal-500 to-green-500",
    description: "Um ovo majestoso com padrões dourados",
    species: "Griffin",
    rarity: "Rare",
    bonuses: { dexterity: 3, speed: 2, intelligence: 1 },
  },
  {
    id: "unicorn-egg",
    name: "Ovo de Unicórnio",
    emoji: "🌟",
    gradient: "from-purple-500 via-pink-500 to-white",
    description: "Um ovo puro que brilha com magia celestial",
    species: "Unicorn",
    rarity: "Uncommon",
    bonuses: { intelligence: 3, luck: 3 },
  },
];

interface EggSelectionScreenProps {
  onEggSelected: (egg: Egg) => void;
}

export const EggSelectionScreen: React.FC<EggSelectionScreenProps> = ({
  onEggSelected,
}) => {
  const [selectedEgg, setSelectedEgg] = useState<Egg | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const { addNotification } = useGameStore();

  const handleEggClick = (egg: Egg) => {
    setSelectedEgg(egg);
  };

  const handleConfirmSelection = () => {
    if (!selectedEgg) return;

    setIsConfirming(true);

    // Add notification about egg selection
    addNotification({
      type: "success",
      title: "Ovo Selecionado!",
      message: `Você escolheu o ${selectedEgg.name}. Ele começará a chocar em breve!`,
      isRead: false,
    });

    // Wait a moment for the animation
    setTimeout(() => {
      onEggSelected(selectedEgg);
    }, 1500);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "text-gray-600 bg-gray-100";
      case "Uncommon":
        return "text-green-600 bg-green-100";
      case "Rare":
        return "text-blue-600 bg-blue-100";
      case "Epic":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 mb-4"
          >
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Escolha seu Ovo
            </h1>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </motion.div>
          <p className="text-lg text-gray-600 mb-2">
            Selecione um ovo para ser seu primeiro companheiro
          </p>
          <p className="text-sm text-gray-500">
            Cada ovo contém uma criatura única com habilidades especiais
          </p>
        </div>

        {/* Egg Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {eggs.map((egg, index) => (
            <motion.div
              key={egg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${
                selectedEgg?.id === egg.id
                  ? "border-purple-500 bg-white shadow-xl scale-105"
                  : "border-gray-200 bg-white/70 hover:border-purple-300 hover:shadow-lg hover:scale-102"
              }`}
              onClick={() => handleEggClick(egg)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selection Indicator */}
              <AnimatePresence>
                {selectedEgg?.id === egg.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <Star className="w-4 h-4 text-white fill-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rarity Badge */}
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getRarityColor(egg.rarity)}`}
              >
                {egg.rarity}
              </div>

              {/* Egg Display */}
              <div className="text-center mb-4">
                <div
                  className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${egg.gradient} flex items-center justify-center text-4xl mb-4 shadow-lg`}
                >
                  {egg.emoji}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {egg.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{egg.description}</p>
              </div>

              {/* Bonuses */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Bônus Iniciais:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(egg.bonuses).map(([stat, value]) => (
                    <div
                      key={stat}
                      className="flex items-center space-x-2 text-xs"
                    >
                      {stat === "strength" && (
                        <Shield className="w-3 h-3 text-red-500" />
                      )}
                      {stat === "intelligence" && (
                        <Brain className="w-3 h-3 text-blue-500" />
                      )}
                      {stat === "dexterity" && (
                        <Zap className="w-3 h-3 text-yellow-500" />
                      )}
                      {stat === "speed" && (
                        <Zap className="w-3 h-3 text-green-500" />
                      )}
                      {stat === "health" && (
                        <Heart className="w-3 h-3 text-red-500" />
                      )}
                      {stat === "luck" && (
                        <Star className="w-3 h-3 text-purple-500" />
                      )}
                      <span className="capitalize text-gray-600">{stat}</span>
                      <span className="font-bold text-gray-900">+{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Confirm Button */}
        <AnimatePresence>
          {selectedEgg && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center"
            >
              <motion.button
                onClick={handleConfirmSelection}
                disabled={isConfirming}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isConfirming ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Preparando o ovo...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span>Confirmar Escolha</span>
                  </div>
                )}
              </motion.button>

              <p className="text-sm text-gray-500 mt-4">
                Após confirmar, seu ovo levará 3 minutos para chocar
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

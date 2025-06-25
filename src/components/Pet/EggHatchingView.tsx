import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Sparkles, Heart, Star } from "lucide-react";
import { useGameStore } from "../../store/gameStore";

interface EggHatchingViewProps {
  eggData: {
    id: string;
    name: string;
    emoji: string;
    gradient: string;
    species: string;
    bonuses: Record<string, number>;
  };
  onHatchComplete: () => void;
}

export const EggHatchingView: React.FC<EggHatchingViewProps> = ({
  eggData,
  onHatchComplete,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes in seconds
  const [isHatching, setIsHatching] = useState(false);
  const { addNotification, createPet, user } = useGameStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsHatching(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isHatching) {
      // Wait 3 seconds for hatching animation, then create the pet
      const hatchTimer = setTimeout(async () => {
        await handlePetHatch();
      }, 3000);

      return () => clearTimeout(hatchTimer);
    }
  }, [isHatching]);

  const handlePetHatch = async () => {
    if (!user) return;

    // Create the pet with random name and the egg's bonuses
    const petNames = [
      "Buddy",
      "Luna",
      "Max",
      "Bella",
      "Charlie",
      "Ruby",
      "Oliver",
      "Stella",
    ];
    const randomName = petNames[Math.floor(Math.random() * petNames.length)];

    const newPet = await createPet({
      name: randomName,
      species: eggData.species,
      style: "Default",
      personality: "Sanguine",
      happiness: 8,
      health: 8,
      hunger: 7,
      strength: 5 + (eggData.bonuses.strength || 0),
      dexterity: 5 + (eggData.bonuses.dexterity || 0),
      intelligence: 5 + (eggData.bonuses.intelligence || 0),
      speed: 5 + (eggData.bonuses.speed || 0),
      attack: 3,
      defense: 3,
      precision: 3,
      evasion: 3,
      luck: 3 + (eggData.bonuses.luck || 0),
      level: 1,
      conditions: [],
      equipment: {},
      isAlive: true,
      isActive: true,
      ownerId: user.id,
    });

    if (newPet) {
      addNotification({
        type: "success",
        title: "🎉 Seu pet nasceu!",
        message: `Parabéns! ${randomName} saiu do ovo e está pronto para aventuras!`,
        isRead: false,
      });

      setTimeout(() => {
        onHatchComplete();
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = ((180 - timeRemaining) / 180) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <AnimatePresence mode="wait">
          {!isHatching ? (
            <motion.div
              key="incubating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8"
            >
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Chocando...
                </h1>
                <p className="text-gray-600">{eggData.name}</p>
              </div>

              {/* Egg with Animation */}
              <div className="relative">
                <motion.div
                  className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${eggData.gradient} flex items-center justify-center text-6xl shadow-2xl`}
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {eggData.emoji}
                </motion.div>

                {/* Sparkles around egg */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4"
                    style={{
                      top: `${20 + Math.sin((i * 60 * Math.PI) / 180) * 60}px`,
                      left: `${20 + Math.cos((i * 60 * Math.PI) / 180) * 60}px`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="space-y-4">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-2xl font-mono font-bold text-gray-700">
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  Seu pet está se desenvolvendo dentro do ovo
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hatching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Hatching Animation */}
              <div>
                <h1 className="text-3xl font-bold text-green-600 mb-2">
                  🎉 Nascendo!
                </h1>
                <p className="text-gray-600">Seu pet está saindo do ovo!</p>
              </div>

              {/* Cracking Egg */}
              <div className="relative">
                <motion.div
                  className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${eggData.gradient} flex items-center justify-center text-6xl shadow-2xl`}
                  animate={{
                    scale: [1, 1.2, 0.8, 1.1, 0.9, 1],
                    rotate: [-5, 5, -3, 3, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                  }}
                >
                  {eggData.emoji}
                </motion.div>

                {/* Explosion Effect */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3"
                    style={{
                      top: "50%",
                      left: "50%",
                    }}
                    animate={{
                      x: Math.cos((i * 30 * Math.PI) / 180) * 100,
                      y: Math.sin((i * 30 * Math.PI) / 180) * 100,
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  >
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-green-600">
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">
                    Preparando seu novo companheiro...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

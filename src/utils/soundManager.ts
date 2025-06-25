/**
 * SoundManager - Gerenciador de sons do jogo
 *
 * Este utilitário cuida de carregar, reproduzir e gerenciar efeitos sonoros e música
 * de fundo para o jogo, garantindo uma experiência de áudio consistente.
 */

// Mapa para armazenar os áudios pré-carregados
const audioCache: Record<string, HTMLAudioElement> = {};

// Lista de sons disponíveis no jogo
export const Sounds = {
  NOTIFICATION: "/sounds/notification-pop.mp3",
  // Adicionar mais sons aqui conforme necessário
};

/**
 * Pré-carrega um som específico
 * @param soundPath Caminho para o arquivo de som
 * @returns Promise que resolve quando o som estiver carregado
 */
export const preloadSound = (soundPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (audioCache[soundPath]) {
        resolve(); // Já está carregado
        return;
      }

      const audio = new Audio();
      audio.src = soundPath;

      audio.addEventListener(
        "canplaythrough",
        () => {
          audioCache[soundPath] = audio;
          console.log(`Som carregado: ${soundPath}`);
          resolve();
        },
        { once: true },
      );

      audio.addEventListener("error", (e) => {
        const errorDetails = {
          path: soundPath,
          error: e.type,
          message: "Audio load failed",
          readyState: audio.readyState,
          networkState: audio.networkState,
        };
        console.error(`Erro ao carregar som ${soundPath}:`, errorDetails);
        reject(new Error(`Failed to load sound: ${soundPath} - ${e.type}`));
      });

      audio.load();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(
        `Erro ao configurar pré-carregamento para ${soundPath}:`,
        errorMsg,
      );
      reject(new Error(`Sound setup failed: ${errorMsg}`));
    }
  });
};

/**
 * Pré-carrega todos os sons definidos no objeto Sounds
 */
export const preloadAllSounds = async (): Promise<void> => {
  console.log("Iniciando pré-carregamento de todos os sons...");

  try {
    const loadPromises = Object.values(Sounds).map((soundPath) =>
      preloadSound(soundPath).catch((error) => {
        console.warn(`Failed to preload ${soundPath}:`, error.message);
        return null; // Continue with other sounds even if one fails
      }),
    );
    await Promise.all(loadPromises);
    console.log("Pré-carregamento de sons concluído");
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Erro ao pré-carregar sons:", errorMsg);
  }
};

/**
 * Reproduz um som específico
 * @param soundPath Caminho para o arquivo de som
 * @param volume Volume (0 a 1), padrão 0.5
 * @returns Promise que resolve quando o som começar a tocar ou rejeita em caso de erro
 */
export const playSound = (
  soundPath: string,
  volume: number = 0.5,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Tenta usar o som em cache primeiro
      if (audioCache[soundPath]) {
        // Cria um clone para permitir reproduções simultâneas
        const soundClone = audioCache[soundPath].cloneNode(
          true,
        ) as HTMLAudioElement;
        soundClone.volume = volume;

        const playPromise = soundClone.play();
        if (playPromise) {
          playPromise
            .then(() => resolve())
            .catch((error) => {
              const errorMsg =
                error instanceof Error ? error.message : String(error);
              console.error(
                `Erro ao reproduzir som do cache (${soundPath}):`,
                errorMsg,
              );
              tryAlternativePlay(soundPath, volume, resolve, reject);
            });
        } else {
          resolve();
        }
        return;
      }

      // Se não estiver em cache, tente reproduzir diretamente
      tryAlternativePlay(soundPath, volume, resolve, reject);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`Erro ao reproduzir som ${soundPath}:`, errorMsg);
      reject(new Error(`Sound play failed: ${errorMsg}`));
    }
  });
};

/**
 * Tenta reproduzir um som usando método alternativo
 */
const tryAlternativePlay = (
  soundPath: string,
  volume: number,
  resolve: () => void,
  reject: (error: any) => void,
): void => {
  try {
    const audio = new Audio(soundPath);
    audio.volume = volume;

    const playPromise = audio.play();
    if (playPromise) {
      playPromise
        .then(() => resolve())
        .catch((error) => {
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          console.error(`Erro ao reproduzir som ${soundPath}:`, errorMsg);
          reject(new Error(`Alternative sound play failed: ${errorMsg}`));
        });
    } else {
      resolve();
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`Erro na reprodução alternativa ${soundPath}:`, errorMsg);
    reject(new Error(`Alternative sound setup failed: ${errorMsg}`));
  }
};

// Convenience functions
export const playNotificationSound = (): Promise<void> => {
  return playSound(Sounds.NOTIFICATION, 0.5).catch((error) => {
    console.warn("Notification sound failed to play:", error.message);
    // Don't throw error for notification sounds - they're non-critical
  });
};

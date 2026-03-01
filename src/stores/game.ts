import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiService, type DailyPuzzle, type Character, type GuessResult, type HintResponse } from '../services/api' // Rétablissement de GuessResult

export type GameStatus = 'loading' | 'playing' | 'won' | 'lost'

// Interface étendue pour stocker le nom avec le résultat
export interface GuessWithName extends GuessResult {
  characterName: string
}

interface GameState {
  puzzle: DailyPuzzle | null
  guesses: GuessWithName[]
  currentAttempt: number
  gameStatus: GameStatus
  mode: 'CLASSIC' | 'LORE'
  loreSteps: string[]
}

// Nouvelle interface pour une carte collectionnée
export interface CollectedCard {
  name: string
  attempts: number
  unlockedAt: string
}

// Interface pour les stats de streak
export interface StreakStats {
  currentStreak: number
  maxStreak: number
  lastWonDate: string | null // Format YYYY-MM-DD
}

// Interface pour les statistiques personnelles
export interface PersonalStats {
  gamesPlayed: number
  gamesWon: number
  attemptDistribution: Record<string, number> // "1": 2, "2": 5, "3+": 10...
}

export const useGameStore = defineStore('game', () => {
  // State
  const puzzle = ref<DailyPuzzle | null>(null)
  const guesses = ref<GuessWithName[]>([])
  const currentAttempt = ref(1)
  const gameStatus = ref<GameStatus>('loading')
  const mode = ref<'CLASSIC' | 'TMP'>('CLASSIC') // Rétablissement du mode
  const collection = ref<CollectedCard[]>([]) 
  const allCharactersList = ref<Character[]>([]) // Stocke les objets Character complets
  const streak = ref<StreakStats>({
    currentStreak: 0,
    maxStreak: 0,
    lastWonDate: null
  })
  const personalStats = ref<PersonalStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    attemptDistribution: {}
  })

  // Indices débloqués (disponibles depuis l'API mais pas encore révélés par le joueur)
  const availableHints = ref<{
    blurredImage: string | null
    phrase: string | null
    quote: string | null
  }>({
    blurredImage: null,
    phrase: null,
    quote: null
  })

  // Indices révélés par le joueur (il a choisi de les voir)
  const revealedHints = ref<{
    blurredImage: boolean
    phrase: boolean
    quote: boolean
  }>({
    blurredImage: false,
    phrase: false,
    quote: false
  })

  // Computed
  const isGameOver = computed(() => gameStatus.value === 'won' || gameStatus.value === 'lost')
  const canGuess = computed(() => 
    !isGameOver.value && 
    gameStatus.value !== 'loading'
  )

  // Actions
  async function loadDailyPuzzle() {
    try {
      gameStatus.value = 'loading'
      
      // Charger le puzzle du jour
      puzzle.value = await apiService.getDailyPuzzle()
      
      // Essayer de charger la liste complète des noms si pas déjà chargée
      if (allCharactersList.value.length === 0) {
          try {
              const chars = await apiService.getAllCharacters()
              // On stocke les objets complets, triés par ID par défaut ou nom
              allCharactersList.value = chars.sort((a, b) => a.name.localeCompare(b.name))
          } catch (e) {
              console.warn("Impossible de pré-charger la liste des persos pour l'album", e)
          }
      }

      // Charger l'état depuis localStorage
      loadStateFromLocalStorage()
      
      // Charger la streak
      loadStreak()
      
      // Charger les stats personnelles
      loadPersonalStats()

      // Charger les indices si la partie est en cours et qu'on a assez de tentatives
      if ((gameStatus.value as string) !== 'won' && guesses.value.length >= 3) {
        await fetchHints()
      }
      
      // Ne pas écraser le gameStatus s'il a été chargé depuis localStorage
      // Sinon, mettre à 'playing' par défaut
      if (gameStatus.value === 'loading') {
        gameStatus.value = 'playing'
      }
    } catch (error) {
      console.error('Erreur lors du chargement du puzzle:', error)
      gameStatus.value = 'playing'
    }
  }

  async function submitGuess(characterName: string) {
    if (!puzzle.value || !canGuess.value) return

    // Vérifier si le personnage a déjà été essayé
    const alreadyGuessed = guesses.value.some(
      guess => guess.characterName.toLowerCase() === characterName.toLowerCase()
    )
    
    if (alreadyGuessed) {
      throw new Error(`Vous avez déjà essayé "${characterName}" !`)
    }

    try {
      const result = await apiService.submitGuess({
        puzzle_id: puzzle.value.id,
        guess: characterName,
        mode: mode.value,
        attempt_number: currentAttempt.value,
      })

      // Ajouter le résultat avec le nom du personnage
      guesses.value.push({
        ...result,
        characterName
      })


      // Mettre à jour le statut (plus de limite de tentatives)
      if (result.status === 'win') {
        gameStatus.value = 'won'
        addToCollection(characterName, guesses.value.length) // Passe le nombre d'essais
        recordGamePlayed()
        recordGameWon(guesses.value.length)
        // La streak est mise à jour depuis GameBoard avec un délai pour ne pas spoiler
      }

      currentAttempt.value++

      // Charger les indices si un nouveau palier est atteint
      if (!isGameOver.value) {
        await fetchHints()
      }

      // Sauvegarder l'état
      saveStateToLocalStorage()

      return result
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      throw error
    }
  }

  function setMode(newMode: 'CLASSIC' | 'TMP') {
    mode.value = newMode
  }

  function resetGame() {
    guesses.value = []
    currentAttempt.value = 1
    gameStatus.value = 'playing'
    clearLocalStorage()
  }

  // LocalStorage helpers
  function saveStateToLocalStorage() {
    if (!puzzle.value) return
    
    const state = {
      guesses: guesses.value,
      currentAttempt: currentAttempt.value,
      gameStatus: gameStatus.value,
      puzzleId: puzzle.value.id,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('disneydle_state', JSON.stringify(state))
    
    // Sauvegarde séparée pour la collection
    localStorage.setItem('disneydle_collection', JSON.stringify(collection.value))
  }

  function loadStateFromLocalStorage() {
    const savedCollection = localStorage.getItem('disneydle_collection')
    if (savedCollection) {
      try {
        const parsed = JSON.parse(savedCollection)
        // Migration : Si c'est un tableau de strings (ancienne version), on convertit
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
           collection.value = parsed.map((name: string) => ({
             name,
             attempts: 10, // Valeur par défaut pour les anciens
             unlockedAt: new Date().toISOString()
           }))
           // Sauvegarder la migration tout de suite
           localStorage.setItem('disneydle_collection', JSON.stringify(collection.value))
        } else {
           collection.value = parsed
        }
      } catch (e) {
        console.error('Erreur chargement collection', e)
        collection.value = []
      }
    }

    const savedState = localStorage.getItem('disneydle_state')
    if (!savedState) return
    
    try {
      const state = JSON.parse(savedState)
      
      // Vérifier si c'est bien le puzzle du jour
      if (state.puzzleId === puzzle.value?.id) {
        guesses.value = state.guesses
        currentAttempt.value = state.currentAttempt
        gameStatus.value = state.gameStatus
      } else {
        // C'est un nouveau jour, on reset l'état mais on garde la collection
        localStorage.removeItem('disneydle_state')
      }
    } catch (e) {
      console.error('Erreur parsing state', e)
    }
  }

  function clearLocalStorage() {
    if (!puzzle.value) return
    localStorage.removeItem(`disneydle_${puzzle.value.date}`)
  }

  function addToCollection(characterName: string, attempts: number) {
    const formattedName = characterName
    
    // Vérifier si le personnage est déjà dans la collection
    const exists = collection.value.some(c => c.name === formattedName)
    
    if (!exists) {
      collection.value.push({
        name: formattedName,
        attempts: attempts,
        unlockedAt: new Date().toISOString()
      })
      localStorage.setItem('disneydle_collection', JSON.stringify(collection.value))
    }
  }

  // --- Streak helpers ---
  function getTodayDate(): string {
    const now = new Date()
    return now.toISOString().split('T')[0]! // Format YYYY-MM-DD
  }

  function getYesterdayDate(): string {
    const now = new Date()
    now.setDate(now.getDate() - 1)
    return now.toISOString().split('T')[0]!
  }

  function loadStreak() {
    const saved = localStorage.getItem('disneydle_streak')
    if (saved) {
      try {
        const parsed: StreakStats = JSON.parse(saved)
        const today = getTodayDate()
        const yesterday = getYesterdayDate()

        // Si le dernier jour gagné n'est ni aujourd'hui ni hier, la streak est cassée
        if (parsed.lastWonDate && parsed.lastWonDate !== today && parsed.lastWonDate !== yesterday) {
          streak.value = {
            currentStreak: 0,
            maxStreak: parsed.maxStreak,
            lastWonDate: parsed.lastWonDate
          }
          saveStreak()
        } else {
          streak.value = parsed
        }
      } catch (e) {
        console.error('Erreur chargement streak', e)
      }
    }
  }

  function saveStreak() {
    localStorage.setItem('disneydle_streak', JSON.stringify(streak.value))
  }

  function updateStreak() {
    const today = getTodayDate()
    const yesterday = getYesterdayDate()

    // Déjà gagné aujourd'hui ? On ne compte pas deux fois
    if (streak.value.lastWonDate === today) return

    if (streak.value.lastWonDate === yesterday) {
      // Jour consécutif → on incrémente
      streak.value.currentStreak++
    } else {
      // Streak cassée ou première victoire → on repart à 1
      streak.value.currentStreak = 1
    }

    // Mettre à jour le record
    if (streak.value.currentStreak > streak.value.maxStreak) {
      streak.value.maxStreak = streak.value.currentStreak
    }

    streak.value.lastWonDate = today
    saveStreak()
  }

  // Helper pour obtenir la rareté (utilisable dans les vues)
  function getRarity(attempts: number): { label: string, class: string } {
    if (attempts < 5) return { label: 'Légendaire', class: 'rarity-legendary' }
    if (attempts < 10) return { label: 'Super Rare', class: 'rarity-epic' }
    if (attempts < 20) return { label: 'Rare', class: 'rarity-rare' }
    return { label: 'Commun', class: 'rarity-common' }
  }

  function getCollectedCard(name: string): CollectedCard | undefined {
      return collection.value.find(c => c.name === name)
  }

  // --- Hints helpers ---
  async function fetchHints() {
    if (!puzzle.value) return
    const attempt = currentAttempt.value - 1 // nombre de tentatives effectuées
    if (attempt < 3) return // pas d'indice avant le palier 3

    try {
      const response = await apiService.getHint(puzzle.value.id, attempt)
      if (response.hints.blurred_image) {
        availableHints.value.blurredImage = response.hints.blurred_image
      }
      if (response.hints.phrase) {
        availableHints.value.phrase = response.hints.phrase
      }
      if (response.hints.quote) {
        availableHints.value.quote = response.hints.quote
      }
    } catch (e) {
      console.warn('Impossible de charger les indices', e)
    }
  }

  function revealHint(type: 'blurredImage' | 'phrase' | 'quote') {
    revealedHints.value[type] = true
  }

  // --- Personal Stats helpers ---
  function loadPersonalStats() {
    const saved = localStorage.getItem('disneydle_personal_stats')
    if (saved) {
      try {
        personalStats.value = JSON.parse(saved)
      } catch (e) {
        console.error('Erreur chargement stats perso', e)
      }
    }
  }

  function savePersonalStats() {
    localStorage.setItem('disneydle_personal_stats', JSON.stringify(personalStats.value))
  }

  function recordGamePlayed() {
    // Vérifier qu'on n'a pas déjà compté ce puzzle
    const todayKey = `disneydle_counted_${getTodayDate()}`
    if (localStorage.getItem(todayKey)) return
    localStorage.setItem(todayKey, '1')

    personalStats.value.gamesPlayed++
    savePersonalStats()
  }

  function recordGameWon(attempts: number) {
    personalStats.value.gamesWon++
    
    // Clé de distribution : 1, 2, 3, 4, 5, 6, 7, 8, 9, 10+
    const key = attempts >= 10 ? '10+' : String(attempts)
    personalStats.value.attemptDistribution[key] = 
      (personalStats.value.attemptDistribution[key] || 0) + 1
    
    savePersonalStats()
  }

  // Computed stats
  const winRate = computed(() => {
    if (personalStats.value.gamesPlayed === 0) return 0
    return Math.round((personalStats.value.gamesWon / personalStats.value.gamesPlayed) * 100)
  })

  const averageAttempts = computed(() => {
    const dist = personalStats.value.attemptDistribution
    let total = 0
    let count = 0
    for (const [key, val] of Object.entries(dist)) {
      const numKey = key === '10+' ? 10 : parseInt(key)
      total += numKey * val
      count += val
    }
    return count === 0 ? 0 : Math.round((total / count) * 10) / 10
  })

  return {
    puzzle,
    guesses,
    currentAttempt,
    gameStatus,
    mode,
    collection,
    allCharactersList,
    streak,
    personalStats,
    availableHints,
    revealedHints,
    isGameOver,
    canGuess,
    winRate,
    averageAttempts,
    loadDailyPuzzle,
    submitGuess,
    updateStreak,
    getRarity,
    getCollectedCard,
    fetchHints,
    revealHint,
    loadPersonalStats,
    recordGamePlayed,
    recordGameWon,
    $reset: () => {
        guesses.value = []
        currentAttempt.value = 1
        gameStatus.value = 'playing'
        // On ne reset PAS la collection ni les stats ici
    }
  }
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../../stores/game'
import type { CollectedCard, StreakStats, PersonalStats } from '../../stores/game'

// Mock du service API
vi.mock('../../services/api', () => ({
  apiService: {
    getDailyPuzzle: vi.fn(),
    submitGuess: vi.fn(),
    autocomplete: vi.fn(),
    getAllCharacters: vi.fn(),
    getHint: vi.fn(),
  },
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
    get length() { return Object.keys(store).length },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  }
})()
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true })

describe('Game Store', () => {
  let store: ReturnType<typeof useGameStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameStore()
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorageMock.clear()
  })

  // =============================================
  // Etat initial
  // =============================================
  describe('Etat initial', () => {
    it('demarre avec le status loading', () => {
      expect(store.gameStatus).toBe('loading')
    })

    it('demarre sans puzzle', () => {
      expect(store.puzzle).toBeNull()
    })

    it('demarre avec zero guesses', () => {
      expect(store.guesses).toHaveLength(0)
    })

    it('demarre a la tentative 1', () => {
      expect(store.currentAttempt).toBe(1)
    })

    it('demarre en mode CLASSIC', () => {
      expect(store.mode).toBe('CLASSIC')
    })

    it('demarre avec une collection vide', () => {
      expect(store.collection).toHaveLength(0)
    })

    it('demarre avec une streak a zero', () => {
      expect(store.streak.currentStreak).toBe(0)
      expect(store.streak.maxStreak).toBe(0)
      expect(store.streak.lastWonDate).toBeNull()
    })

    it('demarre avec des stats personnelles vierges', () => {
      expect(store.personalStats.gamesPlayed).toBe(0)
      expect(store.personalStats.gamesWon).toBe(0)
      expect(store.personalStats.attemptDistribution).toEqual({})
    })
  })

  // =============================================
  // Computed
  // =============================================
  describe('Computed', () => {
    it('isGameOver est false au demarrage', () => {
      store.gameStatus = 'playing'
      expect(store.isGameOver).toBe(false)
    })

    it('isGameOver est true quand won', () => {
      store.gameStatus = 'won'
      expect(store.isGameOver).toBe(true)
    })

    it('isGameOver est true quand lost', () => {
      store.gameStatus = 'lost'
      expect(store.isGameOver).toBe(true)
    })

    it('canGuess est true quand playing', () => {
      store.gameStatus = 'playing'
      expect(store.canGuess).toBe(true)
    })

    it('canGuess est false quand won', () => {
      store.gameStatus = 'won'
      expect(store.canGuess).toBe(false)
    })

    it('canGuess est false quand loading', () => {
      store.gameStatus = 'loading'
      expect(store.canGuess).toBe(false)
    })

    it('winRate est 0 sans parties jouees', () => {
      expect(store.winRate).toBe(0)
    })

    it('winRate calcule correctement', () => {
      store.personalStats.gamesPlayed = 10
      store.personalStats.gamesWon = 7
      expect(store.winRate).toBe(70)
    })

    it('averageAttempts est 0 sans donnees', () => {
      expect(store.averageAttempts).toBe(0)
    })

    it('averageAttempts calcule correctement', () => {
      store.personalStats.attemptDistribution = { '1': 2, '3': 4, '5': 4 }
      // (1*2 + 3*4 + 5*4) / (2+4+4) = (2+12+20)/10 = 3.4
      expect(store.averageAttempts).toBe(3.4)
    })
  })

  // =============================================
  // Rarete
  // =============================================
  describe('getRarity', () => {
    it('retourne Legendaire pour < 5 essais', () => {
      expect(store.getRarity(1).label).toBe('Légendaire')
      expect(store.getRarity(4).label).toBe('Légendaire')
    })

    it('retourne Super Rare pour 5-9 essais', () => {
      expect(store.getRarity(5).label).toBe('Super Rare')
      expect(store.getRarity(9).label).toBe('Super Rare')
    })

    it('retourne Rare pour 10-19 essais', () => {
      expect(store.getRarity(10).label).toBe('Rare')
      expect(store.getRarity(19).label).toBe('Rare')
    })

    it('retourne Commun pour 20+ essais', () => {
      expect(store.getRarity(20).label).toBe('Commun')
      expect(store.getRarity(50).label).toBe('Commun')
    })

    it('retourne les bonnes classes CSS', () => {
      expect(store.getRarity(1).class).toBe('rarity-legendary')
      expect(store.getRarity(5).class).toBe('rarity-epic')
      expect(store.getRarity(10).class).toBe('rarity-rare')
      expect(store.getRarity(20).class).toBe('rarity-common')
    })
  })

  // =============================================
  // Streak
  // =============================================
  describe('Streak', () => {
    it('updateStreak passe la streak a 1 sur premiere victoire', () => {
      store.updateStreak()
      expect(store.streak.currentStreak).toBe(1)
      expect(store.streak.maxStreak).toBe(1)
    })

    it('updateStreak ne compte pas deux fois le meme jour', () => {
      store.updateStreak()
      store.updateStreak()
      expect(store.streak.currentStreak).toBe(1)
    })

    it('updateStreak incremente si hier etait gagne', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]!

      store.streak.currentStreak = 3
      store.streak.maxStreak = 5
      store.streak.lastWonDate = yesterdayStr

      store.updateStreak()
      expect(store.streak.currentStreak).toBe(4)
    })

    it('updateStreak remet a 1 si streak cassee', () => {
      store.streak.currentStreak = 5
      store.streak.maxStreak = 5
      store.streak.lastWonDate = '2020-01-01'

      store.updateStreak()
      expect(store.streak.currentStreak).toBe(1)
      expect(store.streak.maxStreak).toBe(5)
    })

    it('updateStreak met a jour le record max', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]!

      store.streak.currentStreak = 5
      store.streak.maxStreak = 5
      store.streak.lastWonDate = yesterdayStr

      store.updateStreak()
      expect(store.streak.maxStreak).toBe(6)
    })

    it('persiste la streak dans localStorage', () => {
      store.updateStreak()
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'disneydle_streak',
        expect.stringContaining('"currentStreak":1')
      )
    })
  })

  // =============================================
  // Stats personnelles
  // =============================================
  describe('Stats personnelles', () => {
    it('recordGamePlayed incremente le compteur', () => {
      store.recordGamePlayed()
      expect(store.personalStats.gamesPlayed).toBe(1)
    })

    it('recordGamePlayed ne compte qu une fois par jour', () => {
      store.recordGamePlayed()
      store.recordGamePlayed()
      expect(store.personalStats.gamesPlayed).toBe(1)
    })

    it('recordGameWon incremente les victoires', () => {
      store.recordGameWon(3)
      expect(store.personalStats.gamesWon).toBe(1)
    })

    it('recordGameWon met a jour la distribution', () => {
      store.recordGameWon(3)
      store.recordGameWon(3)
      store.recordGameWon(5)
      expect(store.personalStats.attemptDistribution['3']).toBe(2)
      expect(store.personalStats.attemptDistribution['5']).toBe(1)
    })

    it('recordGameWon groupe les 10+ ensemble', () => {
      store.recordGameWon(15)
      store.recordGameWon(25)
      expect(store.personalStats.attemptDistribution['10+']).toBe(2)
    })

    it('persiste les stats dans localStorage', () => {
      store.recordGameWon(3)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'disneydle_personal_stats',
        expect.stringContaining('"gamesWon":1')
      )
    })
  })

  // =============================================
  // Collection
  // =============================================
  describe('Collection', () => {
    it('getCollectedCard retourne undefined si pas collecte', () => {
      expect(store.getCollectedCard('Elsa')).toBeUndefined()
    })

    it('getCollectedCard retourne la carte si collectee', () => {
      store.collection.push({
        name: 'Elsa',
        attempts: 3,
        unlockedAt: new Date().toISOString(),
      })
      const card = store.getCollectedCard('Elsa')
      expect(card).toBeDefined()
      expect(card!.attempts).toBe(3)
    })
  })

  // =============================================
  // Indices
  // =============================================
  describe('Indices', () => {
    it('les indices sont null au demarrage', () => {
      expect(store.availableHints.blurredImage).toBeNull()
      expect(store.availableHints.phrase).toBeNull()
      expect(store.availableHints.quote).toBeNull()
    })

    it('les indices ne sont pas reveles au demarrage', () => {
      expect(store.revealedHints.blurredImage).toBe(false)
      expect(store.revealedHints.phrase).toBe(false)
      expect(store.revealedHints.quote).toBe(false)
    })

    it('revealHint marque un indice comme revele', () => {
      store.revealHint('blurredImage')
      expect(store.revealedHints.blurredImage).toBe(true)
      expect(store.revealedHints.phrase).toBe(false)
    })

    it('revealHint fonctionne pour chaque type', () => {
      store.revealHint('phrase')
      store.revealHint('quote')
      expect(store.revealedHints.phrase).toBe(true)
      expect(store.revealedHints.quote).toBe(true)
    })
  })

  // =============================================
  // Reset
  // =============================================
  describe('Reset', () => {
    it('$reset remet les guesses a zero', () => {
      store.guesses.push({
        characterName: 'Elsa',
        movie: { value: 'Frozen', status: 'correct' },
        studio: { value: 'DISNEY', status: 'correct' },
        species: { value: 'Humain', status: 'correct' },
        role: { value: 'Protagoniste', status: 'correct' },
        gender: { value: 'F', status: 'correct' },
        year: { value: '2013', status: 'correct' },
        personality: { value: 'Reservee', status: 'correct' },
        color: { value: 'Bleu', status: 'correct' },
        attempt_number: 1,
        status: 'win',
        is_correct: true,
      } as any)

      store.$reset()
      expect(store.guesses).toHaveLength(0)
      expect(store.currentAttempt).toBe(1)
      expect(store.gameStatus).toBe('playing')
    })

    it('$reset ne supprime pas la collection', () => {
      store.collection.push({
        name: 'Elsa',
        attempts: 1,
        unlockedAt: new Date().toISOString(),
      })

      store.$reset()
      expect(store.collection).toHaveLength(1)
    })
  })

  // =============================================
  // submitGuess (avec mock API)
  // =============================================
  describe('submitGuess', () => {
    it('refuse si pas de puzzle', async () => {
      store.gameStatus = 'playing'
      store.puzzle = null
      const result = await store.submitGuess('Elsa')
      expect(result).toBeUndefined()
    })

    it('refuse si partie terminee', async () => {
      store.gameStatus = 'won'
      store.puzzle = { id: 1, date: '2026-03-02', active_modes: [] }
      const result = await store.submitGuess('Elsa')
      expect(result).toBeUndefined()
    })

    it('rejette un personnage deja essaye', async () => {
      store.gameStatus = 'playing'
      store.puzzle = { id: 1, date: '2026-03-02', active_modes: [] }
      store.guesses.push({
        characterName: 'Elsa',
        movie: { value: 'Frozen', status: 'incorrect' },
        attempt_number: 1,
        status: 'continue',
        is_correct: false,
      } as any)

      await expect(store.submitGuess('Elsa')).rejects.toThrow('déjà essayé')
    })

    it('rejette un personnage deja essaye (case insensitive)', async () => {
      store.gameStatus = 'playing'
      store.puzzle = { id: 1, date: '2026-03-02', active_modes: [] }
      store.guesses.push({
        characterName: 'Elsa',
        movie: { value: 'Frozen', status: 'incorrect' },
        attempt_number: 1,
        status: 'continue',
        is_correct: false,
      } as any)

      await expect(store.submitGuess('elsa')).rejects.toThrow('déjà essayé')
    })
  })
})

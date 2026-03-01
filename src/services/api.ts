import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Character {
  id: number
  name: string
  aliases: string[]
  movie_title: string // Ajout du champ retourné par le backend
}

export interface DailyPuzzle {
  id: number
  date: string
  active_modes: string[]
}

export interface GuessResult {
  movie: string
  studio: string
  species: string
  role: string
  gender: string
  year: string
  personality: string
  color: string
  attempt_number: number
  status: 'continue' | 'win' | 'lose'
  is_correct: boolean
}

export interface GuessPayload {
  puzzle_id: number
  guess: string
  mode: 'CLASSIC' | 'TMP'
  attempt_number: number
}

// Interface pour les indices
export interface HintResponse {
  attempt: number
  hints: {
    blurred_image?: string  // nom du personnage (pour construire l'URL de l'image)
    phrase?: string         // phrase descriptive (palier 6)
    quote?: string          // citation célèbre (palier 9)
  }
}

// API Functions
export const apiService = {
  // Récupérer le puzzle quotidien
  async getDailyPuzzle(): Promise<DailyPuzzle> {
    const response = await api.get('/daily/')
    return response.data
  },

  // Soumettre une devinette
  async submitGuess(payload: GuessPayload): Promise<GuessResult> {
    const response = await api.post('/guess/', payload)
    return response.data
  },

  // Autocomplétion des personnages
  async autocomplete(query: string): Promise<Character[]> {
    if (query.length < 2) return []
    const response = await api.get(`/autocomplete/?q=${encodeURIComponent(query)}`)
    return response.data
  },

  // Liste de tous les personnages
  async getAllCharacters(): Promise<Character[]> {
    const response = await api.get('/characters/')
    return response.data
  },

  // Récupérer les indices par palier
  async getHint(puzzleId: number, attempt: number): Promise<HintResponse> {
    const response = await api.get(`/hint/?puzzle_id=${puzzleId}&attempt=${attempt}`)
    return response.data
  },

  // Stats admin (protégé par token en header Authorization)
  async getStats(token: string): Promise<StatsResponse> {
    const response = await api.get('/stats/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },
}

// Types pour les stats
export interface DailyStatsData {
  date: string
  character: string
  visits: number
  wins: number
  median: number | null
  q1: number | null
  q3: number | null
}

export interface MonthlyStatsData {
  month: string
  visits: number
  wins: number
  median: number | null
}

export interface StatsResponse {
  summary: {
    total_visits: number
    total_wins: number
    global_median: number | null
  }
  daily: DailyStatsData[]
  monthly: MonthlyStatsData[]
}

export default api

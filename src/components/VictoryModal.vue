<template>
  <div v-if="show" class="victory-modal-overlay">
    <!-- Fond sombre -->
    <div class="fireworks-backdrop"></div>
    <!-- Canvas feux d'artifice (par-dessus le fond) -->
    <canvas ref="fireworksCanvas" class="fireworks-canvas"></canvas>

    <div class="victory-modal">
      <div class="modal-content">
        <h2 class="victory-title">VICTOIRE ! </h2>
        <p class="victory-subtitle">Tu as trouvé <strong>{{ characterName }}</strong> en {{ attempts }} essai{{ attempts > 1 ? 's' : '' }} !</p>

        <!-- Carte Personnage - Style identique à l'Album -->
        <div class="card-showcase">
          <div class="victory-card-wrapper" :class="rarityClass">
             <div class="card-shimmer-mini"></div>
             <div class="card-mini-header">
               <span class="card-mini-rarity">{{ rarityLabel }}</span>
             </div>
             
             <div class="card-mini-image">
               <img 
                 v-if="!imageError"
                 :src="characterImageUrl" 
                 :alt="characterName"
                 class="card-mini-img"
                 @error="imageError = true"
               />
               <span v-else class="card-mini-initial">{{ characterName.charAt(0) }}</span>
             </div>
             
             <div class="card-mini-body">
               <div class="card-mini-name">{{ characterName }}</div>
             </div>
             <div class="glow"></div>
          </div>
        </div>

        <!-- Résumé des tentatives avec grille stylée -->
        <div class="score-recap">
          <p class="recap-title">Résumé</p>
          <div class="recap-grid">
            <div v-for="(cells, idx) in guessStatusGrid" :key="idx" class="recap-row">
              <span class="attempt-num">{{ idx + 1 }}</span>
              <div class="recap-cells">
                <div
                  v-for="(cell, cIdx) in cells"
                  :key="cIdx"
                  class="recap-cell"
                  :class="cell"
                >
                  <svg v-if="cell === 'correct'" viewBox="0 0 24 24" class="cell-icon"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
                  <svg v-else-if="cell === 'partial'" viewBox="0 0 24 24" class="cell-icon"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
                  <svg v-else viewBox="0 0 24 24" class="cell-icon"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p class="collection-msg">Ajouté à ton album !</p>

        <!-- Streak -->
        <div v-if="gameStore.streak.currentStreak > 0" class="streak-section">
          <span class="streak-icon">🔥</span>
          <span class="streak-value">{{ gameStore.streak.currentStreak }}</span>
          <span class="streak-label">jour{{ gameStore.streak.currentStreak > 1 ? 's' : '' }} de suite</span>
        </div>

        <!-- Compte à rebours prochain puzzle -->
        <div class="countdown-section">
          <span class="countdown-label">Prochain personnage dans</span>
          <div class="countdown-timer">
            <div class="countdown-unit">
              <span class="countdown-number">{{ countdown.hours }}</span>
              <span class="countdown-suffix">h</span>
            </div>
            <span class="countdown-sep">:</span>
            <div class="countdown-unit">
              <span class="countdown-number">{{ countdown.minutes }}</span>
              <span class="countdown-suffix">m</span>
            </div>
            <span class="countdown-sep">:</span>
            <div class="countdown-unit">
              <span class="countdown-number">{{ countdown.seconds }}</span>
              <span class="countdown-suffix">s</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
            <button class="share-btn" @click="shareResult">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                {{ shareText }}
            </button>
            <button class="close-btn" @click="$emit('close')">
                Continuer
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useGameStore } from '../stores/game'
import { getCharacterCard } from '../utils/characterImage'

const props = defineProps<{
    show: boolean,
    characterName: string,
    attempts: number
}>()

const emit = defineEmits(['close'])
const gameStore = useGameStore()
const shareText = ref('Partager mon score ')
const imageError = ref(false)

// --- COUNTDOWN ---
const countdown = ref({ hours: '00', minutes: '00', seconds: '00' })
let countdownInterval: ReturnType<typeof setInterval> | null = null

function updateCountdown() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  
  const diff = tomorrow.getTime() - now.getTime()
  
  if (diff <= 0) {
    countdown.value = { hours: '00', minutes: '00', seconds: '00' }
    return
  }
  
  const h = Math.floor(diff / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)
  
  countdown.value = {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0')
  }
}

function startCountdown() {
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

// --- FIREWORKS ENGINE ---
const fireworksCanvas = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let particles: Particle[] = []
let rockets: Rocket[] = []
let ctx: CanvasRenderingContext2D | null = null
let canvasW = 0
let canvasH = 0

const COLORS = [
  '#fbbf24', '#f59e0b', '#f472b6', '#ec4899',
  '#60a5fa', '#3b82f6', '#34d399', '#10b981',
  '#c084fc', '#a78bfa', '#fb7185', '#f97316',
  '#facc15', '#4ade80', '#38bdf8', '#e879f9',
]

interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number; maxLife: number
  color: string
  size: number
  trail: { x: number; y: number; alpha: number }[]
  gravity: number
  friction: number
  sparkle: boolean
}

interface Rocket {
  x: number; y: number
  vx: number; vy: number
  targetY: number
  color: string
  trail: { x: number; y: number; alpha: number }[]
  exploded: boolean
}

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function createRocket(): Rocket {
  const x = randomBetween(canvasW * 0.15, canvasW * 0.85)
  return {
    x,
    y: canvasH,
    vx: randomBetween(-1.5, 1.5),
    vy: randomBetween(-14, -10),
    targetY: randomBetween(canvasH * 0.1, canvasH * 0.35),
    color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
    trail: [],
    exploded: false,
  }
}

function explodeRocket(rocket: Rocket) {
  const numParticles = Math.floor(randomBetween(60, 100))
  const baseColor = rocket.color
  // Choisir un pattern d'explosion
  const pattern = Math.floor(Math.random() * 4)

  for (let i = 0; i < numParticles; i++) {
    const angle = (Math.PI * 2 * i) / numParticles + randomBetween(-0.1, 0.1)
    let speed: number

    switch (pattern) {
      case 0: // Sphérique classique
        speed = randomBetween(2, 8)
        break
      case 1: // Double anneau
        speed = i % 2 === 0 ? randomBetween(5, 8) : randomBetween(2, 4)
        break
      case 2: // Étoile
        speed = i % 5 === 0 ? randomBetween(7, 10) : randomBetween(2, 5)
        break
      default: // Chrysanthème
        speed = randomBetween(1, 9)
    }

    const color = Math.random() > 0.7
      ? COLORS[Math.floor(Math.random() * COLORS.length)]!
      : baseColor

    particles.push({
      x: rocket.x,
      y: rocket.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: randomBetween(60, 120),
      color,
      size: randomBetween(2, 4.5),
      trail: [],
      gravity: 0.04 + Math.random() * 0.03,
      friction: 0.98,
      sparkle: Math.random() > 0.6,
    })
  }

  // Particules de flash central
  for (let i = 0; i < 8; i++) {
    particles.push({
      x: rocket.x + randomBetween(-3, 3),
      y: rocket.y + randomBetween(-3, 3),
      vx: randomBetween(-0.5, 0.5),
      vy: randomBetween(-0.5, 0.5),
      life: 1,
      maxLife: 15,
      color: '#ffffff',
      size: randomBetween(4, 8),
      trail: [],
      gravity: 0,
      friction: 0.9,
      sparkle: false,
    })
  }
}

function updateAndDraw() {
  if (!ctx) return

  // Effacer le canvas (transparent, le backdrop CSS gère le fond)
  ctx.clearRect(0, 0, canvasW, canvasH)

  // Update & draw rockets
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i]!
    r.trail.push({ x: r.x, y: r.y, alpha: 1 })
    if (r.trail.length > 20) r.trail.shift()

    r.x += r.vx
    r.y += r.vy
    r.vy += 0.05 // légère gravité

    // Dessiner la traînée de la fusée
    for (let t = 0; t < r.trail.length; t++) {
      const pt = r.trail[t]!
      const alpha = (t / r.trail.length) * 0.6
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`
      ctx.fill()
    }

    // Dessiner la fusée
    ctx.beginPath()
    ctx.arc(r.x, r.y, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()

    // Exploser quand elle atteint la hauteur cible
    if (r.y <= r.targetY) {
      explodeRocket(r)
      rockets.splice(i, 1)
    }
  }

  // Update & draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]!

    p.trail.push({ x: p.x, y: p.y, alpha: p.life })
    if (p.trail.length > 10) p.trail.shift()

    p.vx *= p.friction
    p.vy *= p.friction
    p.vy += p.gravity
    p.x += p.vx
    p.y += p.vy
    p.life -= 1 / p.maxLife

    if (p.life <= 0) {
      particles.splice(i, 1)
      continue
    }

    const alpha = Math.max(0, p.life)

    // Dessiner la traînée
    for (let t = 0; t < p.trail.length; t++) {
      const pt = p.trail[t]!
      const trailAlpha = (t / p.trail.length) * alpha * 0.4
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, p.size * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = hexToRGBA(p.color, trailAlpha)
      ctx.fill()
    }

    // Dessiner la particule
    const displayAlpha = p.sparkle
      ? alpha * (0.5 + 0.5 * Math.sin(Date.now() * 0.02 + i))
      : alpha
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = hexToRGBA(p.color, displayAlpha)
    ctx.shadowBlur = 15
    ctx.shadowColor = p.color
    ctx.fill()
    ctx.shadowBlur = 0
  }

  animationId = requestAnimationFrame(updateAndDraw)
}

function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function launchWave() {
  const count = Math.floor(randomBetween(3, 7))
  for (let i = 0; i < count; i++) {
    setTimeout(() => rockets.push(createRocket()), i * randomBetween(80, 250))
  }
}

function startFireworks() {
  const canvas = fireworksCanvas.value
  if (!canvas) return

  const parent = canvas.parentElement
  if (!parent) return

  const dpr = window.devicePixelRatio || 1
  canvasW = parent.clientWidth
  canvasH = parent.clientHeight
  canvas.width = canvasW * dpr
  canvas.height = canvasH * dpr
  canvas.style.width = canvasW + 'px'
  canvas.style.height = canvasH + 'px'
  ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.scale(dpr, dpr)

  ctx.clearRect(0, 0, canvasW, canvasH)
  particles = []
  rockets = []

  // Lancer des vagues de fusées
  launchWave()
  const waveInterval = setInterval(() => {
    launchWave()
  }, 1200)

  // Arrêter les nouvelles fusées après 12s mais laisser les particules finir
  setTimeout(() => clearInterval(waveInterval), 12000)

  updateAndDraw()
}

function stopFireworks() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  particles = []
  rockets = []
  ctx = null
}

// Démarrer les feux d'artifice dès que le composant est monté (v-if fait qu'il est monté quand show=true)
onMounted(async () => {
  await nextTick()
  startFireworks()
  startCountdown()
})

onBeforeUnmount(() => {
  stopFireworks()
  stopCountdown()
})

// URL de l'image du personnage (carte grande pour la victoire)
const characterImageUrl = computed(() => getCharacterCard(props.characterName))

// Rareté basée sur le nombre de tentatives (même logique que le store/Album)
const rarityLabel = computed(() => {
  return gameStore.getRarity(props.attempts).label
})

// Classe CSS de rareté (même système que l'Album)
const rarityClass = computed(() => {
  return gameStore.getRarity(props.attempts).class
})

// Convertit le status d'un champ en string normalisé
function getStatus(field: any): string {
    if (typeof field === 'object' && field !== null) {
        const s = (field.status || '').toLowerCase()
        if (s === 'correct') return 'correct'
        if (s === 'partial') return 'partial'
        return 'wrong'
    }
    const s = String(field || '').toLowerCase()
    if (s === 'correct') return 'correct'
    if (s === 'partial') return 'partial'
    return 'wrong'
}

// Convertit le status d'un champ (objet ou string) en emoji (pour le partage texte)
function statusToEmoji(field: any): string {
    const s = getStatus(field)
    if (s === 'correct') return '🟩'
    if (s === 'partial') return '🟨'
    return '🟥'
}

// Grille de statuts pour l'affichage stylé dans la pop-up
const guessStatusGrid = computed(() => {
    return gameStore.guesses.map(guess => {
        return [
            guess.movie, guess.studio, guess.species, guess.role,
            guess.gender, guess.year, guess.has_powers, guess.personality, guess.color
        ].map(getStatus)
    })
})

// Génère les lignes d'emoji pour chaque tentative
const emojiLines = computed(() => {
    return gameStore.guesses.map(guess => {
        return [
            guess.movie, guess.studio, guess.species, guess.role,
            guess.gender, guess.year, guess.has_powers, guess.personality, guess.color
        ].map(statusToEmoji).join('')
    })
})

const shareResult = async () => {
    let text = ` Disneydle - ${props.characterName}\n`
    text += ` Trouvé en ${props.attempts} essai${props.attempts > 1 ? 's' : ''} !\n`
    
    // Ajouter la streak si > 0
    if (gameStore.streak.currentStreak > 0) {
      text += `🔥 Streak : ${gameStore.streak.currentStreak} jour${gameStore.streak.currentStreak > 1 ? 's' : ''}\n`
    }
    text += '\n'

    emojiLines.value.forEach((line, idx) => {
        text += `${idx + 1}. ${line}\n`
    })

    text += `\nJoue sur disneydle.io `

    try {
        await navigator.clipboard.writeText(text)
        shareText.value = 'Copié !'
        setTimeout(() => { shareText.value = 'Partager mon score ' }, 2500)
    } catch (err) {
        console.error('Erreur copie', err)
        // Fallback : ouvrir une popup de partage native si dispo
        try {
            await navigator.share({ text })
            shareText.value = 'Partagé ! '
        } catch {
            shareText.value = 'Erreur de copie '
        }
        setTimeout(() => { shareText.value = 'Partager mon score' }, 2500)
    }
}
</script>

<style scoped>
.victory-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.4s ease-out;
  padding: 10px 0;
  overflow-y: auto;
}

/* Fond sombre séparé (en dessous du canvas) */
.fireworks-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 0;
}

/* Canvas feux d'artifice (par-dessus le fond sombre) */
.fireworks-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.victory-modal {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 2px solid #fbbf24;
  border-radius: 20px;
  padding: 28px 24px 20px;
  text-align: center;
  position: relative;
  max-width: 440px;
  max-height: calc(100vh - 20px);
  overflow-y: auto;
  width: 92%;
  box-shadow: 0 0 50px rgba(251, 191, 36, 0.3);
  animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 2;
  flex-shrink: 0;
}

.victory-title {
  color: #fbbf24;
  font-family: 'DisneyFont', sans-serif; /* Si dispo */
  font-size: 1.8rem;
  margin-bottom: 6px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.victory-subtitle {
  color: #e2e8f0;
  font-size: 1.05rem;
  margin-bottom: 20px;
}

/* --- CARTE STYLE ALBUM --- */
.card-showcase {
    perspective: 1000px;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.victory-card-wrapper {
    width: 120px;
    aspect-ratio: 2/3;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 12px;
    padding: 8px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    border: 2px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    animation: floatingCard 3s ease-in-out infinite;
    transform-style: preserve-3d;
}

/* Rareté Légendaire - Or */
.victory-card-wrapper.rarity-legendary {
    border-color: #FCD34D;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 25px rgba(252, 211, 77, 0.3);
}
.victory-card-wrapper.rarity-legendary .card-mini-rarity { color: #FCD34D; }
.victory-card-wrapper.rarity-legendary .card-mini-image { border-color: #FCD34D; background: linear-gradient(135deg, #d97706 0%, #92400e 100%); }

/* Rareté Épique - Violet */
.victory-card-wrapper.rarity-epic {
    border-color: #c084fc;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 25px rgba(192, 132, 252, 0.3);
}
.victory-card-wrapper.rarity-epic .card-mini-rarity { color: #c084fc; }
.victory-card-wrapper.rarity-epic .card-mini-image { border-color: #c084fc; background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%); }

/* Rareté Rare - Bleu */
.victory-card-wrapper.rarity-rare {
    border-color: #60a5fa;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 25px rgba(96, 165, 250, 0.3);
}
.victory-card-wrapper.rarity-rare .card-mini-rarity { color: #60a5fa; }
.victory-card-wrapper.rarity-rare .card-mini-image { border-color: #60a5fa; background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%); }

/* Rareté Commun - Gris */
.victory-card-wrapper.rarity-common {
    border-color: #94a3b8;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.victory-card-wrapper.rarity-common .card-mini-rarity { color: #94a3b8; }
.victory-card-wrapper.rarity-common .card-mini-image { border-color: #94a3b8; background: linear-gradient(135deg, #475569 0%, #0f172a 100%); }

/* Shimmer */
.card-shimmer-mini {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, transparent 50%);
  background-size: 200% 100%;
  animation: miniShimmer 3s infinite linear;
  pointer-events: none;
  z-index: 1;
}

@keyframes miniShimmer {
  0% { background-position: 150% 0; }
  100% { background-position: -150% 0; }
}

/* Header de la carte */
.card-mini-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
}

.card-mini-rarity {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

/* Image de la carte */
.card-mini-image {
  flex: 1;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 6px;
  border: 2px solid #D4B874;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.card-mini-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.card-mini-initial {
  font-family: 'Waltograph', sans-serif;
  font-size: 36px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

/* Nom */
.card-mini-body {
  text-align: center;
}

.card-mini-name {
  color: white;
  font-family: 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 12px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

/* Lueur tournante */
.glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%);
    transform: rotate(0deg);
    pointer-events: none;
    animation: rotateGlow 6s linear infinite;
}

/* --- BOUTONS --- */
.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.share-btn {
    background: #10b981;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}

.share-btn:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
}

.close-btn {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.3);
    color: #94a3b8;
    padding: 8px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.2s;
}

.close-btn:hover {
    background: rgba(255,255,255,0.1);
    color: white;
}

.collection-msg {
    color: #94a3b8;
    font-style: italic;
    font-size: 0.85rem;
    margin-bottom: 12px;
}

/* Streak dans la modale */
.streak-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 18px;
    padding: 10px 18px;
    background: rgba(251, 191, 36, 0.12);
    border: 1px solid rgba(251, 191, 36, 0.3);
    border-radius: 12px;
}

.streak-icon {
    font-size: 1.2rem;
}

.streak-value {
    font-size: 1.2rem;
    font-weight: 800;
    color: #fbbf24;
}

.streak-label {
    font-size: 0.85rem;
    color: #e2e8f0;
}

/* --- ANIMATIONS --- */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes scaleUp {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

@keyframes floatingCard {
    0%, 100% { transform: translateY(0) rotateY(0deg); }
    50% { transform: translateY(-10px) rotateY(10deg); }
}

@keyframes rotateGlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* --- RÉSUMÉ SCORE --- */
.score-recap {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px 12px;
    margin-bottom: 14px;
    max-height: 130px;
    overflow-y: auto;
}

.recap-title {
    color: #fbbf24;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin: 0 0 8px 0;
}

.recap-grid {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.recap-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.attempt-num {
    color: #475569;
    font-size: 0.7rem;
    font-weight: 700;
    min-width: 16px;
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.recap-cells {
    display: flex;
    gap: 3px;
    flex: 1;
}

.recap-cell {
    width: 22px;
    height: 22px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.recap-cell.correct {
    background: linear-gradient(135deg, #059669, #10b981);
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    color: #d1fae5;
}

.recap-cell.partial {
    background: linear-gradient(135deg, #d97706, #f59e0b);
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
    color: #fef3c7;
}

.recap-cell.wrong {
    background: linear-gradient(135deg, #991b1b, #dc2626);
    box-shadow: 0 0 6px rgba(220, 38, 38, 0.3);
    color: #fecaca;
}

.cell-icon {
    width: 12px;
    height: 12px;
}

/* --- COMPTE À REBOURS --- */
.countdown-section {
    text-align: center;
    margin-bottom: 16px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
}

.countdown-label {
    display: block;
    color: #94a3b8;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 8px;
}

.countdown-timer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.countdown-unit {
    display: flex;
    align-items: baseline;
    gap: 1px;
}

.countdown-number {
    font-size: 1.6rem;
    font-weight: 800;
    color: #fbbf24;
    font-variant-numeric: tabular-nums;
    letter-spacing: 1px;
    text-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
}

.countdown-suffix {
    font-size: 0.7rem;
    color: #64748b;
    font-weight: 600;
}

.countdown-sep {
    color: #475569;
    font-size: 1.4rem;
    font-weight: 300;
    margin: 0 2px;
}
</style>

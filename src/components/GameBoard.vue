<template>
  <div class="game-container">

    <header class="game-header">
      <!-- Zone Titre & Logo -->
      <div class="disney-logo-wrapper">
        <div class="disney-logo">
          <h1 class="disney-title">
            Disneydle
          </h1>
          <img 
            src="/Peter-Pan-PNG-Clipart-Background.png" 
            alt="Peter Pan" 
            class="peter-pan-img"
          />
          <div class="peter-pan-star"></div>
          <div class="peter-pan-stars">
            <!-- Grande étoile (Second star to the right) -->
            <svg class="disney-star star-big" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="starGlow1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="white" stop-opacity="1"/>
                  <stop offset="20%" stop-color="white" stop-opacity="0.7"/>
                  <stop offset="50%" stop-color="white" stop-opacity="0.2"/>
                  <stop offset="100%" stop-color="white" stop-opacity="0"/>
                </radialGradient>
                <filter id="starBlur1">
                  <feGaussianBlur stdDeviation="1.5"/>
                </filter>
              </defs>
              <!-- Halo large -->
              <circle cx="50" cy="50" r="22" fill="url(#starGlow1)"/>
              <!-- Étoile 8 branches style diamant -->
              <!-- Branche verticale (la plus longue) -->
              <polygon points="50,5 53,47 50,50 47,47" fill="white" opacity="0.9"/>
              <polygon points="50,95 53,53 50,50 47,53" fill="white" opacity="0.9"/>
              <!-- Branche horizontale -->
              <polygon points="12,50 47,47 50,50 47,53" fill="white" opacity="0.85"/>
              <polygon points="88,50 53,47 50,50 53,53" fill="white" opacity="0.85"/>
              <!-- Branche diagonale haut-gauche / bas-droite -->
              <polygon points="26,26 47,48 50,50 48,47" fill="white" opacity="0.6"/>
              <polygon points="74,74 53,52 50,50 52,53" fill="white" opacity="0.6"/>
              <!-- Branche diagonale haut-droite / bas-gauche -->
              <polygon points="74,26 52,47 50,50 53,48" fill="white" opacity="0.6"/>
              <polygon points="26,74 48,53 50,50 47,52" fill="white" opacity="0.6"/>
              <!-- Noyau lumineux -->
              <circle cx="50" cy="50" r="5" fill="white" filter="url(#starBlur1)"/>
              <circle cx="50" cy="50" r="3" fill="white"/>
            </svg>
            <!-- Petite étoile -->
            <svg class="disney-star star-small" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="starGlow2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="white" stop-opacity="0.9"/>
                  <stop offset="20%" stop-color="white" stop-opacity="0.5"/>
                  <stop offset="50%" stop-color="white" stop-opacity="0.15"/>
                  <stop offset="100%" stop-color="white" stop-opacity="0"/>
                </radialGradient>
                <filter id="starBlur2">
                  <feGaussianBlur stdDeviation="1.2"/>
                </filter>
              </defs>
              <circle cx="50" cy="50" r="20" fill="url(#starGlow2)"/>
              <!-- Branche verticale -->
              <polygon points="50,12 52.5,47 50,50 47.5,47" fill="white" opacity="0.85"/>
              <polygon points="50,88 52.5,53 50,50 47.5,53" fill="white" opacity="0.85"/>
              <!-- Branche horizontale -->
              <polygon points="18,50 47,47.5 50,50 47,52.5" fill="white" opacity="0.8"/>
              <polygon points="82,50 53,47.5 50,50 53,52.5" fill="white" opacity="0.8"/>
              <!-- Branche diagonale haut-gauche / bas-droite -->
              <polygon points="30,30 47.5,48.5 50,50 48.5,47.5" fill="white" opacity="0.5"/>
              <polygon points="70,70 52.5,51.5 50,50 51.5,52.5" fill="white" opacity="0.5"/>
              <!-- Branche diagonale haut-droite / bas-gauche -->
              <polygon points="70,30 51.5,47.5 50,50 52.5,48.5" fill="white" opacity="0.5"/>
              <polygon points="30,70 48.5,52.5 50,50 47.5,51.5" fill="white" opacity="0.5"/>
              <!-- Noyau -->
              <circle cx="50" cy="50" r="4" fill="white" filter="url(#starBlur2)"/>
              <circle cx="50" cy="50" r="2.5" fill="white"/>
            </svg>
          </div>
        </div>
      </div>

       <!-- Bouton Album (Intégré sous le titre à droite ou flottant) -->
       <div class="header-actions">
        <!-- Streak -->
        <div class="streak-badge" :class="{ 'streak-active': gameStore.streak.currentStreak > 0 }" :title="`Record : ${gameStore.streak.maxStreak} jour${gameStore.streak.maxStreak > 1 ? 's' : ''}`">
          <img src="/streak-flame.svg" alt="Streak" class="streak-flame" width="22" height="22" />
          <span class="streak-count">{{ gameStore.streak.currentStreak }}</span>
        </div>
        <!-- Bouton Aide -->
        <button @click="showHelp = true" class="icon-btn tooltipped" aria-label="Aide" title="Comment jouer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </button>
        <!-- Bouton Reset déplacé ici aussi pour regrouper les actions -->
        <button @click="resetGame" class="icon-btn tooltipped" aria-label="Nouvelle Partie" title="Nouvelle Partie">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
        </button>
        <button @click="showStats = true" class="icon-btn tooltipped" aria-label="Statistiques" title="Statistiques">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
        </button>
        <button @click="showAlbum = true" class="icon-btn tooltipped" aria-label="Mon Album" title="Mon Album">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </button>
      </div>

    </header>

    <!-- Panneau d'indices -->
    <div v-if="hasAnyHint" class="hints-panel">
      <div class="hints-header">
        <span class="hints-label">Indices</span>
        <span class="hints-subtitle">— cliquez pour révéler —</span>
      </div>

      <div class="hints-cards">
        <!-- Image floutée -->
        <div 
          v-if="gameStore.availableHints.blurredImage" 
          class="hint-card" 
          :class="{ 'hint-card--revealed': gameStore.revealedHints.blurredImage }"
          @click="!gameStore.revealedHints.blurredImage && gameStore.revealHint('blurredImage')"
        >
          <div class="hint-card-inner">
            <div class="hint-card-front">
              <div class="hint-card-tier">3</div>
              <svg class="hint-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <span class="hint-card-name">Image</span>
            </div>
            <div class="hint-card-back">
              <div class="hint-blurred-wrapper">
                <img 
                  :src="getCharacterCard(gameStore.availableHints.blurredImage)"
                  alt="Indice visuel"
                  class="hint-blurred-img"
                  @error="($event.target as HTMLImageElement).style.display='none'"
                />
              </div>
            </div>
          </div>
        </div>

        <!--Phrase descriptive -->
        <div 
          v-if="gameStore.availableHints.phrase" 
          class="hint-card" 
          :class="{ 'hint-card--revealed': gameStore.revealedHints.phrase }"
          @click="!gameStore.revealedHints.phrase && gameStore.revealHint('phrase')"
        >
          <div class="hint-card-inner">
            <div class="hint-card-front">
              <div class="hint-card-tier">6</div>
              <svg class="hint-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span class="hint-card-name">Description</span>
            </div>
            <div class="hint-card-back">
              <div class="hint-card-back-text">
                <p class="hint-revealed-text">« {{ gameStore.availableHints.phrase }} »</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Citation célèbre -->
        <div 
          v-if="gameStore.availableHints.quote" 
          class="hint-card" 
          :class="{ 'hint-card--revealed': gameStore.revealedHints.quote }"
          @click="!gameStore.revealedHints.quote && gameStore.revealHint('quote')"
        >
          <div class="hint-card-inner">
            <div class="hint-card-front">
              <div class="hint-card-tier">9</div>
              <svg class="hint-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span class="hint-card-name">Citation</span>
            </div>
            <div class="hint-card-back">
              <div class="hint-card-back-text hint-card-back-quote">
                <p class="hint-revealed-text hint-revealed-quote">« {{ gameStore.availableHints.quote }} »</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone de saisie -->
    <!-- FORCAGE DE L'AFFICHAGE (Hack temporaire si gameStatus ne se met pas à jour -->
    <!-- J'enlève le v-if ou vérifie qu'il est true -->
    <div class="input-section">
      <CharacterAutocomplete 
        @select="handleGuess"
        class="character-input"
      />
    </div>

    <!-- Tableau des catégories -->
    <div class="categories-table">
      <div class="category-header">
        <div class="category-cell character-col">Personnage</div>
        <div class="category-cell">Film</div>
        <div class="category-cell">Studio</div>
        <div class="category-cell">Espèce</div>
        <div class="category-cell">Rôle</div>
        <div class="category-cell">Genre</div>
        <div class="category-cell">Année du film</div>
        <div class="category-cell">Trait de Personnalité</div>
        <div class="category-cell">Couleur(s) Caractéristique(s)</div>
      </div>
      <div class="category-separator"></div>
      
      <!-- Lignes de réponses -->
      <div class="guesses-container">
        <div v-for="(guess, guessIndex) in [...gameStore.guesses].reverse()" :key="guess.characterName + guessIndex" class="guess-row-grid">
          <div 
            class="character-name-cell" 
            :class="{ 'reveal-animation': shouldAnimate(gameStore.guesses.length - 1 - guessIndex) }" 
            :style="shouldAnimate(gameStore.guesses.length - 1 - guessIndex) ? { animationDelay: '0s' } : {}">
            <img 
              :src="getCharacterIcon(guess.characterName)" 
              :alt="guess.characterName"
              class="guess-icon"
              @error="($event.target as HTMLImageElement).style.display='none'"
            />
            <span class="guess-name-text">{{ guess.characterName.toUpperCase() }}</span>
          </div>
          <div 
            class="result-cell" 
            :class="[getResultClass(guess.movie), { 'reveal-animation': shouldAnimate(gameStore.guesses.length - 1 - guessIndex) }]" 
            :style="shouldAnimate(gameStore.guesses.length - 1 - guessIndex) ? { animationDelay: '0.3s' } : {}">
            {{ getResultText(guess.movie) }}
          </div>
          <div 
            class="result-cell" 
            :class="[getResultClass(guess.studio), { 'reveal-animation': shouldAnimate(gameStore.guesses.length - 1 - guessIndex) }]" 
            :style="shouldAnimate(gameStore.guesses.length - 1 - guessIndex) ? { animationDelay: '0.6s' } : {}">
            {{ getResultText(guess.studio) }}
          </div>
          <div 
            class="result-cell" 
            :class="[getResultClass(guess.species), { 'reveal-animation': shouldAnimate(gameStore.guesses.length - 1 - guessIndex) }]" 
            :style="shouldAnimate(gameStore.guesses.length - 1 - guessIndex) ? { animationDelay: '0.9s' } : {}">
            {{ getResultText(guess.species) }}
          </div>
          <div 
            class="result-cell" 
            :class="[getResultClass(guess.role), { 'reveal-animation': shouldAnimate(gameStore.guesses.length - 1 - guessIndex) }]" 
            :style="shouldAnimate(gameStore.guesses.length - 1 - guessIndex) ? { animationDelay: '1.2s' } : {}">
            {{ getResultText(guess.role) }}
          </div>
          <div 
            class="result-cell" 
            :class="[getResultClass(guess.gender), { 'reveal-animation': shouldAnimate(gameStore.guesses.length - 1 - guessIndex) }]" 
            :style="shouldAnimate(gameStore.guesses.length - 1 - guessIndex) ? { animationDelay: '1.5s' } : {}">
            {{ getResultText(guess.gender) }}
          </div>
          <div 
            class="result-cell" 
            :class="[getResultClass(guess.year), { 'reveal-animation': shouldAnimate(gameStore.guesses.length - 1 - guessIndex) }]" 
            :style="shouldAnimate(gameStore.guesses.length - 1 - guessIndex) ? { animationDelay: '1.8s' } : {}">
            {{ getResultText(guess.year) }}
          </div>

          <div 
            class="result-cell" 
            :class="[getResultClass(guess.personality), { 'reveal-animation': shouldAnimate(gameStore.guesses.length - 1 - guessIndex) }]" 
            :style="shouldAnimate(gameStore.guesses.length - 1 - guessIndex) ? { animationDelay: '2.1s' } : {}">
            {{ getResultText(guess.personality) }}
          </div>
          <div 
            class="result-cell" 
            :class="[getResultClass(guess.color), { 'reveal-animation': shouldAnimate(gameStore.guesses.length - 1 - guessIndex) }]" 
            :style="shouldAnimate(gameStore.guesses.length - 1 - guessIndex) ? { animationDelay: '2.4s' } : {}">
            {{ getResultText(guess.color) }}
          </div>
        </div>
      </div>
      
      <!-- Légende -->
      <div class="legend">
        <div class="legend-item">
          <div class="legend-box correct"></div>
          <span>Correct</span>
        </div>
        <div class="legend-item">
          <div class="legend-box partial"></div>
          <span>Partiellement Correct</span>
        </div>
        <div class="legend-item">
          <div class="legend-box incorrect"></div>
          <span>Incorrect</span>
        </div>
      </div>
    </div>

    <!-- Modale de Victoire (Hors du tableau) -->
    <VictoryModal 
        v-if="showVictoryModal"
        :show="showVictoryModal"
        :character-name="(gameStore.guesses.length > 0 && gameStore.guesses[gameStore.guesses.length - 1]) ? gameStore.guesses[gameStore.guesses.length - 1]!.characterName : 'Mystère'"
        :attempts="gameStore.guesses.length"
        @close="showVictoryModal = false"
    />

    <!-- Album Modal (Utilise le vrai composant Album.vue) -->
    <Album v-if="showAlbum" @close="showAlbum = false" />

    <!-- Stats Modal -->
    <StatsModal v-if="showStats" @close="showStats = false" />

    <!-- Help Modal -->
    <HelpModal v-if="showHelp" @close="showHelp = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../stores/game'
import { apiService, type Character } from '../services/api' 
import CharacterAutocomplete from './CharacterAutocomplete.vue'
import Album from './Album.vue'
import VictoryModal from './VictoryModal.vue'
import StatsModal from './StatsModal.vue'
import HelpModal from './HelpModal.vue'
import { getCharacterIcon, getCharacterCard } from '../utils/characterImage'

const gameStore = useGameStore()
const showAlbum = ref(false)
const showStats = ref(false)
const showVictoryModal = ref(false) // Remplacement de showVictoryPopup
const showHelp = ref(!localStorage.getItem('disneydle_help_seen'))

// Computed pour savoir si on a au moins un indice disponible (pas forcément révélé)
const hasAnyHint = computed(() => {
  return !!(gameStore.availableHints.blurredImage || gameStore.availableHints.phrase || gameStore.availableHints.quote)
})

// Charger le puzzle du jour + la liste complète des personnages au montage
onMounted(async () => {
  await gameStore.loadDailyPuzzle()
  
  if (gameStore.gameStatus === 'won') {
    setTimeout(() => {
      showVictoryModal.value = true
    }, 3000)
  }
})

async function handleGuess(character: Character) { // Character de l'API {id, name, aliases...}
  try {
    const result = await gameStore.submitGuess(character.name)
    
    // Correction de la comparaison de status et des propriétés de Character
    if (result && result.status === 'win') { 

      setTimeout(() => {
        gameStore.updateStreak() // Met à jour la streak juste avant la modale
        showVictoryModal.value = true 
      }, 3000)
    }
  } catch (error: any) {
    alert(error.message)
  }
}

// Détermine si une ligne doit être animée (seulement la dernière ajoutée)
function shouldAnimate(guessIndex: number): boolean {
  return guessIndex === gameStore.guesses.length - 1
}

// Récupère la classe CSS selon le status (correct/partial/incorrect)
function getResultClass(field: any): string {
  if (typeof field === 'object' && field !== null) {
    return field.status || ''
  }
  return ''
}

// Récupère le texte à afficher depuis l'objet {value, status}
function getResultText(field: any): string {
  if (typeof field === 'object' && field !== null) {
    return field.value || ''
  }
  return String(field || '')
}

// Réinitialise le jeu et efface le localStorage
function resetGame() {
  if (confirm('Voulez-vous vraiment réinitialiser le jeu ? Toutes vos tentatives seront perdues.')) {
    localStorage.clear()
    gameStore.$reset()
    window.location.reload()
  }
}

</script>

<style scoped>
/* Ajout du style pour le bouton Album dans le header */
.header-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.album-btn {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FCD34D;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.album-btn:hover {
  background: rgba(15, 23, 42, 0.9);
  border-color: #FCD34D;
  transform: translateY(-2px);
}

.game-container {
  max-width: 1400px;
  margin: 15px auto;
  padding: 15px 40px 40px 40px;
  position: relative;
  overflow: visible;
}

.game-header {
  display: flex;
  justify-content: space-between; /* Ecarte le titre et les boutons */
  align-items: center;
  margin-bottom: 1rem; /* Réduit pour laisser la place à la marge de la barre de recherche */
  padding: 0 1rem;
}

.disney-logo-wrapper {
  flex-grow: 1;
  text-align: center;
  padding-left: 80px;
}

.disney-logo {
  display: inline-block;
  position: relative;
}

/* Image Peter Pan sous le titre, qui dépasse vers la droite */
.peter-pan-img {
  position: absolute;
  bottom: -50px;
  right: -70px;
  width: 230px;
  height: auto;
  pointer-events: none;
  transform: rotate(-15deg);
  z-index: 21;
  opacity: 0.85;
}

/* Étoiles Disney "Second star to the right" */
.peter-pan-star {
  display: none; /* Ancien élément masqué, remplacé par les SVG */
}

.peter-pan-stars {
  position: absolute;
  top: -40px;
  right: -300px;
  width: 200px;
  height: 150px;
  pointer-events: none;
  z-index: 22;
}

.disney-star {
  position: absolute;
  overflow: visible;
}

.star-big {
  width: 40px;
  height: 40px;
  top: 0;
  right: 20px;
  animation: starTwinkle 4s ease-in-out infinite;
}

.star-small {
  width: 24px;
  height: 24px;
  top: 35px;
  right: 75px;
  animation: starTwinkle 3.5s ease-in-out infinite 1.5s;
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.6;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* Groupe de boutons d'action (Album + Reset + Streak) */
.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Badge Streak */
.streak-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 8px 14px;
  border-radius: 12px;
  cursor: default;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.streak-badge.streak-active {
  background: rgba(251, 191, 36, 0.15);
  border-color: rgba(251, 191, 36, 0.4);
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.15);
}

.streak-flame {
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.streak-badge:not(.streak-active) .streak-flame {
  opacity: 0.3;
  filter: grayscale(1);
}

.streak-count {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  min-width: 14px;
  text-align: center;
}

.streak-badge.streak-active .streak-count {
  color: #fbbf24;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.2), 0 0 10px rgba(255,255,255,0.3);
  border-color: rgba(255,255,255,0.5);
}

.icon-btn:active {
  transform: translateY(1px);
}

/* Tooltip simple au survol (via attribut title natif pour l'instant, ou CSS custom si besoin) */

/* Style du titre */
.disney-title {
  font-size: 4.5rem;
  margin: 0;
  padding: 3px 0 0 0;
  font-family: 'Waltograph', 'Fredoka', 'Comic Sans MS', cursive, sans-serif;
  font-weight: 400;
  display: inline-block; /* Pour que l'image se positionne par rapport au texte */
  background: linear-gradient(180deg, 
    #1b4a84 70%,
    #15355e 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: 
    drop-shadow(-1px -1px 0 #D4B874)
    drop-shadow(2px -2px 0 #D4B874)
    drop-shadow(-1px 1px 0 #D4B874)
    drop-shadow(2px 2px 0 #D4B874)
    drop-shadow(0 0 70px rgba(212, 184, 116, 0.7))
    drop-shadow(0 0 5px rgba(44, 82, 130, 0.5))
    drop-shadow(0 0 1px #fff); 

  letter-spacing: 1px;
  line-height: 1;
  position: relative;
  z-index: 20; /* S'assure que le titre est au-dessus de la lueur de la barre de recherche */
}

.input-section {
  margin-top: 180px; /* Augmenté pour descendre la barre de recherche */
  margin-bottom: 40px;
  text-align: center;
  padding: 0;
  position: relative;
  z-index: 10;
}

/* Quand le panneau d'indices est affiché, on réduit la marge de l'input */
.hints-panel + .input-section {
  margin-top: 0;
}

/* Section Reset (SUPPRIMÉ d'ici pour aller dans le header) */
/* .reset-section {
  text-align: center;
  margin: 20px 0;
  position: relative;
  z-index: 1;
} */

/* Tableau des catégories */
.categories-table {
  margin-top: 40px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.category-header {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 8px; 
  align-items: center;
  background: rgba(15, 23, 42, 0.8); /* Fond sombre transparent */
  backdrop-filter: blur(10px);
  padding: 24px 16px; /* Plus d'espace */
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-bottom: 2px solid rgba(212, 184, 116, 0.3); /* Ligne or plus fine */
}

.category-cell {
  text-align: center;
  color: #FCD34D; /* Brighter Gold */
  font-weight: 800; /* Bolder font */
  font-size: 14px; /* Slightly smaller for fit */
  font-family: 'Fredoka', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 4px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3); /* Text shadow for legibility */
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.category-separator {
    display: none; /* Hide old separator */
}

/* Conteneur de réponse style 'Carte' */
.guess-row-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 8px;
  padding: 12px; /* Un peu plus d'espace vertical */
  border-bottom: 1px solid rgba(255, 255, 255, 0.05); /* Séparateur très subtil */
  transition: all 0.2s ease;
  border-radius: 8px; /* On arrondit chaque ligne */
  margin-bottom: 4px; /* Petit espace entre les lignes */
  perspective: 800px; /* Active le 3D pour les enfants */
}

/* Alternance des couleurs de lignes (Zebra striping) */
.guess-row-grid:nth-child(2n+1) { /* Lignes impaires */
   background-color: rgba(255, 255, 255, 0.03); /* Très léger voile clair */
}

.guess-row-grid:nth-child(2n) { /* Lignes paires */
   background-color: rgba(15, 23, 42, 0.4); /* Fond plus sombre */
}

.guess-row-grid:hover {
    background-color: rgba(255, 255, 255, 0.08) !important; /* Highlight au survol qui passe par dessus l'alternance */
    transform: scale(1.002); 
    box-shadow: 0 4px 12px rgba(0,0,0,0.1); /* Légère élévation au survol */
}

.guess-row-grid:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

/* Style spécifique pour le nom du personnage (Colonne 1) */
.character-name-cell {
  padding: 8px 6px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: 800;
  font-size: 11px;
  text-align: center;
  color: white;
  
  /* Fond très léger pour unifier le cadre, mais laisse passer la couleur de ligne */
  background: rgba(255, 255, 255, 0.05);
  
  /* Bordure plus fine et élégante */
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  
  /* Effet de verre subtil et brillance interne */
  backdrop-filter: blur(4px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.guess-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.guess-name-text {
  line-height: 1.1;
  word-break: break-word;
}

/* Cellules de résultat - Style "Tuiles" */
.result-cell {
  padding: 12px 8px; /* Plus compact */
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px; /* Texte un peu plus petit */
  text-align: center;
  transition: all 0.3s ease;
  color: white; /* Texte blanc par défaut sur fond sombre */
  border-radius: 12px; /* Coins bien arrondis */
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 5px rgba(0,0,0,0.2); /* Effet 3D subtil */
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  background: rgba(30, 41, 59, 0.7); /* Fond par défaut sombre (ardoise) */
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* CORRECT - Vert Émeraude Lumineux */
.result-cell.correct {
  background: linear-gradient(to bottom, #10b981, #059669);
  border: 1px solid #34d399;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.3);
}

/* PARTIEL - Or/Orange Lumineux */
.result-cell.partial {
  background: linear-gradient(to bottom, #f59e0b, #d97706);
  border: 1px solid #fbbf24;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255,255,255,0.3);
}

/* INCORRECT - Gris/Rouge desaturé (Moins agressif) */
.result-cell.incorrect {
  background: rgba(255, 255, 255, 0.05); /* Presque transparent */
  /* background: linear-gradient(to bottom, #64748b, #475569); Optionnel: Gris ardoise si on veut cacher le rouge */
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8; /* Texte gris clair */
  box-shadow: none;
}

/* Animation de révélation avec effet FLIP 3D */
.reveal-animation {
  opacity: 0;
  transform: rotateX(90deg) scale(0.8);
  animation: flipReveal 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

@keyframes flipReveal {
  0% {
    opacity: 0;
    transform: rotateX(90deg) scale(0.8);
  }
  40% {
    opacity: 1;
    transform: rotateX(-10deg) scale(1.05);
  }
  70% {
    transform: rotateX(5deg) scale(1);
  }
  100% {
    opacity: 1;
    transform: rotateX(0deg) scale(1);
  }
}

.character-name-cell.reveal-animation {
  transform-origin: center;
  animation-name: flipRevealName;
}

@keyframes flipRevealName {
  0% {
    opacity: 0;
    transform: translateX(-30px) scale(0.9);
  }
  50% {
    opacity: 1;
    transform: translateX(5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* Légende */
.legend {
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.6); /* Fond sombre */
  backdrop-filter: blur(10px);
  border-radius: 0 0 16px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* Séparateur discret */
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0; /* Texte clair pour la légende */
}

.legend-box {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.legend-box.correct {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.legend-box.partial {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.legend-box.incorrect {
  /* Correspond au style .result-cell.incorrect plus haut */
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 1024px) {
  .game-container {
    padding: 12px;
  }
  
  .disney-title {
    font-size: 42px;
    letter-spacing: 2px;
  }
  
  .peter-pan-img {
    width: 130px;
    right: -25px;
    bottom: -20px;
  }

  .category-cell {
    font-size: 12px;
    padding: 0 4px;
  }
}

/* Popup de victoire */
.victory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.85); /* Fond sombre flouté pour mettre en valeur la carte */
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  perspective: 1000px; /* Pour l'effet 3D */
}

/* Style Carte à Collectionner */
.character-card-container {
  position: relative;
  width: 320px;
  height: 480px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 20px;
  padding: 16px; /* Padding interne comme une bordure de carte */
  box-shadow: 
    0 0 0 8px #D4B874, /* Bordure cadre défaut */
    0 20px 50px rgba(0, 0, 0, 0.5), /* Ombre portée */
    0 0 30px rgba(212, 184, 116, 0.3); /* Glow doré */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-style: preserve-3d;
  animation: cardAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: box-shadow 0.3s ease;
}

/* Styles Dynamiques de Rareté pour la Grande Carte */
.character-card-container.rarity-legendary {
    box-shadow: 0 0 0 8px #FCD34D, 0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(252, 211, 77, 0.4);
}
.character-card-container.rarity-legendary .card-rarity { color: #FCD34D; }
.character-card-container.rarity-legendary .card-image-placeholder { border-color: #FCD34D; }

.character-card-container.rarity-epic {
    box-shadow: 0 0 0 8px #c084fc, 0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(192, 132, 252, 0.4);
}
.character-card-container.rarity-epic .card-rarity { color: #c084fc; }
.character-card-container.rarity-epic .card-image-placeholder { 
    border-color: #c084fc; 
    background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%);
}

.character-card-container.rarity-rare {
    box-shadow: 0 0 0 8px #60a5fa, 0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(96, 165, 250, 0.4);
}
.character-card-container.rarity-rare .card-rarity { color: #60a5fa; }
.character-card-container.rarity-rare .card-image-placeholder { 
    border-color: #60a5fa; 
    background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%);
}

.character-card-container.rarity-common {
    box-shadow: 0 0 0 8px #94a3b8, 0 20px 50px rgba(0,0,0,0.5);
}
.character-card-container.rarity-common .card-rarity { color: #94a3b8; }
.character-card-container.rarity-common .card-image-placeholder { 
    border-color: #94a3b8; 
    background: linear-gradient(135deg, #475569 0%, #0f172a 100%);
}

@keyframes cardAppear {
    0% { opacity: 0; transform: translateY(100px) rotateY(90deg); }
    100% { opacity: 1; transform: translateY(0) rotateY(0deg); }
}

/* Effet brillant qui passe sur la carte */
.card-shimmer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        105deg,
        transparent 20%,
        rgba(255, 255, 255, 0.1) 25%,
        transparent 30%
    );
    z-index: 10;
    pointer-events: none;
    animation: shimmer 3s infinite linear;
    background-size: 200% 100%;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.close-card-btn {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: 3px solid #0f172a;
  cursor: pointer;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}

.close-card-btn:hover {
    transform: scale(1.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-rarity {
    color: #FCD34D;
    font-weight: 800;
}

.card-set {
    color: #94a3b8;
    font-weight: 600;
}

.card-image-placeholder {
    flex: 1;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 12px;
    border: 2px solid #D4B874;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
    position: relative;
    overflow: hidden;
}

/* Motif de fond pour l'image */
.card-image-placeholder::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.5;
}

.card-initial {
    font-family: 'Waltograph', sans-serif;
    font-size: 120px;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 4px 10px rgba(0,0,0,0.4);
    z-index: 1;
}

.card-content {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 12px;
    border: 1px solid rgba(255,255,255,0.1);
}

.card-character-name {
    margin: 0 0 8px 0;
    color: white; /* Or lumineux pour le nom */

}

.card-stats {
    padding-top: 8px;
    border-top: 1px dashed rgba(255,255,255,0.2);
}

.stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.stat-label {
    color: #94a3b8;
    font-size: 12px;
    font-weight: 600;
}

.stat-value {
    color: #FCD34D;
    font-weight: 800;
}

.stat-dots {
    display: flex;
    gap: 4px;
}

.stat-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
}

.stat-dot.filled {
    background: #10b981; /* Vert pour réussite */
    box-shadow: 0 0 5px #10b981;
}

.card-footer {
    padding-top: 12px;
    text-align: center;
}

.victory-message-simple {
    color: #FCD34D;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.view-album-btn-small {
  margin-top: 10px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-album-btn-small:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #FCD34D;
}

/* Album des personnages */
.album-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.album-content {
  background: rgba(15, 23, 42, 0.9);
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
}

.close-album-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: 2px solid #0f172a;
  cursor: pointer;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}

.close-album-btn:hover {
    transform: scale(1.1);
}

.album-title {
  color: #FCD34D;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.album-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.album-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.card-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s;
}

.card-front, .card-back {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  border: 2px solid #D4B874;
  position: relative;
}

.card-image::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
}

.card-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-name {
  color: white;
  font-weight: 700;
  margin: 0;
  font-size: 14px;
}

.card-info {
  color: #94a3b8;
  font-size: 12px;
  display: flex;
  gap: 8px;
}

.card-back {
  background: rgba(15, 23, 42, 0.9);
  border-radius: 12px;
  padding: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.card-back-content {
  text-align: center;
}

.card-status {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 4px;
}

.ripple-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 12px;
  pointer-events: none;
  animation: rippleEffect 0.6s ease-out;
}

@keyframes rippleEffect {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

/* Nettoyage des anciennes classes non utilisées */
/* .victory-popup ... supprimé */
/* .close-btn ... supprimé */
/* .victory-title ... supprimé */
/* .victory-character ... supprimé */

/* ==============================
   Panneau d'indices — Cartes Mystère
   ============================== */
.hints-panel {
  margin: 180px auto 20px;
  max-width: 560px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.65), rgba(15, 23, 42, 0.8));
  border: 1px solid rgba(251, 191, 36, 0.15);
  border-radius: 18px;
  padding: 18px 24px 22px;
  backdrop-filter: blur(12px);
  animation: hintSlideIn 0.5s ease-out;
  position: relative;
  z-index: 10;
}

/* Quand le panneau d'indices est affiché, on réduit la marge de l'input */
.hints-panel + .input-section {
  margin-top: 0;
}

@keyframes hintSlideIn {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}

.hints-header {
  text-align: center;
  margin-bottom: 16px;
}

.hints-label {
  font-family: 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #FCD34D;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.hints-subtitle {
  display: block;
  font-family: 'Fredoka', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.5px;
  margin-top: 2px;
}

/* Grille de cartes */
.hints-cards {
  display: flex;
  justify-content: center;
  gap: 14px;
}

/* ---- Carte individuelle ---- */
.hint-card {
  width: 130px;
  height: 145px;
  cursor: pointer;
  perspective: 800px;
  animation: cardPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

.hint-card:nth-child(1) { animation-delay: 0.05s; }
.hint-card:nth-child(2) { animation-delay: 0.15s; }
.hint-card:nth-child(3) { animation-delay: 0.25s; }

@keyframes cardPopIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.hint-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform-style: preserve-3d;
}

.hint-card--revealed .hint-card-inner {
  transform: rotateY(180deg);
}

.hint-card-front,
.hint-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
}

/* Face avant — carte mystère */
.hint-card-front {
  background: linear-gradient(150deg, #1e293b 0%, #0f172a 100%);
  border: 1.5px solid rgba(251, 191, 36, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.hint-card:not(.hint-card--revealed):hover .hint-card-front {
  border-color: rgba(251, 191, 36, 0.6);
  box-shadow: 0 0 18px rgba(251, 191, 36, 0.15), 0 6px 20px rgba(0, 0, 0, 0.25);
  transform: translateY(-3px);
}

.hint-card:not(.hint-card--revealed):active .hint-card-front {
  transform: translateY(0);
}

.hint-card-tier {
  font-family: 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: #FCD34D;
  line-height: 1;
  text-shadow: 0 2px 10px rgba(251, 191, 36, 0.25);
}

.hint-card-icon {
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 0.45);
  transition: color 0.3s ease;
}

.hint-card:not(.hint-card--revealed):hover .hint-card-icon {
  color: rgba(251, 191, 36, 0.7);
}

.hint-card-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Face arrière — contenu révélé */
.hint-card-back {
  transform: rotateY(180deg);
  background: linear-gradient(150deg, #1a2744 0%, #0d1a30 100%);
  border: 1.5px solid rgba(251, 191, 36, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

/* Image floutée */
.hint-blurred-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
}

.hint-blurred-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(14px) saturate(0.5);
  transform: scale(1.25);
}

/* Texte révélé */
.hint-card-back-text {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.hint-card-back-quote {
  border-left: 2px solid rgba(251, 191, 36, 0.35);
  padding-left: 10px;
  margin-left: 2px;
}

.hint-revealed-text {
  font-family: 'Fredoka', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.45;
  margin: 0;
  font-style: italic;
  text-align: center;
  overflow-y: auto;
  max-height: 100%;
}

.hint-revealed-quote {
  color: #FCD34D;
}

/* Responsive hints */
@media (max-width: 600px) {
  .hints-panel {
    margin: 120px 8px 16px;
    padding: 14px 12px 16px;
  }
  .hints-cards {
    gap: 8px;
  }
  .hint-card {
    width: 100px;
    height: 120px;
  }
  .hint-card-tier {
    font-size: 24px;
  }
  .hint-card-icon {
    width: 22px;
    height: 22px;
  }
  .hint-revealed-text {
    font-size: 10px;
  }
}
</style>

<template>
  <div class="album-container">
    <div class="album-header">
      <h2 class="album-title">Mon Album Disney</h2>
      
      <div class="album-controls">
        <select v-model="sortBy" class="album-sort-select">
            <option value="name">Nom</option>
            <option value="id">Numéro</option>
            <option value="movie">Film/Saga</option>
            <option value="unlocked">Débloqués</option>
        </select>
        <button @click="$emit('close')" class="close-album-btn">✕</button>
      </div>
    </div>

    <!-- État Chargement (si la liste des persos n'est pas encore chargée) -->
    <div v-if="gameStore.allCharactersList.length === 0" class="empty-album">
      <div class="empty-icon">⏳</div>
      <p>Chargement du catalogue...</p>
    </div>

    <!-- Grille des cartes (Pokedex Mode) -->
    <div v-else class="cards-grid">
      <!-- On itère maintenant sur sortedCharacters -->
      <div v-for="character in sortedCharacters" :key="character.id" class="album-card-wrapper">
        
        <!-- Cas 1: Carte DÉBLOQUÉE -->
        <template v-if="gameStore.getCollectedCard(character.name)">
          <div class="character-card-mini" :class="gameStore.getRarity(gameStore.getCollectedCard(character.name)!.attempts).class">
             <div class="card-shimmer-mini"></div>
             <div class="card-mini-header">
               <span class="card-mini-id">#{{ character.id }}</span>
               <span class="card-mini-rarity">{{ gameStore.getRarity(gameStore.getCollectedCard(character.name)!.attempts).label }}</span>
             </div>
             
             <div class="card-mini-image">
               <img 
                 :src="getCharacterCard(character.name)" 
                 :alt="character.name"
                 class="card-mini-img"
                 @error="($event.target as HTMLImageElement).style.display='none'; ($event.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')"
               />
               <span class="card-mini-initial hidden">{{ character.name.charAt(0).toUpperCase() }}</span>
             </div>
             
             <div class="card-mini-body">
               <div class="card-mini-name">{{ character.name }}</div>
               <!--<div class="card-mini-date">{{ gameStore.getCollectedCard(character.name)!.attempts }} essais</div>-->
               <div class="card-mini-date unknown-movie">{{ character.movie_title || '???' }}</div>

             </div>
          </div>
        </template>

        <!-- Cas 2: Carte MYSTÈRE (Non débloquée) -->
        <template v-else>
          <div class="character-card-mini locked-card">
             <div class="card-mini-header">
               <span class="card-mini-id">#{{ character.id }}</span>
             </div>
             
             <div class="card-mini-image locked-image">
               <!-- Remplacement du "?" par une icône SVG de cadenas -->
               <svg xmlns="http://www.w3.org/2000/svg" class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                 <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
               </svg>
             </div>
             
             <div class="card-mini-body">
                <!-- IMPORTANT: On n'affiche PAS le nom, mais on affiche maintenant le FILM! -->
                <div class="card-mini-name locked-name">Inconnu</div>
                
                <!-- Nouvelle info: Le film est affiché même si verrouillé (ou on peut le masquer si on veut full spoiler free) -->
                <!-- Pour l'instant on l'affiche pour faciliter le repérage comme demandé "classer par saga" -->
               <div class="card-mini-date unknown-movie">{{ character.movie_title || '???' }}</div>
             </div>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/game'
import { getCharacterCard } from '../utils/characterImage'

const gameStore = useGameStore()
defineEmits(['close'])

const sortBy = ref<'name' | 'id' | 'unlocked' | 'movie'>('movie') // Par défaut: Film

const sortedCharacters = computed(() => {
  const chars = [...gameStore.allCharactersList]
  
  if (sortBy.value === 'id') {
    return chars.sort((a, b) => a.id - b.id)
  }
  
  if (sortBy.value === 'name') {
      return chars.sort((a, b) => a.name.localeCompare(b.name))
  }

  if (sortBy.value === 'movie') {
      return chars.sort((a, b) => {
          // Tri par nom de film d'abord
          const movieA = a.movie_title || "Inconnu"
          const movieB = b.movie_title || "Inconnu"
          const movieCompare = movieA.localeCompare(movieB)
          
          if (movieCompare !== 0) return movieCompare
          
          // Si même film, trier par nom de perso
          return a.name.localeCompare(b.name)
      })
  }
  
  if (sortBy.value === 'unlocked') {
      return chars.sort((a, b) => {
          const cardA = gameStore.getCollectedCard(a.name)
          const cardB = gameStore.getCollectedCard(b.name)
          
          if (cardA && !cardB) return -1 // A en premier
          if (!cardA && cardB) return 1 // B en premier
          if (cardA && cardB) {
              // Si les deux sont débloqués, trier par tentative (ou date si dispo)
              // Ici on utilise le nombre d'essais (moins d'essais = meilleur joueur = en premier ?)
              // Ou ordre alphabétique secondaire
              return a.name.localeCompare(b.name)
          }
          // Si les deux sont verrouillés, trier par ID
          return a.id - b.id
      })
  }
  
  return chars
})
</script>

<style scoped>
.album-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(15px);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  padding: 40px;
  overflow-y: auto;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.album-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  max-width: 1200px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.album-title {
  font-family: 'Waltograph', sans-serif;
  font-size: 60px;
  color: #FCD34D;
  text-shadow: 0 0 20px rgba(252, 211, 77, 0.4);
  margin: 0;
}

.close-album-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-album-btn:hover {
  background: rgba(239, 68, 68, 0.8);
  transform: rotate(90deg);
}

.empty-album {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-family: 'Fredoka', sans-serif;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-subtitle {
  font-size: 14px;
  margin-top: 10px;
  opacity: 0.7;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 40px;
}

/* Slot vide */
.empty-slot {
  aspect-ratio: 2/3;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Waltograph', sans-serif;
  font-size: 40px;
  color: rgba(255, 255, 255, 0.1);
}

/* Style Carte Mini (dérivé de GameBoard) */
.album-card-wrapper {
  perspective: 1000px;
}

.character-card-mini {
  aspect-ratio: 2/3;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 16px;
  padding: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

/* Styles de Rareté pour les Mini Cartes */
.character-card-mini.rarity-legendary {
    border-color: #FCD34D; /* Or */
    box-shadow: 0 10px 20px rgba(0,0,0,0.3), 0 0 15px rgba(252, 211, 77, 0.1);
}
.character-card-mini.rarity-legendary .card-mini-rarity { color: #FCD34D; }
.character-card-mini.rarity-legendary .card-mini-image { border-color: #FCD34D; }

.character-card-mini.rarity-epic {
    border-color: #c084fc; /* Violet */
    box-shadow: 0 10px 20px rgba(0,0,0,0.3), 0 0 15px rgba(192, 132, 252, 0.1);
}
.character-card-mini.rarity-epic .card-mini-rarity { color: #c084fc; }
.character-card-mini.rarity-epic .card-mini-image { border-color: #c084fc; background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%); }

.character-card-mini.rarity-rare {
    border-color: #60a5fa; /* Bleu Ciel */
    box-shadow: 0 10px 20px rgba(0,0,0,0.3), 0 0 15px rgba(96, 165, 250, 0.1);
}
.character-card-mini.rarity-rare .card-mini-rarity { color: #60a5fa; }
.character-card-mini.rarity-rare .card-mini-image { border-color: #60a5fa; background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%); }

.character-card-mini.rarity-common {
    border-color: #94a3b8; /* Gris */
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
}
.character-card-mini.rarity-common .card-mini-rarity { color: #94a3b8; }
.character-card-mini.rarity-common .card-mini-image { border-color: #94a3b8; background: linear-gradient(135deg, #475569 0%, #0f172a 100%); }

/* Style Locked/Mystère */
.character-card-mini.locked-card {
  border-color: #334155;
  background: #0f172a; /* Très sombre */
  box-shadow: none;
  opacity: 0.7;
}
.character-card-mini.locked-card .card-mini-image {
  background: #1e293b;
  border-color: #334155;
  color: #475569;
}

.lock-icon {
  width: 40px;
  height: 40px;
  opacity: 0.5;
}

.character-card-mini.locked-card .locked-name {
  color: #334155;
  background-color: #334155;
  border-radius: 4px;
}

.character-card-mini:hover {
  transform: translateY(-10px) rotateY(5deg);
  box-shadow: 0 20px 30px rgba(0,0,0,0.5), 0 0 15px rgba(252, 211, 77, 0.2);
  border-color: #FCD34D;
}

.card-shimmer-mini {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%);
  background-size: 200% 100%;
  animation: miniShimmer 4s infinite linear;
  pointer-events: none;
}

@keyframes miniShimmer {
  0% { background-position: 150% 0; }
  100% { background-position: -150% 0; }
}

.card-mini-header {
  display: flex;
  justify-content: space-between; /* Changé pour accommoder ID + Rareté */
  align-items: center;  /* Alignement vertical */
  margin-bottom: 8px;
  width: 100%; /* S'assurer de prendre toute la largeur */
}

.card-mini-id {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.3);
    font-family: monospace;
}

.card-mini-rarity {
  font-size: 10px;
  color: #FCD34D;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 1px;
}

.card-mini-image {
  flex: 1;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 8px;
  border: 1px solid #D4B874;
  margin-bottom: 10px;
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
  font-size: 60px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.card-mini-initial.hidden {
  display: none;
}

.card-mini-body {
  text-align: center;
}

.card-mini-name {
  color: white;
  font-family: 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

.card-mini-date {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.album-controls {
    display: flex;
    align-items: center;
    gap: 15px;
}

.album-sort-select {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #e2e8f0;
    padding: 8px 12px;
    border-radius: 8px;
    font-family: 'Fredoka', sans-serif;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;
    appearance: none; /* Supprime le style par défaut du système */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
    padding-right: 32px;
}

.album-sort-select:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background-color: rgba(30, 41, 59, 0.8);
}

.album-sort-select:focus {
    border-color: #FCD34D;
    box-shadow: 0 0 0 2px rgba(252, 211, 77, 0.2);
}

.album-sort-select option {
    background: #0f172a;
    color: white;
    padding: 10px;
}
</style>

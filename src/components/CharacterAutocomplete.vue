<template>
  <div class="search-wrapper">
    <!-- Barre de recherche stylée "Disney Magic" -->
    <div class="input-container" :class="{ 'is-focused': isFocused, 'has-content': searchQuery }">
       <span class="search-icon">
         <!-- Icône SVG Loupe (plus l'emoji 🔍) -->
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
       </span>
      <input
        v-model="searchQuery"
        @focus="isFocused = true"
        @blur="handleBlur"
        @keydown.enter="enterPressed"
        @keydown.down.prevent="navigateDown"
        @keydown.up.prevent="navigateUp"
        @keydown.esc="clearSearch"
        type="text"
        :placeholder="t('search.placeholder')"
        :disabled="props.disabled"
        ref="searchInput"
        class="magic-input"
        autocomplete="off"
      />
      <button 
        v-if="searchQuery" 
        @click="clearSearch" 
        class="clear-btn" 
        aria-label="Effacer">
        ✕
      </button>
      <div class="glow-effect"></div>
    </div>
    
    <!-- Liste des suggestions -->
    <transition name="fade-slide">
      <ul v-if="isOpen && filteredList.length > 0" class="suggestions-list">
        <li
          v-for="(character, index) in filteredList"
          :key="character.id"
          class="suggestion-item"
          :class="{ 'is-active': index === selectedIndex }"
          @click="selectSuggestion(character)"
          @mouseenter="selectedIndex = index"
        >
          <div class="suggestion-content">
             <div class="char-icon-img">
               <img 
                 :src="getCharacterIcon(character.name)" 
                 :alt="character.name"
                 class="suggestion-avatar"
                 @error="($event.target as HTMLImageElement).style.display='none'; ($event.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')"
               />
               <span class="char-icon-fallback hidden">✨</span>
             </div>
             <div class="char-info">
                <span class="char-name">{{ character.name }}</span>
             </div>
          </div>
        </li>
      </ul>
       <!-- Message "Aucun résultat" -->
       <div v-else-if="isOpen && searchQuery.length >= 2 && filteredList.length === 0" class="no-results">
          <span class="sad-mickey">✨</span> {{ t('search.noResult') }}
       </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameStore } from '../stores/game'
import { apiService, type Character } from '../services/api' 
import { getCharacterIcon } from '../utils/characterImage'

const { t } = useI18n()

// Props et Emits
const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ (e: 'select', character: Character): void }>()

const gameStore = useGameStore()
const searchQuery = ref('')
const isFocused = ref(false)
const selectedIndex = ref(0)
const searchInput = ref<HTMLInputElement | null>(null)
const allCharacters = ref<Character[]>([])

// Charger les personnages
loadCharacters()

async function loadCharacters() {
    try {
        allCharacters.value = await apiService.getAllCharacters()
    } catch (e) {
        console.error("Erreur chargement personnages", e)
    }
}

// Filtrage intelligent
const filteredList = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []
  
  const query = searchQuery.value.toLowerCase().trim()
  const alreadyGuessed = new Set(gameStore.guesses.map(g => g.characterName.toLowerCase()))

  return allCharacters.value
    .filter((char: Character) => {
      const name = char.name.toLowerCase()
      // Exclure déjà devinés
      if (alreadyGuessed.has(name)) return false
      
      // Match nom ou alias
      const matchName = name.includes(query)
      const matchAlias = char.aliases?.some(alias => alias.toLowerCase().includes(query))
      
      return matchName || matchAlias
    })
    .slice(0, 8) // Limiter à 8 résultats pour ne pas surcharger
})

const isOpen = computed(() => isFocused.value && searchQuery.value.length >= 2)

// Navigation Clavier
const navigateDown = () => {
  if (!isOpen.value) return
  selectedIndex.value = (selectedIndex.value + 1) % filteredList.value.length
}

const navigateUp = () => {
    if (!isOpen.value) return
    selectedIndex.value = (selectedIndex.value - 1 + filteredList.value.length) % filteredList.value.length
}

const enterPressed = () => {
    if (isOpen.value && filteredList.value.length > 0) {
        selectSuggestion(filteredList.value[selectedIndex.value])
    }
}

const selectSuggestion = (character: any) => {
    emit('select', character)
    searchQuery.value = ''
    isFocused.value = false // Fermer après sélection
    selectedIndex.value = 0
}

const clearSearch = () => {
    searchQuery.value = ''
    searchInput.value?.focus()
}

// Retarder la fermeture pour permettre le clic
const handleBlur = () => {
    // Petit délai pour laisser le temps au clic de se faire
    setTimeout(() => {
        isFocused.value = false
    }, 200)
}

// Reset index quand la liste change
watch(filteredList, () => {
    selectedIndex.value = 0
})

</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px; /* Largeur confortable */
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
}

/* --- Container Input --- */
.input-container {
  display: flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.7); /* Fond plus sombre et magique */
  backdrop-filter: blur(16px);
  border: 2px solid rgba(212, 184, 116, 0.4); /* Bordure dorée subtile */
  border-radius: 50px; /* Forme pillule complète */
  padding: 12px 24px; /* Plus grand et aéré */
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(212, 184, 116, 0.05); /* Ombre profonde et lueur interne */
  position: relative;
  overflow: hidden;
}

/* Effet Focus */
.input-container.is-focused {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(212, 184, 116, 0.8); /* Bordure dorée brillante */
  box-shadow: 0 0 15px rgba(212, 184, 116, 0.4), 0 8px 32px rgba(0,0,0,0.4); /* Halo doré */
}

.search-icon {
  font-size: 1.4rem; /* Icône légèrement plus grande */
  margin-right: 16px;
  opacity: 0.7;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); /* Ombre sur l'icône */
  transition: 0.3s;
}

.input-container.is-focused .search-icon {
  opacity: 1;
  filter: drop-shadow(0 0 8px rgba(212, 184, 116, 0.6)); /* Lueur dorée sur l'icône */
  transform: scale(1.1); /* Retrait de la rotation */
}

.magic-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #F8FAFC; /* Blanc cassé très clair */
  font-size: 1.2rem; /* Texte plus grand */
  font-weight: 500;
  font-family: 'Fredoka', sans-serif; /* Police plus ronde/Disney */
  letter-spacing: 0.5px;
  outline: none;
  width: 100%;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.magic-input::placeholder {
  color: rgba(212, 184, 116, 0.6); /* Placeholder doré transparent */
  font-style: italic;
  font-weight: 400;
}

.clear-btn {
  background: rgba(212, 184, 116, 0.15); /* Fond doré transparent */
  border: 1px solid rgba(212, 184, 116, 0.3);
  color: rgba(212, 184, 116, 0.8);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(212, 184, 116, 0.4);
  color: #fff;
  border-color: rgba(212, 184, 116, 0.8);
  transform: scale(1.1); /* Retrait de la rotation */
  box-shadow: 0 0 10px rgba(212, 184, 116, 0.4);
}

/* --- Liste Suggestions --- */
.suggestions-list {
  position: absolute;
  top: 120%; /* Juste en dessous avec un petit gap */
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid rgba(212, 184, 116, 0.3); /* Bordure dorée */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 184, 116, 0.1); /* Ombre magique */
  list-style: none;
  padding: 8px;
  margin: 0;
  max-height: 350px;
  overflow-y: auto;
  z-index: 100;
}

/* Scrollbar fine */
.suggestions-list::-webkit-scrollbar {
  width: 6px;
}
.suggestions-list::-webkit-scrollbar-track {
  background: rgba(212, 184, 116, 0.05);
  border-radius: 10px;
}
.suggestions-list::-webkit-scrollbar-thumb {
  background: rgba(212, 184, 116, 0.3);
  border-radius: 10px;
}

.suggestion-item {
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #F8FAFC;
  font-family: 'Fredoka', sans-serif; /* Police Disney */
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(212, 184, 116, 0.1); /* Séparateur doré */
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.is-active {
  background: rgba(212, 184, 116, 0.15); /* Hover doré */
  color: #FCD34D; /* Texte doré au survol */
}

.suggestion-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.char-icon-img {
  width: 40px; /* Légèrement plus grand */
  height: 40px;
  min-width: 40px;
  margin-right: 16px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(212, 184, 116, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(212, 184, 116, 0.3); /* Bordure dorée */
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.suggestion-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.char-icon-fallback {
  font-size: 1.2rem;
}

.char-icon-fallback.hidden {
  display: none;
}

.suggestion-item:hover .char-icon-img,
.suggestion-item.is-active .char-icon-img {
  border-color: #FCD34D; /* Bordure dorée brillante au survol */
  box-shadow: 0 0 12px rgba(252, 211, 77, 0.5); /* Halo doré */
}

.char-icon {
  margin-right: 12px;
  font-size: 1.2rem;
  opacity: 0.7;
}

.suggestion-item:hover .char-icon {
  opacity: 1;
  /* Retrait du scale */
}

.char-name {
  font-weight: 500;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.no-results {
  position: absolute;
  top: 120%;
  left: 0;
  right: 0;
  padding: 20px;
  text-align: center;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  color: rgba(212, 184, 116, 0.8); /* Texte doré */
  font-style: italic;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  border: 1px solid rgba(212, 184, 116, 0.3); /* Bordure dorée */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
}

/* --- Transitions --- */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* --- Effet de lueur (Glow) --- */
.glow-effect {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(212, 184, 116, 0.1) 0%, transparent 70%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
  z-index: -1;
}

.input-container.is-focused .glow-effect {
  opacity: 1;
}
</style>


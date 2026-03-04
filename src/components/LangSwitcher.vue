<template>
  <div class="lang-switcher" ref="switcherRef">
    <button class="lang-toggle" @click="open = !open" :title="currentLang.label">
      <span class="lang-flag">{{ currentLang.flag }}</span>
      <svg class="lang-chevron" :class="{ 'chevron-open': open }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <Transition name="dropdown">
      <div v-if="open" class="lang-dropdown">
        <button
          v-for="lang in languages"
          :key="lang.code"
          class="lang-option"
          :class="{ active: currentLocale === lang.code }"
          @click="selectLang(lang.code)"
        >
          <span class="lang-option-flag">{{ lang.flag }}</span>
          <span class="lang-option-label">{{ lang.label }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../i18n'

const { locale } = useI18n()

const open = ref(false)
const switcherRef = ref<HTMLElement | null>(null)

const languages = [
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
]

const currentLocale = computed(() => locale.value)
const currentLang = computed(() => {
  const found = languages.find(l => l.code === currentLocale.value)
  return found !== undefined ? found : languages[0]
})

function selectLang(code: string) {
  setLocale(code)
  open.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (switcherRef.value && !switcherRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.lang-switcher {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1000;
}

.lang-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 6px 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-toggle:hover {
  border-color: rgba(251, 191, 36, 0.4);
  background: rgba(30, 41, 59, 0.95);
}

.lang-flag {
  font-size: 18px;
  line-height: 1;
}

.lang-chevron {
  color: #94a3b8;
  transition: transform 0.2s ease;
}

.chevron-open {
  transform: rotate(180deg);
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  overflow: hidden;
  min-width: 140px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: transparent;
  color: #cbd5e1;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.lang-option:hover {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
}

.lang-option.active {
  color: #fbbf24;
  font-weight: 600;
}

.lang-option-flag {
  font-size: 18px;
  line-height: 1;
}

.lang-option-label {
  white-space: nowrap;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

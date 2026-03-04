import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import en from './locales/en.json'

const STORAGE_KEY = 'disneydle_lang'

function getDefaultLocale(): string {
  // 1. Préférence sauvegardée
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && ['fr', 'en'].includes(saved)) return saved

  // 2. Langue du navigateur
  const browserLang = navigator.language.slice(0, 2)
  if (['fr', 'en'].includes(browserLang)) return browserLang

  // 3. Anglais par défaut
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: { fr, en },
})

export function setLocale(locale: string) {
  ;(i18n.global.locale as any).value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.setAttribute('lang', locale)
}

export function getLocale(): string {
  return (i18n.global.locale as any).value
}

export default i18n

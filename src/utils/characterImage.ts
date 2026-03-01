/**
 * Génère un slug à partir du nom d'un personnage.
 * Convention : "Pacha" → "pacha", "Buzz l'Éclair" → "buzz-l-eclair"
 */
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')                     // Décompose les accents (é → e + ́)
    .replace(/[\u0300-\u036f]/g, '')       // Supprime les diacritiques
    .replace(/['']/g, '-')                 // Apostrophes → tirets
    .replace(/[^a-z0-9]+/g, '-')           // Tout le reste → tirets
    .replace(/^-+|-+$/g, '')               // Supprime tirets en début/fin
}

/**
 * URL de l'icône du personnage (petite, pour recherche/grille).
 * Convention : /images/characters/icons/pacha_icon.webp
 */
export function getCharacterIcon(name: string): string {
  return `/images/characters/icons/${nameToSlug(name)}_icon.webp`
}

/**
 * URL de la carte du personnage (grande, pour album/victoire).
 * Convention : /images/characters/cards/pacha_card.webp
 */
export function getCharacterCard(name: string): string {
  return `/images/characters/cards/${nameToSlug(name)}_card.webp`
}

/**
 * @deprecated Utiliser getCharacterIcon() ou getCharacterCard() à la place.
 */
export function getCharacterImageUrl(name: string): string {
  return getCharacterCard(name)
}

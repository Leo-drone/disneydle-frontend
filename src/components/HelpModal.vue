<template>
  <Teleport to="body">
    <div class="help-overlay" @click.self="handleClose">
      <div class="help-modal">
        <!-- Header -->
        <div class="help-header">
          <h2 class="help-title">Comment jouer</h2>
          <button class="help-close-btn" @click="handleClose">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Contenu -->
        <div class="help-content">
          <!-- Objectif -->
          <section class="help-section">
            <h3 class="help-section-title">Objectif</h3>
            <p class="help-text">
              Devinez le <strong>personnage Disney ou Pixar</strong> du jour.
              Tapez un nom dans la barre de recherche et validez pour soumettre votre proposition.
            </p>
          </section>

          <!-- Colonnes -->
          <section class="help-section">
            <h3 class="help-section-title">Les categories</h3>
            <p class="help-text">
              Chaque proposition affiche une ligne de 9 colonnes.
              Chaque colonne compare votre personnage avec la solution :
            </p>
            <div class="help-categories">
              <div class="help-category-item" v-for="col in columns" :key="col.name">
                <div class="help-category-header">
                  <span class="help-column-icon" v-html="col.icon"></span>
                  <span class="help-column-name">{{ col.name }}</span>
                </div>
                <p class="help-category-desc">{{ col.desc }}</p>
              </div>
            </div>
          </section>

          <!-- Code couleur -->
          <section class="help-section">
            <h3 class="help-section-title">Code couleur</h3>
            <div class="help-colors">
              <div class="help-color-row">
                <div class="help-color-box correct"></div>
                <div class="help-color-desc">
                  <strong>Vert</strong> &mdash; La valeur est identique au personnage mystere.
                </div>
              </div>
              <div class="help-color-row">
                <div class="help-color-box partial"></div>
                <div class="help-color-desc">
                  <strong>Orange</strong> &mdash; Partiellement correct (ex : meme film mais pas le bon personnage, ou valeur proche pour l'annee).
                </div>
              </div>
              <div class="help-color-row">
                <div class="help-color-box incorrect"></div>
                <div class="help-color-desc">
                  <strong>Rouge</strong> &mdash; Aucun rapport avec la reponse.
                </div>
              </div>
            </div>
          </section>

          <!-- Indices bonus -->
          <section class="help-section">
            <h3 class="help-section-title">Indices bonus</h3>
            <p class="help-text">
              Apres plusieurs tentatives, des <strong>indices supplementaires</strong> se debloquent automatiquement :
            </p>
            <ul class="help-list">
              <li><strong>Image floue</strong> &mdash; une silhouette du personnage (apres 3 essais)</li>
              <li><strong>Phrase</strong> &mdash; une description de son role (apres 5 essais)</li>
              <li><strong>Citation</strong> &mdash; une replique celebre (apres 7 essais)</li>
            </ul>
            <p class="help-text help-text-small">
              Cliquez sur la carte correspondante pour reveler l'indice.
            </p>
          </section>

          <!-- Streak & Album -->
          <section class="help-section">
            <h3 class="help-section-title">Streak et Collection</h3>
            <div class="help-features">
              <div class="help-feature">
                <img src="/streak-flame.svg" alt="" width="20" height="20" class="help-feature-icon" />
                <p class="help-text">
                  Gagnez chaque jour pour maintenir votre <strong>streak</strong> (serie de victoires consecutives).
                </p>
              </div>
              <div class="help-feature">
                <span class="help-feature-emoji">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </span>
                <p class="help-text">
                  Chaque personnage trouve est ajoute a votre <strong>album</strong> de collection.
                </p>
              </div>
            </div>
          </section>
        </div>

        <!-- Footer -->
        <div class="help-footer">
          <button class="help-play-btn" @click="handleClose">C'est parti !</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

const columns = [
  {
    name: 'Personnage',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
    desc: 'Le nom du personnage proposé (ex : Elsa, Woody, ...)',
  },
  {
    name: 'Film',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20"/><path d="M17 2v20"/><path d="M2 12h20"/><path d="M2 7h5"/><path d="M2 17h5"/><path d="M17 7h5"/><path d="M17 17h5"/></svg>',
    desc: 'Le film dans lequel le personnage apparaît pour la première fois (ex : Le Roi Lion, Ratatouille, ...)',
  },
  {
    name: 'Studio',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    desc: 'Le studio qui a réalisé le film (ex : Disney ou Pixar)',
  },
  {
    name: 'Espèce',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10c-2 0-3-1-3-3 0-1.7 1.3-3 3-3s3 1.3 3 3c0 2-1 3-3 3z"/><path d="M6.5 7C5.1 7 4 5.9 4 4.5S5.1 2 6.5 2 9 3.1 9 4.5"/><path d="M17.5 7c1.4 0 2.5-1.1 2.5-2.5S18.9 2 17.5 2 15 3.1 15 4.5"/><path d="M12 10c4 0 7 2.7 7 6v2H5v-2c0-3.3 3-6 7-6z"/></svg>',
    desc: "L'espèce du personnage (ex : Humain, Animal, Créature magique, Objet/Robot, Monstre/Alien)",
  },
  {
    name: 'Rôle',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    desc: 'Le rôle du personnage (ex : Héros, Méchant, Acolyte)',
  },
  {
    name: 'Genre',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',
    desc: 'Le genre du personnage (ex : Masculin, Féminin, Neutre)',
  },
  {
    name: 'Année de sortie',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>',
    desc: "L'année de sortie du film au US. Une flèche indique plus ancien ou plus récent. (ex: 2016, 1999, ...)",
  },
  {
    name: 'Trait de Personnalité',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    desc: 'La personnalité du personnage le décrivant le mieux (ex : Courageux, Malicieux, Loyal)',
  },
  {
    name: 'Couleur Caractéristique',
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12c0 2 1 3.5 3 3.5h1.5c1.1 0 2 .9 2 2 0 .6-.2 1-.5 1.4-.5.5-.5 1.2-.5 1.6 0 .8.7 1.5 1.5 1.5z"/></svg>',
    desc: 'La ou les couleurs principales définissant le personnage (ex : Bleu, Rouge, Jaune)',
  },
]

function handleClose() {
  localStorage.setItem('disneydle_help_seen', 'true')
  emit('close')
}
</script>

<style scoped>
.help-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4000;
  animation: helpFadeIn 0.25s ease-out;
  padding: 20px;
}

.help-modal {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 2px solid rgba(251, 191, 36, 0.4);
  border-radius: 20px;
  padding: 0;
  max-width: 480px;
  width: 100%;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  animation: helpScaleUp 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 0 40px rgba(251, 191, 36, 0.15);
}

/* Header */
.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px 0;
}

.help-title {
  color: #fbbf24;
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0;
}

.help-close-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #94a3b8;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.help-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.4);
}

/* Content */
.help-content {
  padding: 20px 28px;
}

.help-section {
  margin-bottom: 22px;
}

.help-section:last-child {
  margin-bottom: 0;
}

.help-section-title {
  color: #fbbf24;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 10px 0;
}

.help-text {
  color: #cbd5e1;
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0;
}

.help-text strong {
  color: #f1f5f9;
}

.help-text-small {
  margin-top: 8px;
  font-size: 0.75rem;
  color: #94a3b8;
  font-style: italic;
}

/* Categories list */
.help-categories {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.help-category-item {
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
}

.help-category-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.help-column-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

.help-column-name {
  font-weight: 700;
  font-size: 0.78rem;
  color: #f1f5f9;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.help-category-desc {
  color: #94a3b8;
  font-size: 0.73rem;
  line-height: 1.5;
  margin: 0;
}

/* Color legend */
.help-colors {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.help-color-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.help-color-box {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
}

.help-color-box.correct {
  background: linear-gradient(135deg, #059669, #10b981);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}

.help-color-box.partial {
  background: linear-gradient(135deg, #d97706, #f59e0b);
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.3);
}

.help-color-box.incorrect {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
}

.help-color-desc {
  color: #cbd5e1;
  font-size: 0.8rem;
  line-height: 1.5;
}

.help-color-desc strong {
  color: #f1f5f9;
}

/* Hints list */
.help-list {
  margin: 8px 0 0 0;
  padding-left: 18px;
  color: #cbd5e1;
  font-size: 0.82rem;
  line-height: 1.8;
}

.help-list li {
  padding-left: 4px;
}

.help-list strong {
  color: #f1f5f9;
}

/* Features */
.help-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.help-feature {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.help-feature-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.help-feature-emoji {
  flex-shrink: 0;
  color: #94a3b8;
  margin-top: 2px;
}

/* Footer */
.help-footer {
  padding: 16px 28px 24px;
  display: flex;
  justify-content: center;
}

.help-play-btn {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #0f172a;
  border: none;
  padding: 12px 40px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.help-play-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
}

.help-play-btn:active {
  transform: translateY(0);
}

/* Animations */
@keyframes helpFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes helpScaleUp {
  from { transform: scale(0.85); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Responsive */
@media (max-width: 480px) {
  .help-modal {
    max-width: 100%;
    border-radius: 16px;
  }

  .help-content {
    padding: 16px 20px;
  }

  .help-header {
    padding: 20px 20px 0;
  }

  .help-footer {
    padding: 12px 20px 20px;
  }
}
</style>

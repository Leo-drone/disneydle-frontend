<template>
  <Teleport to="body">
    <div class="stats-overlay" @click.self="$emit('close')">
      <div class="stats-modal">
        <!-- Header -->
        <div class="stats-header">
          <h2 class="stats-title">{{ t('stats.title') }}</h2>
          <button class="stats-close-btn" @click="$emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- KPIs -->
        <div class="stats-kpis">
          <div class="kpi">
            <span class="kpi-number">{{ gameStore.personalStats.gamesPlayed }}</span>
            <span class="kpi-label">{{ t('stats.played') }}</span>
          </div>
          <div class="kpi">
            <span class="kpi-number">{{ gameStore.winRate }}%</span>
            <span class="kpi-label">{{ t('stats.winRate') }}</span>
          </div>
          <div class="kpi">
            <span class="kpi-number">{{ gameStore.averageAttempts }}</span>
            <span class="kpi-label">{{ t('stats.avgAttempts') }}</span>
          </div>
          <div class="kpi">
            <span class="kpi-number">{{ gameStore.streak.currentStreak }}</span>
            <span class="kpi-label">{{ t('stats.streak') }} <img src="/streak-flame.svg" alt="" class="kpi-flame" width="12" height="12" /></span>
          </div>
          <div class="kpi">
            <span class="kpi-number">{{ gameStore.streak.maxStreak }}</span>
            <span class="kpi-label">{{ t('stats.record') }} <img src="/streak-flame.svg" alt="" class="kpi-flame" width="12" height="12" /></span>
          </div>
        </div>

        <!-- Distribution des essais -->
        <div class="distrib-section">
          <h3 class="distrib-title">{{ t('stats.distribution') }}</h3>
          <div class="distribution">
            <div
              v-for="n in distributionKeys"
              :key="n"
              class="distrib-bar-row"
            >
              <span class="distrib-label">{{ n }}</span>
              <div class="distrib-bar-bg">
                <div
                  class="distrib-bar-fill"
                  :class="{ 'highlight': isLastGame(n) }"
                  :style="{ width: distribPercent(n) + '%' }"
                >
                  <span v-if="(gameStore.personalStats.attemptDistribution[n] || 0) > 0" class="distrib-count">
                    {{ gameStore.personalStats.attemptDistribution[n] || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Collection -->
        <div class="collection-stat">
          <span class="collection-text">
            {{ t('stats.collected', { count: gameStore.collection.length }, gameStore.collection.length) }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game'
import { useI18n } from 'vue-i18n'

defineEmits(['close'])

const gameStore = useGameStore()
const { t } = useI18n()

const distributionKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+']

function distribPercent(key: string): number {
  const dist = gameStore.personalStats.attemptDistribution
  const maxVal = Math.max(...Object.values(dist), 1)
  const val = dist[key] || 0
  return Math.max((val / maxVal) * 100, val > 0 ? 10 : 0)
}

function isLastGame(key: string): boolean {
  if (gameStore.gameStatus !== 'won') return false
  const attempts = gameStore.guesses.length
  if (key === '10+') return attempts >= 10
  return String(attempts) === key
}
</script>

<style scoped>
.stats-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  animation: fadeIn 0.25s ease-out;
  padding: 20px;
}

.stats-modal {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 2px solid rgba(251, 191, 36, 0.4);
  border-radius: 20px;
  padding: 28px;
  max-width: 420px;
  width: 100%;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  animation: scaleUp 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 0 40px rgba(251, 191, 36, 0.15);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.stats-title {
  color: #fbbf24;
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0;
}

.stats-close-btn {
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

.stats-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.4);
}

/* --- KPIs --- */
.stats-kpis {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 28px;
}

.kpi {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  padding: 12px 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}

.kpi-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #f1f5f9;
  line-height: 1;
}

.kpi-label {
  font-size: 0.6rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.kpi-flame {
  vertical-align: middle;
  flex-shrink: 0;
}

/* --- Distribution --- */
.distrib-section {
  margin-bottom: 24px;
}

.distrib-title {
  color: #e2e8f0;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 14px 0;
}

.distribution {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.distrib-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.distrib-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #94a3b8;
  min-width: 24px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.distrib-bar-bg {
  flex: 1;
  height: 24px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  overflow: hidden;
}

.distrib-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #334155, #475569);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  min-width: 0;
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.distrib-bar-fill.highlight {
  background: linear-gradient(90deg, #059669, #10b981);
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.35);
}

.distrib-count {
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
}

/* --- Collection --- */
.collection-stat {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(251, 191, 36, 0.08);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 12px;
}

.collection-icon {
  font-size: 1.3rem;
}

.collection-text {
  color: #e2e8f0;
  font-size: 0.9rem;
}

.collection-text strong {
  color: #fbbf24;
  font-weight: 800;
}

/* --- Animations --- */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from { transform: scale(0.85); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>

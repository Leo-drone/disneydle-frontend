<template>
  <div class="admin-dashboard">
    <div v-if="!authenticated" class="login-screen">
      <div class="login-card">
        <h1 class="login-title"> Disneydle Admin</h1>
        <p class="login-subtitle">Accès aux statistiques</p>
        <form @submit.prevent="authenticate" class="login-form">
          <input
            v-model="tokenInput"
            type="password"
            placeholder="Token d'accès"
            class="login-input"
            autofocus
          />
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? 'Chargement...' : 'Accéder' }}
          </button>
          <p v-if="error" class="login-error">{{ error }}</p>
        </form>
      </div>
    </div>

    <div v-else class="dashboard">
      <header class="dash-header">
        <div class="dash-header-left">
          <router-link to="/" class="back-link">← Retour au jeu</router-link>
          <h1 class="dash-title">📊 Dashboard Disneydle</h1>
        </div>
        <div class="dash-header-right">
          <button @click="loadStats" class="refresh-btn" :disabled="loading">🔄</button>
        </div>
      </header>

      <div class="summary-cards" v-if="stats">
        <div class="stat-card">
          <div class="stat-icon">👁️</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.summary.total_visits.toLocaleString() }}</span>
            <span class="stat-label">Visites</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.summary.total_wins.toLocaleString() }}</span>
            <span class="stat-label">Victoires</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.summary.global_median ?? '—' }}</span>
            <span class="stat-label">Médiane essais</span>
          </div>
        </div>
      </div>

      <div class="view-toggle">
        <button
          :class="['toggle-btn', { active: viewMode === 'daily' }]"
          @click="viewMode = 'daily'"
        >Par jour</button>
        <button
          :class="['toggle-btn', { active: viewMode === 'monthly' }]"
          @click="viewMode = 'monthly'"
        >Par mois</button>
      </div>

      <template v-if="viewMode === 'daily' && stats">
        <div class="chart-section">
          <h2 class="section-title">👁️ Visites par jour</h2>
          <div class="line-chart-wrapper">
            <svg
              :viewBox="'0 0 ' + chartWidth + ' ' + chartHeight"
              class="line-chart"
              preserveAspectRatio="none"
            >
              <line
                v-for="i in 5"
                :key="'gv-' + i"
                :x1="padLeft"
                :x2="chartWidth - padRight"
                :y1="padTop + ((i - 1) / 4) * plotHeight"
                :y2="padTop + ((i - 1) / 4) * plotHeight"
                class="grid-line"
              />
              <text
                v-for="i in 5"
                :key="'lv-' + i"
                :x="padLeft - 8"
                :y="padTop + ((i - 1) / 4) * plotHeight + 4"
                class="axis-label"
                text-anchor="end"
              >{{ Math.round(maxVisits - ((i - 1) / 4) * maxVisits) }}</text>
              <polygon :points="visitAreaPoints" class="chart-area area-visits" />
              <polyline :points="visitLinePoints" class="chart-line line-visits" />
              <g v-for="(pt, idx) in dailyVisitPoints" :key="'pv-' + idx">
                <circle :cx="pt.x" :cy="pt.y" r="5" class="chart-point point-visits" />
                <text :x="pt.x" :y="pt.y - 12" class="point-label">{{ pt.value }}</text>
              </g>
              <text
                v-for="(pt, idx) in dailyVisitPoints"
                :key="'xv-' + idx"
                :x="pt.x"
                :y="chartHeight - 4"
                class="axis-label"
                text-anchor="middle"
              >{{ pt.label }}</text>
            </svg>
          </div>
        </div>

        <div class="chart-section">
          <h2 class="section-title">🏆 Victoires par jour</h2>
          <div class="line-chart-wrapper">
            <svg
              :viewBox="'0 0 ' + chartWidth + ' ' + chartHeight"
              class="line-chart"
              preserveAspectRatio="none"
            >
              <line
                v-for="i in 5"
                :key="'gw-' + i"
                :x1="padLeft"
                :x2="chartWidth - padRight"
                :y1="padTop + ((i - 1) / 4) * plotHeight"
                :y2="padTop + ((i - 1) / 4) * plotHeight"
                class="grid-line"
              />
              <text
                v-for="i in 5"
                :key="'lw-' + i"
                :x="padLeft - 8"
                :y="padTop + ((i - 1) / 4) * plotHeight + 4"
                class="axis-label"
                text-anchor="end"
              >{{ Math.round(maxWins - ((i - 1) / 4) * maxWins) }}</text>
              <polygon :points="winAreaPoints" class="chart-area area-wins" />
              <polyline :points="winLinePoints" class="chart-line line-wins" />
              <g v-for="(pt, idx) in dailyWinPoints" :key="'pw-' + idx">
                <circle :cx="pt.x" :cy="pt.y" r="5" class="chart-point point-wins" />
                <text :x="pt.x" :y="pt.y - 12" class="point-label">{{ pt.value }}</text>
              </g>
              <text
                v-for="(pt, idx) in dailyWinPoints"
                :key="'xw-' + idx"
                :x="pt.x"
                :y="chartHeight - 4"
                class="axis-label"
                text-anchor="middle"
              >{{ pt.label }}</text>
            </svg>
          </div>
        </div>

        <div class="chart-section">
          <h2 class="section-title">📋 Détail par jour</h2>
          <div class="table-wrapper">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Personnage</th>
                  <th>Visites</th>
                  <th>Victoires</th>
                  <th>Médiane</th>
                  <th>Q1 (25%)</th>
                  <th>Q3 (75%)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="day in stats.daily" :key="day.date">
                  <td>{{ formatDateLong(day.date) }}</td>
                  <td class="character-cell">{{ day.character }}</td>
                  <td>{{ day.visits }}</td>
                  <td>{{ day.wins }}</td>
                  <td>{{ day.median ?? '—' }}</td>
                  <td>{{ day.q1 ?? '—' }}</td>
                  <td>{{ day.q3 ?? '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <template v-if="viewMode === 'monthly' && stats">
        <div class="chart-section">
          <h2 class="section-title">👁️ Visites par mois</h2>
          <div class="line-chart-wrapper">
            <svg
              :viewBox="'0 0 ' + chartWidth + ' ' + chartHeight"
              class="line-chart"
              preserveAspectRatio="none"
            >
              <line
                v-for="i in 5"
                :key="'gmv-' + i"
                :x1="padLeft"
                :x2="chartWidth - padRight"
                :y1="padTop + ((i - 1) / 4) * plotHeight"
                :y2="padTop + ((i - 1) / 4) * plotHeight"
                class="grid-line"
              />
              <text
                v-for="i in 5"
                :key="'lmv-' + i"
                :x="padLeft - 8"
                :y="padTop + ((i - 1) / 4) * plotHeight + 4"
                class="axis-label"
                text-anchor="end"
              >{{ Math.round(maxMonthlyVisits - ((i - 1) / 4) * maxMonthlyVisits) }}</text>
              <polygon :points="monthlyVisitAreaPoints" class="chart-area area-visits" />
              <polyline :points="monthlyVisitLinePoints" class="chart-line line-visits" />
              <g v-for="(pt, idx) in monthlyVisitPoints" :key="'pmv-' + idx">
                <circle :cx="pt.x" :cy="pt.y" r="6" class="chart-point point-visits" />
                <text :x="pt.x" :y="pt.y - 14" class="point-label">{{ pt.value }}</text>
              </g>
              <text
                v-for="(pt, idx) in monthlyVisitPoints"
                :key="'xmv-' + idx"
                :x="pt.x"
                :y="chartHeight - 4"
                class="axis-label"
                text-anchor="middle"
              >{{ pt.label }}</text>
            </svg>
          </div>
        </div>

        <div class="chart-section">
          <h2 class="section-title">🏆 Victoires par mois</h2>
          <div class="line-chart-wrapper">
            <svg
              :viewBox="'0 0 ' + chartWidth + ' ' + chartHeight"
              class="line-chart"
              preserveAspectRatio="none"
            >
              <line
                v-for="i in 5"
                :key="'gmw-' + i"
                :x1="padLeft"
                :x2="chartWidth - padRight"
                :y1="padTop + ((i - 1) / 4) * plotHeight"
                :y2="padTop + ((i - 1) / 4) * plotHeight"
                class="grid-line"
              />
              <text
                v-for="i in 5"
                :key="'lmw-' + i"
                :x="padLeft - 8"
                :y="padTop + ((i - 1) / 4) * plotHeight + 4"
                class="axis-label"
                text-anchor="end"
              >{{ Math.round(maxMonthlyWins - ((i - 1) / 4) * maxMonthlyWins) }}</text>
              <polygon :points="monthlyWinAreaPoints" class="chart-area area-wins" />
              <polyline :points="monthlyWinLinePoints" class="chart-line line-wins" />
              <g v-for="(pt, idx) in monthlyWinPoints" :key="'pmw-' + idx">
                <circle :cx="pt.x" :cy="pt.y" r="6" class="chart-point point-wins" />
                <text :x="pt.x" :y="pt.y - 14" class="point-label">{{ pt.value }}</text>
              </g>
              <text
                v-for="(pt, idx) in monthlyWinPoints"
                :key="'xmw-' + idx"
                :x="pt.x"
                :y="chartHeight - 4"
                class="axis-label"
                text-anchor="middle"
              >{{ pt.label }}</text>
            </svg>
          </div>
        </div>

        <div class="chart-section">
          <h2 class="section-title">📋 Détail par mois</h2>
          <div class="table-wrapper">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>Mois</th>
                  <th>Visites</th>
                  <th>Victoires</th>
                  <th>Médiane essais</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in stats.monthly" :key="m.month">
                  <td>{{ formatMonth(m.month) }}</td>
                  <td>{{ m.visits }}</td>
                  <td>{{ m.wins }}</td>
                  <td>{{ m.median ?? '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { apiService, type StatsResponse } from '../services/api'

const authenticated = ref(false)
const tokenInput = ref('')
const token = ref('')
const loading = ref(false)
const error = ref('')
const stats = ref<StatsResponse | null>(null)
const viewMode = ref<'daily' | 'monthly'>('daily')

const chartWidth = 800
const chartHeight = 300
const padLeft = 50
const padRight = 20
const padTop = 25
const padBottom = 35
const plotHeight = chartHeight - padTop - padBottom

async function authenticate() {
  loading.value = true
  error.value = ''
  try {
    const result = await apiService.getStats(tokenInput.value)
    stats.value = result
    token.value = tokenInput.value
    authenticated.value = true
  } catch (e: any) {
    if (e.response?.status === 429) {
      error.value = 'Trop de tentatives. Réessayez dans 15 minutes.'
    } else if (e.response?.status === 403) {
      error.value = 'Token invalide'
    } else {
      error.value = 'Erreur de connexion au serveur'
    }
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  loading.value = true
  try {
    stats.value = await apiService.getStats(token.value)
  } catch (e) {
    console.error('Erreur chargement stats', e)
  } finally {
    loading.value = false
  }
}

interface ChartPoint {
  x: number
  y: number
  value: number
  label: string
}

function computePoints(data: { value: number; label: string }[], max: number): ChartPoint[] {
  const n = data.length
  if (n === 0) return []
  const plotW = chartWidth - padLeft - padRight
  return data.map((d, i) => ({
    x: padLeft + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW),
    y: padTop + plotHeight - (max === 0 ? 0 : (d.value / max) * plotHeight),
    value: d.value,
    label: d.label,
  }))
}

function pointsToLine(pts: ChartPoint[]): string {
  return pts.map((p) => p.x + ',' + p.y).join(' ')
}

function pointsToArea(pts: ChartPoint[]): string {
  if (pts.length === 0) return ''
  const bottom = padTop + plotHeight
  const first = pts[0]!
  const last = pts[pts.length - 1]!
  return first.x + ',' + bottom + ' ' + pointsToLine(pts) + ' ' + last.x + ',' + bottom
}

const dailyChronological = computed(() => {
  if (!stats.value) return []
  return [...stats.value.daily].reverse()
})

const maxVisits = computed(() => {
  if (!dailyChronological.value.length) return 1
  return Math.max(...dailyChronological.value.map((d) => d.visits), 1)
})

const maxWins = computed(() => {
  if (!dailyChronological.value.length) return 1
  return Math.max(...dailyChronological.value.map((d) => d.wins), 1)
})

const dailyVisitPoints = computed(() =>
  computePoints(
    dailyChronological.value.map((d) => ({ value: d.visits, label: formatDate(d.date) })),
    maxVisits.value,
  ),
)

const dailyWinPoints = computed(() =>
  computePoints(
    dailyChronological.value.map((d) => ({ value: d.wins, label: formatDate(d.date) })),
    maxWins.value,
  ),
)

const visitLinePoints = computed(() => pointsToLine(dailyVisitPoints.value))
const visitAreaPoints = computed(() => pointsToArea(dailyVisitPoints.value))
const winLinePoints = computed(() => pointsToLine(dailyWinPoints.value))
const winAreaPoints = computed(() => pointsToArea(dailyWinPoints.value))

const maxMonthlyVisits = computed(() => {
  if (!stats.value?.monthly.length) return 1
  return Math.max(...stats.value.monthly.map((m) => m.visits), 1)
})

const maxMonthlyWins = computed(() => {
  if (!stats.value?.monthly.length) return 1
  return Math.max(...stats.value.monthly.map((m) => m.wins), 1)
})

const monthlyVisitPoints = computed(() =>
  computePoints(
    (stats.value?.monthly || []).map((m) => ({
      value: m.visits,
      label: formatMonthShort(m.month),
    })),
    maxMonthlyVisits.value,
  ),
)

const monthlyWinPoints = computed(() =>
  computePoints(
    (stats.value?.monthly || []).map((m) => ({
      value: m.wins,
      label: formatMonthShort(m.month),
    })),
    maxMonthlyWins.value,
  ),
)

const monthlyVisitLinePoints = computed(() => pointsToLine(monthlyVisitPoints.value))
const monthlyVisitAreaPoints = computed(() => pointsToArea(monthlyVisitPoints.value))
const monthlyWinLinePoints = computed(() => pointsToLine(monthlyWinPoints.value))
const monthlyWinAreaPoints = computed(() => pointsToArea(monthlyWinPoints.value))

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.getDate() + '/' + (d.getMonth() + 1)
}

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatMonth(monthStr: string): string {
  const parts = monthStr.split('-')
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1)
  return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

function formatMonthShort(monthStr: string): string {
  const parts = monthStr.split('-')
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1)
  return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
}

// Suppress unused var warning
void padBottom
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  color: #e2e8f0;
}

.login-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.login-card {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  max-width: 380px;
  width: 90%;
  backdrop-filter: blur(10px);
}

.login-title {
  font-size: 1.8rem;
  margin-bottom: 8px;
  color: #fbbf24;
}

.login-subtitle {
  color: #94a3b8;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login-input {
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.login-input:focus {
  border-color: #fbbf24;
}

.login-btn {
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #1e293b;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.login-btn:hover {
  transform: scale(1.02);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-error {
  color: #ef4444;
  font-size: 0.9rem;
}

.dashboard {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
}

.dash-header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.back-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: #fbbf24;
}

.dash-title {
  font-size: 1.6rem;
  color: #fbbf24;
}

.dash-header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.refresh-btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(30, 41, 59, 0.8);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(6px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
}

.stat-label {
  font-size: 0.85rem;
  color: #94a3b8;
}

.view-toggle {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  padding: 4px;
  width: fit-content;
}

.toggle-btn {
  padding: 10px 22px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.toggle-btn:hover:not(.active) {
  color: #e2e8f0;
}

.chart-section {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  backdrop-filter: blur(6px);
}

.section-title {
  font-size: 1.1rem;
  color: #e2e8f0;
  margin-bottom: 16px;
}

.line-chart-wrapper {
  overflow-x: auto;
  padding-bottom: 4px;
}

.line-chart {
  width: 100%;
  height: auto;
  min-height: 250px;
  max-height: 320px;
}

.grid-line {
  stroke: rgba(255, 255, 255, 0.07);
  stroke-width: 1;
  stroke-dasharray: 4 4;
}

.axis-label {
  fill: #64748b;
  font-size: 11px;
  font-family: -apple-system, sans-serif;
}

.chart-area {
  opacity: 0.15;
}

.area-visits {
  fill: #60a5fa;
}

.area-wins {
  fill: #4ade80;
}

.chart-line {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.line-visits {
  stroke: #60a5fa;
}

.line-wins {
  stroke: #4ade80;
}

.chart-point {
  stroke: #1e293b;
  stroke-width: 2;
  cursor: pointer;
  transition: r 0.15s ease;
}

.chart-point:hover {
  r: 7;
}

.point-visits {
  fill: #60a5fa;
}

.point-wins {
  fill: #4ade80;
}

.point-label {
  fill: #cbd5e1;
  font-size: 10px;
  font-weight: 700;
  font-family: -apple-system, sans-serif;
  text-anchor: middle;
  opacity: 0;
  transition: opacity 0.15s;
  pointer-events: none;
}

g:hover .point-label {
  opacity: 1;
}

.table-wrapper {
  overflow-x: auto;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table th {
  text-align: left;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.stats-table td {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
}

.stats-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.character-cell {
  color: #fbbf24;
  font-weight: 600;
}

@media (max-width: 600px) {
  .summary-cards {
    grid-template-columns: 1fr 1fr;
  }

  .dash-header {
    flex-direction: column;
  }

  .stat-value {
    font-size: 1.4rem;
  }

  .line-chart {
    min-height: 200px;
  }
}
</style>

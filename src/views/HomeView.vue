<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GameBoard from '../components/GameBoard.vue'

const { t } = useI18n()
</script>

<template>
  <GameBoard />
  
  <footer class="app-footer">
    <p>{{ t('footer.disclaimer') }}</p>
    <p>{{ t('footer.removal') }}</p>
    <p>
      <router-link to="/about" class="footer-link">{{ t('footer.about') }}</router-link>
      <span class="footer-sep">·</span>
      <router-link to="/confidentialite" class="footer-link">{{ t('footer.privacy') }}</router-link>
    </p>
  </footer>
</template>

<style scoped>
.app-footer {
  text-align: center;
  padding: 20px;
  color: white;
  font-size: 14px;
  margin-top: 40px;
}

.app-footer a {
  color: white;
  text-decoration: underline;
}

.footer-link {
  color: #94a3b8;
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #fbbf24;
}

.footer-sep {
  color: #475569;
  margin: 0 8px;
}
</style>

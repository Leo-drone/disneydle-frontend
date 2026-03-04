<script setup lang="ts">
import GameBoard from '../components/GameBoard.vue'
</script>

<template>
  <GameBoard />
  
  <footer class="app-footer">
    <p>Ce projet est indépendant et n'est ni affilié, ni soutenu par The Walt Disney Company. Tous les droits leur appartiennent.</p>
    <p>Ce site peut être retiré à tout moment sur demande de The Walt Disney Company.</p>
    <p>
      <router-link to="/about" class="footer-link">À propos</router-link>
      <span class="footer-sep">·</span>
      <router-link to="/confidentialite" class="footer-link">Politique de confidentialité</router-link>
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

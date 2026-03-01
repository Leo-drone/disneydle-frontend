<script setup lang="ts">
import GameBoard from '../components/GameBoard.vue'
</script>

<template>
  <GameBoard />
  
  <footer class="app-footer">
    <p>Ce projet n'est pas soutenu par Disney et tous les droits leur appartiennent.</p>
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
</style>

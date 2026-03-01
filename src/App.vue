<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>


<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #1e3a8a;
  color: #e2e8f0;  background: #0f172a; 
  color: #e2e8f0; 
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

body::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 10%, #2e4a7d 0%, #1a2c4e 40%, #0f172a 100%); 
  z-index: -2;
  /* background-attachment ne fonctionne pas sur un pseudo-element, mais position:fixed fait le job */
}

body::before {
  content: '';
  position: fixed;
  top: -350px;
  left: -350px;
  width: calc(100% + 700px);
  height: calc(100% + 700px);
  background-image: 
    /* Couche 1 : Les étoiles lointaines (très petites et nombreuses) */
    radial-gradient(1px 1px at 12% 16%, white, transparent),
    radial-gradient(1px 1px at 23% 84%, white, transparent),
    radial-gradient(1px 1px at 35% 22%, white, transparent),
    radial-gradient(1px 1px at 47% 91%, white, transparent),
    radial-gradient(1px 1px at 58% 33%, white, transparent),
    radial-gradient(1px 1px at 64% 76%, white, transparent),
    radial-gradient(1px 1px at 79% 14%, white, transparent),
    radial-gradient(1px 1px at 85% 62%, white, transparent),
    radial-gradient(1px 1px at 93% 45%, white, transparent),
    
    /* Couche 2 : Étoiles moyennes (plus brillantes) */
    radial-gradient(2px 2px at 15% 55%, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 38% 15%, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 55% 85%, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 72% 35%, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 88% 75%, rgba(255,255,255,0.8), transparent);
    
  background-size: 350px 350px; /* Taille uniforme pour permettre une boucle parfaite */
  background-position: 0 0;
    
  animation: starsScroll 60s linear infinite; /* Animation plus rapide et basée sur background-position */
  z-index: -1;
  opacity: 0.8;
}

@keyframes starsScroll {
    from { transform: translate(0, 0); }
    to { transform: translate(350px, -350px); }
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}
</style>

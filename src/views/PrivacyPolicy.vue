<template>
  <div class="privacy-container">
    <router-link to="/" class="back-link">{{ t('common.back') }}</router-link>
    <h1>{{ t('privacy.title') }}</h1>
    <p class="last-update">{{ t('privacy.lastUpdate') }}</p>

    <h2>{{ t('privacy.s1Title') }}</h2>
    <p>{{ t('privacy.s1Text') }}</p>

    <h2>{{ t('privacy.s2Title') }}</h2>
    <p>{{ t('privacy.s2Text') }}</p>
    <ul>
      <li>{{ t('privacy.s2li1') }}</li>
      <li>{{ t('privacy.s2li2') }}</li>
      <li>{{ t('privacy.s2li3') }}</li>
      <li>{{ t('privacy.s2li4') }}</li>
    </ul>
    <p>{{ t('privacy.s2Footer') }}</p>

    <h2>{{ t('privacy.s3Title') }}</h2>
    <p>{{ t('privacy.s3Text') }}</p>

    <h2>{{ t('privacy.s4Title') }}</h2>
    <p>{{ t('privacy.s4Text') }}</p>

    <h2>{{ t('privacy.s5Title') }}</h2>
    <p>{{ t('privacy.s5Text') }}</p>

    <h2>{{ t('privacy.s6Title') }}</h2>
    <p>{{ t('privacy.s6Text') }}</p>

    <h2>{{ t('privacy.s7Title') }}</h2>
    <p>{{ t('privacy.s7Text') }}</p>

    <h2>{{ t('privacy.s8Title') }}</h2>
    <p>{{ t('privacy.s8Text') }}</p>

    <h2>{{ t('privacy.s9Title') }}</h2>
    <p>
      {{ t('privacy.s9Text') }}
      <a href="mailto:contact@disneydle.fr">contact@disneydle.fr</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.privacy-container {
  max-width: 700px;
  margin: 40px auto;
  background: #1e293b;
  color: #f1f5f9;
  border-radius: 18px;
  box-shadow: 0 0 24px rgba(0,0,0,0.10);
  padding: 36px 28px;
  font-size: 1.05rem;
}
.privacy-container h1 {
  font-size: 2rem;
  color: #fbbf24;
  margin-bottom: 6px;
}
.last-update {
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 24px;
}
.privacy-container h2 {
  color: #fbbf24;
  font-size: 1.15rem;
  margin-top: 28px;
  margin-bottom: 8px;
}
.privacy-container ul {
  margin: 0 0 12px 18px;
  padding: 0;
}
.privacy-container li {
  margin-bottom: 6px;
}
.privacy-container a {
  color: #38bdf8;
  text-decoration: underline;
}
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}
.back-link:hover {
  color: #fbbf24;
}
</style>

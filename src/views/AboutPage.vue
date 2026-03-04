<template>
  <div class="about-container">
    <router-link to="/" class="back-link">{{ t('common.back') }}</router-link>
    <h1>{{ t('about.title') }}</h1>

    <section class="about-section">
      <h2>{{ t('about.whyTitle') }}</h2>
      <p>{{ t('about.whyP1') }}</p>
      <p>{{ t('about.whyP2') }}</p>
    </section>

    <section class="about-section">
      <h2>{{ t('about.conceptTitle') }}</h2>
      <p>{{ t('about.conceptText') }}</p>
    </section>

    <section class="about-section">
      <h2>{{ t('about.passionTitle') }}</h2>
      <p>{{ t('about.passionP1') }}</p>
      <p class="about-joke">{{ t('about.passionJoke') }}</p>
      <p>
        {{ t('about.passionContact') }}
        <a href="mailto:contact@disneydle.fr">contact@disneydle.fr</a>
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.about-container {
  max-width: 700px;
  margin: 40px auto;
  background: #1e293b;
  color: #f1f5f9;
  border-radius: 18px;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.10);
  padding: 36px 28px;
  font-size: 1.05rem;
}

.about-container h1 {
  font-size: 2rem;
  color: #fbbf24;
  margin-bottom: 24px;
}

.about-section {
  margin-bottom: 28px;
}

.about-section:last-child {
  margin-bottom: 0;
}

.about-section h2 {
  color: #fbbf24;
  font-size: 1.15rem;
  margin-bottom: 10px;
}

.about-section p {
  color: #cbd5e1;
  line-height: 1.7;
  margin-bottom: 10px;
}

.about-section p:last-child {
  margin-bottom: 0;
}

.about-joke {
  font-style: italic;
  color: #94a3b8;
}

.about-section a {
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

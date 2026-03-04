<template>
  <div class="about-container">
    <router-link to="/" class="back-link">← Retour au jeu</router-link>
    <h1>À propos</h1>

    <section class="about-section">
      <h2>Pourquoi Disneydle ?</h2>
      <p>
        Fan de Disney et Pixar depuis toujours, j'ai grandi avec des films comme
        Ratatouille, Cars ou encore Le Livre de la Jungle. Un jour, en jouant à des jeux
        de type "dle" (Wordle, Pokedle...), je me suis dit : pourquoi il n'en existe
        pas un sur l'univers Disney ?
      </p>
      <p>
        Alors je l'ai créé.
      </p>
    </section>

    <section class="about-section">
      <h2>Le concept</h2>
      <p>
        Chaque jour, un nouveau personnage Disney ou Pixar est à deviner.
        Proposez des noms, analysez les indices et tentez de trouver le bon personnage
        en un minimum d'essais. Collectionnez-les tous dans votre album !
      </p>
    </section>

    <section class="about-section">
      <h2>Un projet fait avec passion</h2>
      <p>
        Disneydle est un projet personnel, gratuit et sans publicité.
        Il a été conçu pour être partagé avec tous ceux qui, comme moi,
        adorent l'univers Disney et aiment les petits défis quotidiens.
      </p>
      <p class="about-joke">
        En espérant qu'il vive assez longtemps pour que tout le monde en profite...
      </p>
      <p>
        Si vous avez des suggestions, des idées de personnages à ajouter
        ou simplement envie de dire bonjour, n'hésitez pas à écrire à
        <a href="mailto:contact@disneydle.fr">contact@disneydle.fr</a>
      </p>
    </section>
  </div>
</template>

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

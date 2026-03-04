<template>
  <div class="privacy-container">
    <router-link to="/" class="back-link">← Retour au jeu</router-link>
    <h1>Politique de confidentialité</h1>
    <p class="last-update">Dernière mise à jour : 4 mars 2026</p>

    <h2>1. Présentation</h2>
    <p>
      Disneydle est un jeu en ligne gratuit où vous devinez un personnage Disney ou Pixar chaque jour.
      Ce projet est indépendant et n'est ni affilié, ni soutenu par The Walt Disney Company.
      Votre vie privée est importante : nous collectons le strict minimum pour faire fonctionner le jeu.
    </p>

    <h2>2. Ce qui reste sur votre appareil</h2>
    <p>
      Votre progression est sauvegardée directement dans votre navigateur.
      Ces informations ne quittent jamais votre appareil :
    </p>
    <ul>
      <li>Vos tentatives et l'état de la partie en cours</li>
      <li>Vos statistiques (parties jouées, victoires, nombre d'essais)</li>
      <li>Votre série de victoires consécutives</li>
      <li>Votre collection de personnages trouvés</li>
    </ul>
    <p>
      Vous pouvez les supprimer à tout moment en effaçant les données de navigation de votre navigateur.
    </p>

    <h2>3. Ce que nous savons de vous</h2>
    <p>
      Très peu de choses. Il n'y a <strong>aucun compte utilisateur</strong> sur Disneydle.
      Nous enregistrons uniquement des chiffres globaux et anonymes pour savoir combien de personnes jouent chaque jour et combien trouvent la bonne réponse.
      Ces chiffres ne permettent pas de vous identifier.
    </p>

    <h2>4. Publicité et pistage</h2>
    <p>
      Il n'y a <strong>aucune publicité</strong> sur Disneydle.
      Nous n'utilisons <strong>aucun outil de suivi</strong> (pas de Google Analytics, pas de trackers, pas de cookies publicitaires).
      Personne ne suit votre activité sur ce site.
    </p>

    <h2>5. Partage avec des tiers</h2>
    <p>
      Nous ne vendons, ne partageons et ne transmettons aucune information à qui que ce soit.
    </p>

    <h2>6. Sécurité</h2>
    <p>
      La connexion au site est sécurisée et chiffrée. Nous mettons en place des protections
      pour empêcher les abus et garantir le bon fonctionnement du jeu.
    </p>

    <h2>7. Vos droits</h2>
    <p>
      Comme nous ne stockons aucune donnée personnelle sur nos serveurs, il n'y a rien à demander,
      modifier ou supprimer de notre côté. Vos statistiques et votre collection sont entièrement
      sous votre contrôle dans votre navigateur.
    </p>

    <h2>8. Propriété intellectuelle</h2>
    <p>
      Disneydle est un projet indépendant à but non commercial. Tous les noms, images et
      personnages Disney et Pixar appartiennent à The Walt Disney Company.
      Ce site peut être retiré à tout moment sur demande de leur part.
    </p>

    <h2>9. Contact</h2>
    <p>
      Pour toute question, vous pouvez nous écrire à :
      <a href="mailto:contact@disneydle.fr">contact@disneydle.fr</a>
    </p>
  </div>
</template>

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

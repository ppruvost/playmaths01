// =============================
// BONUS PLAY MATHS (indépendant de la note)
// =============================

// Variable globale accessible partout
window.bonusPoints = 0;

// Fonction pour ajouter un bonus
// Exemple : addBonus(3) → ajoute +3 pts Play Maths
function addBonus(points) {
    window.bonusPoints += points;
}

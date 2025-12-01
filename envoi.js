// envoi.js - envoi EmailJS des résultats + récapitulatif

// =============================
// Initialisation EmailJS
// =============================
(function () {
  if (window.emailjs) {
    try {
      emailjs.init("TJHX0tkW1CCz7lv7a");   // clé publique
    } catch (e) {
      console.warn("EmailJS init failed :", e);
    }
  }
})();


// =============================
// ENVOI DES RÉSULTATS
// =============================
// sendResults(user, score, shuffledQuestions, playMathsPoints)
function sendResults(user, score, shuffledQuestions, playMathsPoints) {

  if (!window.emailjs) {
    console.warn("EmailJS non chargé !");
    return;
  }

  // Score sur 20
  const scoreFinal = `${score} / ${shuffledQuestions.length}`;

  // Bonus Play Maths
  const bonusFinal = `${playMathsPoints} pts`;

  // =============================
  // Construction du récap
  // =============================
  let recap = "";
  shuffledQuestions.forEach((q, i) => {
    recap += `Q${i + 1}: ${q.question}\n`;
    recap += `Réponse élève : ${q.userAnswer || "Aucune"}\n`;
    recap += `Bonne réponse : ${q.bonne_reponse}\n\n`;
  });

  // =============================
  // Paramètres envoyés à EmailJS
  // =============================
  const emailParams = {
    nom: user.nom || "",
    prenom: user.prenom || "",
    note20: scoreFinal,              // pour {{note20}}
    points_play_maths: bonusFinal,   // pour {{points_play_maths}}
    details: recap,                  // pour {{details}}
    email: "lyceepro.mermoz@gmail.com"
  };

  // =============================
  // Envoi EmailJS
  // =============================
  emailjs
    .send("service_cgh817y", "template_ly7s41e", emailParams)
    .then(() => {
      alert("✅ Résultats envoyés automatiquement à votre professeur. Merci !");
    })
    .catch((err) => {
      console.error("Erreur envoi EmailJS :", err);
      alert(
        "❌ Erreur lors de l'envoi : " +
          (err?.text ? err.text : JSON.stringify(err))
      );
    });
}

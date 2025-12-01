// envoi.js - envoi EmailJS des résultats + recap
// Initialise EmailJS (ta clé publique)
(function(){
  if(window.emailjs){
    try{
      emailjs.init("TJHX0tkW1CCz7lv7a");
    }catch(e){
      console.warn("EmailJS init failed", e);
    }
  }
})();

// sendResults(user, score, shuffledQuestions, playMathsPoints)
function sendResults(user, score, shuffledQuestions, playMathsPoints){
  // sécurité : vérifier emailjs présent
  if(!window.emailjs){
    console.warn("EmailJS non chargé.");
    return;
  }

  const scoreFinal = `${score} / ${shuffledQuestions.length}`;
  const bonusFinal = `${playMathsPoints} pts`;

  // Préparer récapitulatif
  let recap = "";
  shuffledQuestions.forEach((q, i) => {
    recap += `Q${i+1}: ${q.question}\n`;
    recap += `Réponse élève: ${q.userAnswer || "Aucune"}\n`;
    recap += `Bonne réponse: ${q.bonne_reponse}\n\n`;
  });

  // Paramètres envoyés à EmailJS
  const emailParams = {
    nom: user.nom || "",
    prenom: user.prenom || "",
    score: scoreFinal,
    points_play_maths: bonusFinal,   // <<< AJOUT IMPORTANT
    details: recap,
    email: "lyceepro.mermoz@gmail.com"
  };

  // Remplacer service/template par les tiens si besoin
  emailjs.send("service_cgh817y", "template_ly7s41e", emailParams)
    .then(() => {
      alert("✅ Résultats envoyés automatiquement par e-mail à votre professeur. Merci !");
    })
    .catch((err) => {
      console.error("Erreur envoi EmailJS", err);
      alert("❌ Erreur lors de l'envoi : " + (err && err.text ? err.text : JSON.stringify(err)));
    });
}

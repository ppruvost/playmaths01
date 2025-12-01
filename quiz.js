/* quiz.js - gestion du quiz, clic direct, explication 9s, timer, enregistrement userAnswer */

let current = 0;
let score = 0;
let shuffledQuestions = [];
let timerInterval = null;
let timeLeft = 30;

// éléments DOM
const startBtn = document.getElementById("startQuiz");
const nomInput = document.getElementById("nom");
const prenomInput = document.getElementById("prenom");

const questionBox = document.getElementById("questionBox");
const answerGrid = document.getElementById("answerGrid");
const explanationBox = document.getElementById("explanationBox");
const timerNumber = document.getElementById("timerNumber");
const timerCircle = document.getElementById("timer-circle");
const scoreBox = document.getElementById("scoreBox");
const victorySound = document.getElementById("victorySound");
const bgMusic = document.getElementById("bgMusic");

// fonction utilitaire pour mélanger
function shuffleArray(arr){
  return arr.slice().sort(()=>Math.random()-0.5);
}

// start
startBtn.addEventListener("click", () => {
  const nom = nomInput.value.trim();
  const prenom = prenomInput.value.trim();
  if(!nom){ nomInput.focus(); return; }
  if(!prenom){ prenomInput.focus(); return; }

  // initialisation
  score = 0;
  current = 0;

  // clone et mélange des questions
  if(!Array.isArray(questions) || questions.length === 0){
    alert("Erreur : questions introuvables. Vérifie questions.js");
    return;
  }
  shuffledQuestions = shuffleArray(questions);

  // démarrer musique si présente (tentative)
  if(bgMusic){
    bgMusic.volume = 0.35;
    bgMusic.play().catch(()=>{});
  }

  // masquer le formulaire
  document.getElementById("userForm").style.display = "none";

  // afficher première question
  showQuestion();
});

// montre la question courante
function showQuestion(){
  clearTimer();

  const q = shuffledQuestions[current];
  if(!q){
    endQuiz();
    return;
  }

  // affichage
  questionBox.textContent = `${current + 1}. ${q.question}`;
  explanationBox.style.display = "none";
  explanationBox.innerHTML = "";
  answerGrid.innerHTML = "";

  // construire options
  const colors = ["red","blue","yellow","green"];
  q.options.forEach((opt, idx) => {
    const d = document.createElement("div");
    d.className = `answer ${colors[idx % colors.length]}`;
    d.textContent = opt;

    // clic direct -> validation immédiate
    d.addEventListener("click", () => handleAnswer(opt, d));

    answerGrid.appendChild(d);
  });

  // démarrer timer
  startTimer();
}

// gestion du clic / validation immédiate
function handleAnswer(option, selectedDiv){
  clearTimer();

  const q = shuffledQuestions[current];
  // enregistrer la réponse de l'élève
  q.userAnswer = option || "Aucune";

  // désactiver clics
  document.querySelectorAll(".answer").forEach(a => a.style.pointerEvents = "none");

  // montrer la bonne réponse et feedback
  const correct = q.bonne_reponse;
  // si sélection valide
  if(option === correct){
    if(selectedDiv) selectedDiv.classList.add("answer-correct");
    score++;
  } else {
    if(selectedDiv) selectedDiv.classList.add("answer-wrong");
    // mettre en évidence la bonne réponse
    document.querySelectorAll(".answer").forEach(a => {
      if(a.textContent.trim() === String(correct).trim()){
        a.classList.add("answer-correct");
      }
    });
  }

  // afficher explication pédagogique
  explanationBox.innerHTML = `<strong>Explication :</strong> ${q.explication || ""}`;
  explanationBox.style.display = "block";

  // mettre à jour score intermédiaire visible
  scoreBox.textContent = `Score : ${score} / ${shuffledQuestions.length}`;

  // si toutes les questions répondues, fin après 9s, sinon next
  setTimeout(() => {
    current++;
    if(current < shuffledQuestions.length){
      showQuestion();
    } else {
      endQuiz();
    }
  }, 9000);
}

// cas timeout (pas de réponse)
function forceTimeout(){
  // enregistre "Aucune" et affiche la bonne réponse
  const q = shuffledQuestions[current];
  q.userAnswer = "Aucune";
  // simuler gestion d'une mauvaise réponse
  // trouver la bonne réponse DOM et marquer
  document.querySelectorAll(".answer").forEach(a => {
    if(a.textContent.trim() === String(q.bonne_reponse).trim()){
      a.classList.add("answer-correct");
    } else {
      a.classList.add("answer-wrong");
    }
    a.style.pointerEvents = "none";
  });

  explanationBox.innerHTML = `<strong>Explication :</strong> ${q.explication || ""}`;
  explanationBox.style.display = "block";
  // mise à jour score (aucune augmentation)
  scoreBox.textContent = `Score : ${score} / ${shuffledQuestions.length}`;

  setTimeout(() => {
    current++;
    if(current < shuffledQuestions.length){
      showQuestion();
    } else {
      endQuiz();
    }
  }, 9000);
}

// ---- TIMER SVG ----
function startTimer(){
  timeLeft = 30;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  timerCircle.style.strokeDasharray = `${circumference}`;
  timerCircle.style.strokeDashoffset = `${0}`;
  // couleur par défaut
  timerCircle.style.stroke = "#e0e0e0";

  timerNumber.textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerNumber.textContent = timeLeft;

    const offset = circumference - (timeLeft / 30) * circumference;
    timerCircle.style.strokeDashoffset = offset;

    if(timeLeft <= 10){
      timerCircle.style.stroke = "#f39c12";
    } else {
      timerCircle.style.stroke = "#3498db";
    }

    if(timeLeft <= 0){
      clearInterval(timerInterval);
      forceTimeout();
    }
  }, 1000);
}
function clearTimer(){
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}

// ---- FIN DU QUIZ ----
function endQuiz(){
  clearTimer();
  // arrêter musique si présente
  if(bgMusic){ try{ bgMusic.pause(); bgMusic.currentTime = 0; } catch(e){} }
  // play jingle si présent
  if(victorySound) victorySound.play().catch(()=>{});

  // confettis
  try{
    confetti && confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
  }catch(e){}

  // affichage récap
  questionBox.textContent = `Quiz terminé ! Score final : ${score} / ${shuffledQuestions.length}`;
  answerGrid.innerHTML = "";
  explanationBox.style.display = "none";
  scoreBox.textContent = `Score final : ${score} / ${shuffledQuestions.length}`;

  // appel envoi des résultats (envoi.js)
  if(typeof sendResults === "function"){
    // informations utilisateur
    const user = {
      nom: document.getElementById("nom").value.trim(),
      prenom: document.getElementById("prenom").value.trim()
    };
    sendResults(user, score, shuffledQuestions);
  }
}

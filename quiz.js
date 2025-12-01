/* quiz.js - gestion du quiz, clic direct, explication 9s, timer, enregistrement userAnswer */

let current = 0;
let score = 0;
let shuffledQuestions = [];
let timerInterval = null;
let timeLeft = 30;

// >>> AJOUT PLAY MATHS <<<
let startTime = 0;            // début chrono question
let playMathsPoints = 0;      // points Play Maths cumulés
// <<< FIN AJOUT <<<

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
  playMathsPoints = 0;   // reset bonus

  if(!Array.isArray(questions) || questions.length === 0){
    alert("Erreur : questions introuvables. Vérifie questions.js");
    return;
  }

  shuffledQuestions = shuffleArray(questions);

  if(bgMusic){
    bgMusic.volume = 0.35;
    bgMusic.play().catch(()=>{});
  }

  document.getElementById("userForm").style.display = "none";

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

  questionBox.textContent = `${current + 1}. ${q.question}`;
  explanationBox.style.display = "none";
  explanationBox.innerHTML = "";
  answerGrid.innerHTML = "";

  const colors = ["red","blue","yellow","green"];
  q.options.forEach((opt, idx) => {
    const d = document.createElement("div");
    d.className = `answer ${colors[idx % colors.length]}`;
    d.textContent = opt;

    d.addEventListener("click", () => handleAnswer(opt, d));

    answerGrid.appendChild(d);
  });

  // >>> DÉMARRAGE CHRONO PLAY MATHS <<<
  startTime = Date.now();
  // <<< FIN AJOUT <<<

  // démarrer timer
  startTimer();
}

// gestion du clic / validation immédiate
function handleAnswer(option, selectedDiv){
  clearTimer();

  const q = shuffledQuestions[current];
  q.userAnswer = option || "Aucune";

  document.querySelectorAll(".answer").forEach(a => a.style.pointerEvents = "none");

  const correct = q.bonne_reponse;
  const isCorrect = option === correct;

  if(isCorrect){
    if(selectedDiv) selectedDiv.classList.add("answer-correct");
    score++;

    // >>> BONUS PLAY MATHS <<<
    const timeTaken = (Date.now() - startTime) / 1000;
    let bonus = 0;

    if(timeTaken < 2) bonus = 5;
    else if(timeTaken < 5) bonus = 3;
    else if(timeTaken < 10) bonus = 1;

    playMathsPoints += bonus;
    // <<< FIN BONUS >>>

  } else {
    if(selectedDiv) selectedDiv.classList.add("answer-wrong");
    document.querySelectorAll(".answer").forEach(a => {
      if(a.textContent.trim() === String(correct).trim()){
        a.classList.add("answer-correct");
      }
    });
  }

  explanationBox.innerHTML = `<strong>Explication :</strong> ${q.explication || ""}`;
  explanationBox.style.display = "block";

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

// cas timeout
function forceTimeout(){
  const q = shuffledQuestions[current];
  q.userAnswer = "Aucune";

  // aucun bonus en cas de timeout

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
  timerCircle.style.stroke = "#e0e0e0";

  timerNumber.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerNumber.textContent = timeLeft;

    const offset = circumference - (timeLeft / 30) * circumference;
    timerCircle.style.strokeDashoffset = offset;

    timerCircle.style.stroke = (timeLeft <= 10 ? "#f39c12" : "#3498db");

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

  if(bgMusic){ try{ bgMusic.pause(); bgMusic.currentTime = 0; } catch(e){} }
  if(victorySound) victorySound.play().catch(()=>{});

  try{
    confetti && confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
  }catch(e){}

  questionBox.textContent = `Quiz terminé ! Score final : ${score} / ${shuffledQuestions.length}`;
  answerGrid.innerHTML = "";
  explanationBox.style.display = "none";
  scoreBox.textContent = `Score final : ${score} / ${shuffledQuestions.length}`;

  if(typeof sendResults === "function"){
    const user = {
      nom: document.getElementById("nom").value.trim(),
      prenom: document.getElementById("prenom").value.trim()
    };

    sendResults(user, score, shuffledQuestions, playMathsPoints);
  }
}

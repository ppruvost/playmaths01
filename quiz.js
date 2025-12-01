// =============================
// VARIABLES GLOBALES
// =============================
let user = { nom: "", prenom: "" };
let current = 0;
let score = 0;
let shuffledQuestions = [];
let timerInterval;
let timeLeft = 30;

// =============================
// LANCEMENT DU QUIZ
// =============================
document.getElementById("startQuiz").addEventListener("click", () => {
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();

    if (!nom || !prenom) {
        alert("Merci d’entrer votre nom et prénom avant de commencer !");
        return;
    }

    user = { nom, prenom };
    document.getElementById("userForm").style.display = "none";

    startQuiz();
});

// =============================
// START QUIZ
// =============================
function startQuiz() {
    score = 0;
    current = 0;

    if (!questions || questions.length === 0) {
        alert("ERREUR : questions.js n’a pas chargé !");
        return;
    }

    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

    showQuestion();
}

// =============================
// AFFICHAGE QUESTION
// =============================
function showQuestion() {
    const q = shuffledQuestions[current];

    const colors = ["red", "blue", "yellow", "green"];

    const html = `
        <div class="question-box">${q.question}</div>

        <div class="answer-grid">
            ${q.options.map((opt, i) => `
                <div class="answer ${colors[i]}" onclick="selectAnswer(this)"
                     ${opt === q.bonne_reponse ? "data-correct='true'" : ""}>
                     ${opt}
                </div>
            `).join("")}
        </div>

        <button class="start-btn" onclick="validateAnswer()">Valider</button>
        <div id="explication"></div>
    `;

    document.getElementById("quiz").innerHTML = html;

    startTimer();
}

// =============================
// SÉLECTION
// =============================
function selectAnswer(elem) {
    document.querySelectorAll(".answer").forEach(a => a.classList.remove("selected"));
    elem.classList.add("selected");
}

// =============================
// VALIDATION
// =============================
function validateAnswer() {
    const selected = document.querySelector(".answer.selected");
    if (!selected) {
        alert("Sélectionne une réponse !");
        return;
    }

    clearInterval(timerInterval);

    const isCorrect = selected.hasAttribute("data-correct");

    if (isCorrect) {
        score++;
        selected.classList.add("answer-correct");
    } else {
        selected.classList.add("answer-wrong");
        document.querySelector("[data-correct]").classList.add("answer-correct-auto");
    }

    document.getElementById("explication").innerHTML =
        shuffledQuestions[current].explication || "";

    setTimeout(nextQuestion, 1500);
}

// =============================
// QUESTION SUIVANTE
// =============================
function nextQuestion() {
    current++;

    if (current >= shuffledQuestions.length) {
        endQuiz();
        return;
    }

    showQuestion();
}

// =============================
// FIN QUIZ
// =============================
function endQuiz() {
    document.getElementById("quiz").innerHTML = `
        <h2>Bravo ${user.prenom} ! 🎉</h2>
        <p>Score final : ${score}/${shuffledQuestions.length}</p>
    `;

    document.getElementById("victorySound").play();
}

// =============================
// TIMER SVG
// =============================
function startTimer() {
    timeLeft = 30;

    const circle = document.getElementById("timer-circle");
    const circumference = 2 * Math.PI * 35;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = "0";
    circle.style.stroke = "#3498db";
    circle.style.strokeWidth = "6";
    circle.style.fill = "none";

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer-text").textContent = timeLeft;

        const offset = circumference - (timeLeft / 30) * circumference;
        circle.style.strokeDashoffset = offset;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            validateAnswer();
        }
    }, 1000);
}

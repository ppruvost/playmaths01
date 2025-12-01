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

    user.nom = nom;
    user.prenom = prenom;

    document.getElementById("userForm").style.display = "none";

    startQuiz();
});

function startQuiz() {
    score = 0;
    current = 0;

    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

    showQuestion();
}

// =============================
// AFFICHER UNE QUESTION
// =============================
function showQuestion() {
    const question = shuffledQuestions[current];

    const colors = ["red", "blue", "yellow", "green"];

    const optionsHTML = question.options.map((option, index) => {
        const isCorrect = option === question.bonne_reponse ? "data-correct='true'" : "";
        const color = colors[index % 4];

        return `
            <div class="answer ${color}" onclick="selectAnswer(this)" ${isCorrect}>
                ${option}
            </div>
        `;
    }).join("");

    document.getElementById("quiz").innerHTML = `
        <div class="question-box">${question.question}</div>

        <div class="answer-grid">
            ${optionsHTML}
        </div>

        <button class="start-btn" onclick="validateAnswer()">Valider</button>
        <div id="explication"></div>
    `;

    startTimer();
}

// =============================
// SÉLECTION D’UNE RÉPONSE
// =============================
function selectAnswer(elem) {
    document.querySelectorAll(".answer").forEach(a => {
        a.classList.remove("selected");
    });
    elem.classList.add("selected");
}

// =============================
// VALIDATION DE RÉPONSE
// =============================
function validateAnswer() {
    const selected = document.querySelector(".answer.selected");

    if (!selected) {
        alert("Sélectionne une réponse !");
        return;
    }

    clearInterval(timerInterval);

    const isCorrect = selected.getAttribute("data-correct") === "true";

    if (isCorrect) {
        score++;
        selected.classList.add("answer-correct");
    } else {
        selected.classList.add("answer-wrong");
        document.querySelector("[data-correct='true']")
                .classList.add("answer-correct-auto");
    }

    document.getElementById("explication").innerHTML =
        shuffledQuestions[current].explication
            ? `<p>${shuffledQuestions[current].explication}</p>`
            : "";

    setTimeout(nextQuestion, 1800);
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
// FIN DU QUIZ
// =============================
function endQuiz() {
    document.getElementById("quiz").innerHTML = `
        <h2>Bravo ${user.prenom} 🎉</h2>
        <p>Score final : <strong>${score}/${shuffledQuestions.length}</strong></p>
    `;

    // Son de victoire
    const winSound = document.getElementById("victorySound");
    winSound.play();
}

// =============================
// TIMER SVG
// =============================
function startTimer() {
    timeLeft = 30;

    const circle = document.getElementById("timer-circle");
    circle.style.stroke = "#3498db";
    circle.style.strokeWidth = "6";
    circle.style.fill = "none";

    const circumference = 2 * Math.PI * 35;
    circle.style.strokeDasharray = circumference;

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

// =============================
// GESTION DE SESSION POUR RECOMMENCER LE QUIZ
// =============================
window.addEventListener("load", () => {
    const currentPage = window.location.pathname.split("/").pop(); // ex: index.html
    if (sessionStorage.getItem("quizStarted") && currentPage !== "index.html") {
        resetQuizSession();
    } else {
        sessionStorage.setItem("quizStarted", "true");
    }
});

function resetQuizSession() {
    sessionStorage.removeItem("quizStarted");
    sessionStorage.removeItem("currentQuestion");
    sessionStorage.removeItem("score");
    sessionStorage.removeItem("shuffledQuestions");

    if (window.location.pathname.split("/").pop() !== "index.html") {
        window.location.href = "index.html";
    }
}

// =============================
// SYSTEME ANTI-TRICHE RENFORCÉ
// =============================
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") resetQuizSession();
});

window.addEventListener("blur", resetQuizSession);

document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => {
    const blocked =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U");

    if (blocked) {
        e.preventDefault();
        resetQuizSession();
    }
});

// Plein écran
function goFullScreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
}

// =============================
// MUSIQUE DE FOND (STYLE KAHOOT)
// =============================
function startMusic() {
    const audio = document.getElementById("bgMusic");
    if (!audio) return;

    audio.volume = 0.4;
    audio.muted = false;
    audio.play().catch(() => {
        console.log("Lecture automatique impossible — action utilisateur requise !");
    });
}

function stopMusic() {
    const audio = document.getElementById("bgMusic");
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
}

// =============================
// TIMER ANIMÉ (CERCLE QUI SE VIDE)
// =============================
let timerInterval;
let timeLeft = 30;
const FULL_DASH = 220; // périmètre du cercle

function startTimer() {
    timeLeft = 30;
    updateTimerText(timeLeft);
    updateCircle(timeLeft);

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerText(timeLeft);
        updateCircle(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            autoValidateAndNext();
        }
    }, 1000);
}

function updateTimerText(value) {
    const timerText = document.getElementById("timer-text");
    if (timerText) {
        timerText.textContent = value;
    }
}

function updateCircle(secondsLeft) {
    const circle = document.getElementById("timer-circle");
    if (!circle) return;

    const ratio = secondsLeft / 30;
    const offset = FULL_DASH * (1 - ratio);
    circle.style.strokeDashoffset = offset;
}

function autoValidateAndNext() {
    const correctOption = document.querySelector("[data-correct='true']");
    if (correctOption) {
        correctOption.classList.add("answer-correct-auto");
    }

    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

// =============================
// VARIABLES GLOBALES
// =============================
let user = { nom: "", prenom: "" };
let current = 0;
let score = 0;
let shuffledQuestions = [];

const delayCorrect = 8000;
const delayWrong = 6000;

// =============================
// FONCTIONS UTILITAIRES
// =============================
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function shuffleQuestions() {
    return questions.map((q) => ({
        ...q,
        options: shuffleArray(q.options)
    }));
}

// =============================
// AFFICHAGE QUESTIONS
// =============================
function showQuestion() {
    const question = shuffledQuestions[current];

    // Nettoyer anciennes classes
    document.querySelectorAll(".option-container label").forEach(label => {
        label.classList.remove("answer-correct", "answer-wrong", "answer-selected", "answer-correct-auto");
    });

    const optionsHTML = question.options
        .map((option, index) => {
            const inputId = `q${current}_opt${index}`;
            const correctAttr = option === question.bonne_reponse ? "data-correct='true'" : "";

            return `
                <div class="option-container">
                    <input type="radio" id="${inputId}" name="q${current}" value="${option}">
                    <label ${correctAttr} for="${inputId}">${option}</label>
                </div>
            `;
        })
        .join("");

    document.getElementById("quiz").innerHTML = `
        <h2>${question.question}</h2>
        ${optionsHTML}
        <button class="validate" onclick="validateAnswer()">Valider</button>
        <div id="explication"></div>
    `;

    startTimer();
}

// Affichage preview première question
window.addEventListener("DOMContentLoaded", () => {
    const preview = document.getElementById("previewQuestion");
    if (preview && questions.length > 0) {
        preview.textContent = questions[0].question;
    }
});

// =============================
// VALIDATION REPONSE
// =============================
function highlightAnswer(inputElem, isCorrect) {
    const label = inputElem.nextElementSibling;
    label.classList.add(isCorrect ? "answer-correct" : "answer-wrong");
}

function validateAnswer() {
    const selected = document.querySelector(`input[name="q${current}"]:checked`);
    const explicationDiv = document.getElementById("explication");

    if (!selected) {
        explicationDiv.textContent = "Veuillez sélectionner une réponse.";
        return;
    }

    clearInterval(timerInterval);

    const q = shuffledQuestions[current];
    const userAnswer = selected.value;

    selected.nextElementSibling.classList.add("answer-selected");

    if (userAnswer === q.bonne_reponse) {
        score++;
        highlightAnswer(selected, true);

        explicationDiv.innerHTML = `<span class="success">Bonne réponse !</span> ${q.explication}`;

        setTimeout(nextQuestion, delayCorrect);
    } else {
        highlightAnswer(selected, false);

        explicationDiv.innerHTML = `<span class="fail">Mauvaise réponse.</span> ${q.explication}`;

        // Montrer la bonne réponse
        document.querySelectorAll(`input[name="q${current}"]`).forEach((input) => {
            if (input.value === q.bonne_reponse) {
                input.nextElementSibling.classList.add("answer-correct-auto");
            }
        });

        setTimeout(nextQuestion, delayWrong);
    }

    const scoreDiv = document.getElementById("score");
    if (scoreDiv) {
        scoreDiv.innerText = `Score actuel : ${score} / ${shuffledQuestions.length}`;
    }
}

// =============================
// NAVIGATION QUESTIONS
// =============================
function nextQuestion() {
    current++;
    if (current < shuffledQuestions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

// =============================
// FIN DU QUIZ
// =============================
function endQuiz() {
    document.getElementById("quiz").innerHTML = `
        <h2>Quiz terminé !</h2>
        <p>Score final : ${score} / ${shuffledQuestions.length}</p>
    `;
    stopMusic();
}

// =============================
// LANCEMENT QUIZ
// =============================
document.getElementById("startQuiz").addEventListener("click", () => {
    startMusic();

    const nomInput = document.getElementById("nom");
    const prenomInput = document.getElementById("prenom");
    const nom = nomInput.value.trim();
    const prenom = prenomInput.value.trim();

    if (!nom) return nomInput.focus();
    if (!prenom) return prenomInput.focus();

    user = { nom, prenom };
    shuffledQuestions = shuffleQuestions();
    current = 0;
    score = 0;

    document.getElementById("userForm").style.display = "none";
    document.getElementById("quiz").style.display = "block";

    showQuestion();
});

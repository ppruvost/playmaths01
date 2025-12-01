// =============================
// GESTION DE SESSION POUR RECOMMENCER LE QUIZ
// =============================

window.addEventListener("load", () => {
    if (sessionStorage.getItem("quizStarted")) {
        resetQuizSession();
    }
    sessionStorage.setItem("quizStarted", "true");
});

function resetQuizSession() {
    sessionStorage.removeItem("quizStarted");
    sessionStorage.removeItem("currentQuestion");
    sessionStorage.removeItem("score");
    sessionStorage.removeItem("shuffledQuestions");
    window.location.href = "index.html";
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
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "U");

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

/* ============================================================
============== MUSIQUE DE FOND (STYLE KAHOOT) =================
============================================================ */

function startMusic() {
    const audio = document.getElementById("bgMusic");
    audio.volume = 0.4;
    audio.muted = false;

    audio.play().catch(() => {
        console.log("Lecture automatique impossible — action utilisateur requise !");
    });
}

function stopMusic() {
    const audio = document.getElementById("bgMusic");
    audio.pause();
    audio.currentTime = 0;
}

/* ============================================
   TIMER ANIMÉ (CERCLE QUI SE VIDE)
============================================ */

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

    const ratio = (30 - secondsLeft) / 30;
    const offset = FULL_DASH * ratio;
    circle.style.strokeDashoffset = offset;
}

function autoValidateAndNext() {
    const correctOption = document.querySelector("[data-correct='true']");
    if (correctOption) {
        correctOption.classList.add("answer-correct-auto");
    }

    setTimeout(() => {
        nextQuestion(); // correction
    }, 1500);
}

/* ============================================================
============== VARIABLES GLOBALES ============================
============================================================ */

let user = { nom: "", prenom: "" };
let current = 0;
let score = 0;
let shuffledQuestions = [];

const delayCorrect = 8000;
const delayWrong = 6000;

/* ============================================================
============== FONCTIONS UTILITAIRES ==========================
============================================================ */

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

/* ============================================================
============== AFFICHAGE QUESTIONS ============================
============================================================ */

function showQuestion() {
    const question = shuffledQuestions[current];

    const optionsHTML = question.options
        .map((option, index) => {
            const inputId = `q${current}_opt${index}`;

            // marquer la bonne réponse pour auto highlight
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

    // 🔥 Lancement du timer à chaque nouvelle question
    startTimer();
}

/* ============================================================
============== VALIDATION REPONSE =============================
============================================================ */

function highlightAnswer(inputElem, isCorrect) {
    const label = inputElem.nextElementSibling;
    label.classList.add(isCorrect ? "answer-correct" : "answer-wrong");
}

function validateAnswer() {
    const selected = document.querySelector(`input[name="q${current}"]:checked`);

    if (!selected) {
        document.getElementById("explication").textContent =
            "Veuillez sélectionner une réponse.";
        return;
    }

    clearInterval(timerInterval); // stop timer si réponse humaine

    const q = shuffledQuestions[current];
    const userAnswer = selected.value;

    selected.nextElementSibling.classList.add("answer-selected");

    if (userAnswer === q.bonne_reponse) {
        score++;
        highlightAnswer(selected, true);

        document.getElementById("explication").innerHTML =
            `<span class="success">Bonne réponse !</span> ${q.explication}`;

        setTimeout(nextQuestion, delayCorrect);
    } else {
        highlightAnswer(selected, false);

        document.getElementById("explication").innerHTML =
            `<span class="fail">Mauvaise réponse.</span> ${q.explication}`;

        document
            .querySelectorAll(`input[name="q${current}"]`)
            .forEach((input) => {
                if (input.value === q.bonne_reponse) {
                    input.nextElementSibling.classList.add("answer-correct-auto");
                }
            });

        setTimeout(nextQuestion, delayWrong);
    }

    document.getElementById("score").innerText =
        `Score actuel : ${score} / ${shuffledQuestions.length}`;
}

/* ============================================================
============== NAVIGATION QUESTIONS ===========================
============================================================ */

function nextQuestion() {
    current++;
    if (current < shuffledQuestions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

/* ============================================================
============== FIN DU QUIZ ====================================
============================================================ */

function endQuiz() {
    document.getElementById("quiz").innerHTML = `
        <h2>Quiz terminé !</h2>
        <p>Score final : ${score} / ${shuffledQuestions.length}</p>
    `;

    stopMusic();
}

/* ============================================================
============== LANCEMENT QUIZ =================================
============================================================ */

document.getElementById("startQuiz").addEventListener("click", () => {
    startMusic();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();

    if (!nom || !prenom) {
        alert("Merci de renseigner votre nom et prénom avant de commencer.");
        return;
    }

    user = { nom, prenom };
    shuffledQuestions = shuffleQuestions();
    current = 0;
    score = 0;

    document.getElementById("userForm").style.display = "none";
    document.getElementById("quiz").style.display = "block";

    showQuestion();
});

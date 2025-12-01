// =============================
// GESTION DE SESSION POUR RECOMMENCER LE QUIZ
// =============================
window.addEventListener("load", () => {
    const currentPage = window.location.pathname.split("/").pop();
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
// SYSTEME ANTI-TRICHE
// =============================
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") resetQuizSession();
});
window.addEventListener("blur", resetQuizSession);
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
    const blocked =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I","J"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U");

    if (blocked) {
        e.preventDefault();
        resetQuizSession();
    }
});

// =============================
// MUSIQUE
// =============================
function startMusic() {
    const audio = document.getElementById("bgMusic");
    if (!audio) return;
    audio.volume = 0.4;
    audio.play().catch(()=>{});
}
function stopMusic() {
    const audio = document.getElementById("bgMusic");
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
}

// =============================
// TIMER
// =============================
let timerInterval;
let timeLeft = 30;
const FULL_DASH = 220;

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

function updateTimerText(v) {
    const t = document.getElementById("timer-text");
    if (t) t.textContent = v;
}
function updateCircle(sec) {
    const c = document.getElementById("timer-circle");
    if (!c) return;
    const ratio = sec / 30;
    c.style.strokeDashoffset = FULL_DASH * (1 - ratio);
}

function autoValidateAndNext() {
    const correct = document.querySelector(".answer[data-correct='true']");
    if (correct) correct.classList.add("answer-correct-auto");

    setTimeout(() => nextQuestion(), 1000);
}

// =============================
// VARIABLES
// =============================
let user = { nom:"", prenom:"" };
let current = 0;
let score = 0;
let shuffledQuestions = [];

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function shuffleQuestions() {
    return questions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
    }));
}

// =============================
// AFFICHE QUESTION STYLE KAHOOT
// =============================
function showQuestion() {
    const q = shuffledQuestions[current];

    document.getElementById("previewQuestion").textContent = q.question;

    const answersBox = document.getElementById("answers");
    answersBox.innerHTML = "";

    const colors = ["red","blue","yellow","green"];

    q.options.forEach((opt, i) => {
        const div = document.createElement("div");
        div.classList.add("answer", colors[i]);
        div.textContent = opt;

        if (opt === q.bonne_reponse) {
            div.dataset.correct = "true";
        }

        div.addEventListener("click", () => validateAnswer(opt));

        answersBox.appendChild(div);
    });

    startTimer();
}

// =============================
// VALIDATION STYLE KAHOOT
// =============================
function validateAnswer(selectedOption) {
    clearInterval(timerInterval);

    const q = shuffledQuestions[current];

    const answers = document.querySelectorAll(".answer");

    answers.forEach(a => a.style.filter = "brightness(0.5)");

    answers.forEach(a => {
        if (a.textContent === q.bonne_reponse) {
            a.classList.add("answer-correct");
            a.style.filter = "brightness(1.3)";
        }
    });

    if (selectedOption === q.bonne_reponse) {
        score++;
    } else {
        answers.forEach(a => {
            if (a.textContent === selectedOption) {
                a.classList.add("answer-wrong");
            }
        });
    }

    setTimeout(nextQuestion, 1200);

    document.getElementById("score").textContent =
        `Score : ${score} / ${shuffledQuestions.length}`;
}

// =============================
// QUESTION SUIVANTE
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
// FIN
// =============================
function endQuiz() {
    stopMusic();

    document.getElementById("previewQuestion").textContent = "Quiz terminé ! 🎉";
    document.getElementById("answers").innerHTML = "";
    document.getElementById("score").textContent =
        `Score final : ${score} / ${shuffledQuestions.length}`;

    document.getElementById("victorySound").play();
}

// =============================
// DEMARRAGE QUIZ
// =============================
document.getElementById("startQuiz").addEventListener("click", () => {
    startMusic();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();

    if (!nom || !prenom) return;

    user = { nom, prenom };
    shuffledQuestions = shuffleQuestions();
    current = 0;
    score = 0;

    document.getElementById("userForm").style.display = "none";

    showQuestion();
});

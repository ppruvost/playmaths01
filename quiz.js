let current = 0;
let score = 0;
let timerInterval;

const questionBox = document.getElementById("questionBox");
const answerGrid = document.getElementById("answerGrid");
const explanationBox = document.getElementById("explanationBox"); // ajouter dans HTML
const timerNumber = document.getElementById("timerNumber");

// =============== Chargement question ===============
function loadQuestion() {
    const q = questions[current];

    questionBox.textContent = `${current + 1}. ${q.question}`;
    explanationBox.style.display = "none"; // cacher explication
    answerGrid.innerHTML = "";

    q.options.forEach(option => {
        const div = document.createElement("div");
        div.classList.add("answer");

        // couleurs fixes pour cohérence
        const colors = ["red", "blue", "yellow", "green"];
        const color = colors[answerGrid.children.length];
        div.classList.add(color);

        div.innerHTML = `
            <span class="shape"></span>
            <span>${option}</span>
        `;

        div.addEventListener("click", () => handleAnswer(option, div));
        answerGrid.appendChild(div);
    });

    startTimer();
}

// =============== Gestion de réponse ===============
function handleAnswer(option, selectedDiv) {
    const correct = questions[current].bonne_reponse;

    stopTimer();

    // Désactiver clics
    document.querySelectorAll(".answer").forEach(btn => {
        btn.style.pointerEvents = "none";
    });

    // Vérifier bonne/mauvaise réponse
    if (option === correct) {
        selectedDiv.style.backgroundColor = "#2FA344"; // vert
        score++;
    } else {
        selectedDiv.style.backgroundColor = "#D92D2D"; // rouge

        // Mettre en vert la bonne option
        document.querySelectorAll(".answer").forEach(btn => {
            if (btn.innerText.trim() === correct.trim()) {
                btn.style.backgroundColor = "#2FA344";
            }
        });
    }

    // AFFICHAGE EXPLICATION
    explanationBox.innerHTML = `<strong>Explication :</strong> ${questions[current].explication}`;
    explanationBox.style.display = "block";

    // Attente 9 secondes avant la prochaine question
    setTimeout(() => {
        current++;
        if (current < questions.length) {
            loadQuestion();
        } else {
            endQuiz();
        }
    }, 9000);
}

// =============== Timer circulaire ou numérique ===============
function startTimer() {
    let timeLeft = 30;
    timerNumber.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerNumber.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            forceTimeout();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function forceTimeout() {
    handleAnswer("Aucune réponse", null); // fausse réponse
}

// =============== Fin du quiz ===============
function endQuiz() {
    questionBox.textContent = `Quiz terminé ! Score : ${score}/${questions.length}`;
    answerGrid.innerHTML = "";
    explanationBox.style.display = "none";
}

// -----------------------------
// DONNÉES DES 3 EXERCICES
// -----------------------------
const exercices = {
  1: {
    x: [-5, -3, -1, 0, 1, 3, 5, 7],
    f: [ 2, -1, -3, 2, 3, 5, 2, -1 ]
  },
  2: {
    x: [-4, -2, -1, 0, 1, 4],
    f: [16,  4,  1, 0, 1, 16]
  },
  3: {
    x: [-10, -5, -4, -2, 0, 1, 2, 3],
    f: [   0,  8,  2,  1, -2, 0, 8, 10]
  }
};

// Couleurs + formes assignées comme Kahoot
const kahootStyles = [
  { color: "k-red",    shape: "triangle" },
  { color: "k-blue",   shape: "square" },
  { color: "k-green",  shape: "diamond" },
  { color: "k-yellow", shape: "circle" }
];

// -----------------------------
// RÉFÉRENCES DOM
// -----------------------------
const rowX = document.getElementById("row-x");
const rowF = document.getElementById("row-f");
const message = document.getElementById("message");
const explanation = document.getElementById("explanation");
const select = document.getElementById("select-ex");

// -----------------------------
// CHARGEMENT D'UN EXERCICE
// -----------------------------
function loadExercise(num) {
  const ex = exercices[num];

  rowX.innerHTML = "<th>x</th>";
  rowF.innerHTML = "<th>f(x)</th>";

  message.textContent = "";
  explanation.textContent = "";

  for (let i = 0; i < ex.x.length; i++) {
    const styleX = kahootStyles[i % 4];
    const styleF = kahootStyles[(i + 1) % 4];

    rowX.innerHTML += `
      <td class="${styleX.color} cell-x" data-index="${i}">
        <div class="shape ${styleX.shape}"></div>
        ${ex.x[i]}
      </td>`;

    rowF.innerHTML += `
      <td class="${styleF.color} cell-f" data-index="${i}">
        <div class="shape ${styleF.shape}"></div>
        ${ex.f[i]}
      </td>`;
  }

  activateClicks(ex);
}

// -----------------------------
// ACTIVATION DES CLICS
// -----------------------------
function activateClicks(ex) {

  document.querySelectorAll(".cell-x").forEach(cell => {
    cell.onclick = () => {
      clearSelection();

      const i = cell.dataset.index;
      cell.classList.add("selected");

      const x = ex.x[i];
      const fx = ex.f[i];

      message.textContent = `✔️ L’image de ${x} est f(${x}) = ${fx}`;
      explanation.textContent =
        `Pour trouver l’image, on lit la valeur juste en dessous dans la ligne f(x).`;
    };
  });

  document.querySelectorAll(".cell-f").forEach(cell => {
    cell.onclick = () => {
      clearSelection();

      const i = cell.dataset.index;
      cell.classList.add("selected");

      const value = ex.f[i];

      const ant = [];
      for (let j = 0; j < ex.f.length; j++) {
        if (ex.f[j] === value) ant.push(ex.x[j]);
      }

      message.textContent =
        `✔️ Les antécédents de ${value} sont : ${ant.join(", ")}`;

      explanation.textContent =
        `Un antécédent est un x qui possède cette image. 
         On repère toutes les cases f(x) = ${value}, puis on lit les x correspondants.`;
    };
  });
}

// -----------------------------
function clearSelection() {
  document.querySelectorAll("td").forEach(td =>
    td.classList.remove("selected")
  );
}

// -----------------------------
loadExercise(1);
select.onchange = () => loadExercise(select.value);

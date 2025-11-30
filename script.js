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
    rowX.innerHTML += `<td class="cell-x" data-index="${i}">${ex.x[i]}</td>`;
    rowF.innerHTML += `<td class="cell-f" data-index="${i}">${ex.f[i]}</td>`;
  }

  activateClicks(ex);
}

// -----------------------------
// CLIC SUR LES CASES
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
        `L’image correspond à la valeur située dans la ligne f(x), directement sous le x choisi.`;
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
        `Un antécédent est une valeur de x dont l’image est ${value}. `
        + `On repère dans la ligne f(x) toutes les cases qui valent ${value}, `
        + `puis on lit les x correspondants au-dessus.`;
    };
  });
}

// -----------------------------
// EFFACER SÉLECTION
// -----------------------------
function clearSelection() {
  document.querySelectorAll("td").forEach(td =>
    td.classList.remove("selected")
  );
}

// -----------------------------
// CHARGEMENT INITIAL
// -----------------------------
loadExercise(1);

// Changement d’exercice
select.onchange = () => loadExercise(select.value);

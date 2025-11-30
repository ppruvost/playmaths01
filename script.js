// Table tiré du PDF (Exercice 1)
const xValues = [-5, -3, -1, 0, 1, 3, 5, 7];
const fValues = [ 2, -1, -3, 2, 3, 5, 2,-1];

// Remplissage dynamique du tableau
const rowX = document.getElementById("row-x");
const rowF = document.getElementById("row-f");

rowX.innerHTML = "<th>x</th>";
rowF.innerHTML = "<th>f(x)</th>";

for (let i = 0; i < xValues.length; i++) {
  rowX.innerHTML += `<td class="cell-x" data-index="${i}">${xValues[i]}</td>`;
  rowF.innerHTML += `<td class="cell-f" data-index="${i}">${fValues[i]}</td>`;
}

const message = document.getElementById("message");

// Gestion des clics
function clearSelection() {
  document.querySelectorAll("td").forEach(td => td.classList.remove("selected"));
}

document.querySelectorAll(".cell-x").forEach(cell => {
  cell.addEventListener("click", () => {
    clearSelection();

    const i = cell.dataset.index;
    cell.classList.add("selected");

    const x = xValues[i];
    const fx = fValues[i];

    message.textContent = `✔️ L’image de ${x} est f(${x}) = ${fx}`;
  });
});

document.querySelectorAll(".cell-f").forEach(cell => {
  cell.addEventListener("click", () => {
    clearSelection();

    const i = cell.dataset.index;
    cell.classList.add("selected");

    const value = fValues[i];

    // Recherche des antécédents
    const antecedents = [];
    for (let j = 0; j < fValues.length; j++) {
      if (fValues[j] === value) antecedents.push(xValues[j]);
    }

    message.textContent =
      `✔️ Les antécédents de ${value} sont : ${antecedents.join(", ")}`;
  });
});

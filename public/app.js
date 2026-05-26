async function obtenerPersonajes() {
  try {
    const response = await fetch("/api/characters");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener personajes:", error);
    return [];
  }
}

function crearCard(p) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h3>${p.name}</h3>
    <p><strong>Raza:</strong> ${p.race}</p>
    <p><strong>Rol:</strong> ${p.role}</p>
    <p><strong>Nivel:</strong> ${p.level}</p>
    <p><strong>Universo:</strong> ${p.universe}</p>
  `;
  return card;
}

function renderizarPersonajes(personajes) {
  const container = document.getElementById("characters-container");
  const loading = document.getElementById("loading");

  loading.style.display = "none";

  personajes.forEach((p) => container.appendChild(crearCard(p)));
}

async function crearPersonaje(personaje) {
  const response = await fetch("/api/characters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(personaje),
  });
  return response.json();
}

document
  .getElementById("character-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    data.level = Number(data.level);

    const nuevo = await crearPersonaje(data);
    document.getElementById("characters-container").prepend(crearCard(nuevo));
    form.reset();
  });

(async () => {
  const personajes = await obtenerPersonajes();
  renderizarPersonajes(personajes);
})();

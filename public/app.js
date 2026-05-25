async function obtenerPersonajes() {
  try {
    const response = await fetch("/data/characters");
    const data = await response.json();
    console.log("¡Personajes recibidos con éxito!", data);
    return data;
  } catch (error) {
    console.error("Error al obtener personajes:", error);
    return [];
  }
}

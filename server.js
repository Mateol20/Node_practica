let http = require("http");
const host = "localhost";
const port = 3000;
const fs = require("fs");
const path = require("path");
const characters = require("./data/characters");

const status = {
  status: "ok",
};
http
  .createServer((req, res) => {
    const { url, method } = req;
    // -------------------------------------------------------------
    // 1. RUTAS DE LA API
    // -------------------------------------------------------------
    if (method === "GET" && url === "/api/characters") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(characters));
    } else if (method === "GET" && url === "/api/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(status));
    } else if (method === "POST" && url === "/api/characters") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const newCharacter = JSON.parse(body);
          if (
            newCharacter.name &&
            newCharacter.race &&
            newCharacter.role &&
            newCharacter.level &&
            newCharacter.universe
          ) {
            newCharacter.id = (characters.length + 1).toString();
            characters.push(newCharacter);
            res.writeHead(201, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(newCharacter));
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "Faltan campos obligatorios" }),
            );
          }
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "JSON inválido" }));
        }
      });
    }
    // -------------------------------------------------------------
    // 2. MANEJADOR DINÁMICO DE ARCHIVOS ESTÁTICOS
    // -------------------------------------------------------------
    else if (method === "GET") {
      // Si la URL es "/" se sirve el index.html, sino se intenta servir el archivo solicitado
      const targetFile = url === "/" ? "index.html" : url;
      const filePath = path.join(__dirname, "public", targetFile);
      const ext = path.extname(filePath);
      // Diccionario para definir el Content-Type correcto según el archivo
      const contentTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
      };
      const contentType = contentTypes[ext] || "text/plain";

      // Intentamos leer el archivo usando Streams
      const streams = fs.createReadStream(filePath);

      streams.on("open", () => {
        // Si el archivo existe y se pudo abrir, mandamos las cabeceras correctas
        res.writeHead(200, { "Content-Type": contentType });
        streams.pipe(res);
      });

      streams.on("error", () => {
        // Si el archivo no existe en la carpeta public (ej: escribieron mal la URL), da 404
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "Archivo o ruta estática no encontrada" }),
        );
      });
    }

    // -------------------------------------------------------------
    // 3. CUALQUIER OTRO MÉTODO (POST, PUT, DELETE no programados)
    // -------------------------------------------------------------
    else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Método o Ruta no permitida" }));
    }
  })
  .listen(port, host);
console.log(`Server running at http://${host}:${port}/`);

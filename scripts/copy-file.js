const fs = require("fs");

const source = process.argv[2];
const destination = process.argv[3];

if (!source || !destination) {
  console.error("Uso: node scripts/copy-file.js <origen> <destino>");
  process.exit(1);
}

const start = Date.now();

const readStream = fs.createReadStream(source);
const writeStream = fs.createWriteStream(destination);

readStream.pipe(writeStream);

readStream.on("error", (err) => {
  console.error(`Error al leer el archivo origen: ${err.message}`);
  process.exit(1);
});

writeStream.on("error", (err) => {
  console.error(`Error al escribir el archivo destino: ${err.message}`);
  process.exit(1);
});

writeStream.on("finish", () => {
  const elapsed = Date.now() - start;
  console.log(`Archivo copiado de "${source}" a "${destination}" (${elapsed}ms)`);
});

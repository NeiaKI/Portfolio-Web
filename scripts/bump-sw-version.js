const fs = require("fs");
const path = require("path");

const swPath = path.join(__dirname, "../public/sw.js");
const version = `nateeki-${Date.now()}`;
const sw = fs.readFileSync(swPath, "utf8");
fs.writeFileSync(swPath, sw.replace(/const CACHE = '[^']+';/, `const CACHE = '${version}';`));
console.log(`[sw] cache version → ${version}`);

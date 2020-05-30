// Because broccoli is limited as fuck we need to handle this assets copying separatelly
// This script must be run at the end of the CI pipeline, or it will fail
const fs = require("fs");
const path = require("path");
const manifest = require("./_dist/manifest.json");
const { execSync } = require("child_process");
const { log } = require("util");
const distFolder = path.join(__dirname, "dist");
const editionsFolder = path.join(__dirname, "editions");
const targets = fs
  .readdirSync(editionsFolder)
  .filter(file => !file.startsWith('.') && file !== 'base')
  .filter((file) => {
    const filePath = path.join(editionsFolder, file);
    log(filePath);
    return fs.statSync(filePath).isDirectory;
  })
  .map((name) => path.join(distFolder, name));


targets.forEach((target) => {
  const url = `/${path.basename(target)}`;
  // copy each file of the edition
  log("meta files for", url);
  fs.writeFileSync(
    path.join(target, "manifest.json"),
    JSON.stringify({ ...manifest, start_url: url, scope: url }, null, 2),
    "utf8"
  );
  execSync(`cp _dist/sw.js ${target}`);
});

  // Copy the rest of the files for the main site
  // including manifest and service-worker
  execSync(`cp _dist/* dist/`);
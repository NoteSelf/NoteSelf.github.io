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
  // exclude hidden files and the editions that do not have a subfolder
  .filter((file) => !file.startsWith(".") && !/base|offline/.test(file))
  .filter((file) => {
    const filePath = path.join(editionsFolder, file);
    log(filePath);
    return fs.statSync(filePath).isDirectory;
  })
  .map((name) => path.join(distFolder, name));

/**
 * For each edition, copy a manifest file to it's dest directory.
 * This should (I'm not sure) allow them to operate as separate applications
 */
const copyManifests = () => {
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
};

/*
 Service worker stuff
 */
const workboxBuild = require("workbox-build");

// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  return workboxBuild.generateSW({
    globDirectory: "dist",
    globPatterns: ["**/*.{html,json,js,css}"],
    globIgnores: ["offline.html"],
    maximumFileSizeToCacheInBytes: 3000000,
    swDest: "dist/sw.js",
    // Define runtime caching rules.
    runtimeCaching: [
      {
        // Match any image request
        urlPattern: /\.(?:png|jpg|jpeg|svg|ico|gif)$/,

        // Apply a cache-first strategy.
        handler: "CacheFirst",

        options: {
          // Use a custom cache name.
          cacheName: "images",

          // Only cache 10 images.
          expiration: {
            maxEntries: 10,
          },
        },
      },
    ],
  });
};
/**
 * EXECUTE THE TASKS
 */

copyManifests();
// Copy the rest of the files for the main site
// including manifest and service-worker
execSync(`cp -pr _dist/* dist/`);
buildSW().then(console.log);

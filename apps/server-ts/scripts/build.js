#!/usr/bin/env node
const { execSync } = require("child_process");

function run(cmd) {
  console.log("> " + cmd);
  execSync(cmd, { stdio: "inherit", shell: true });
}

try {
  console.log("Starting app build...");
  run("rm -rf dist && mkdir -p dist");
  run("yarn prettier src/** --write --log-level silent");
  run("yarn eslint src/** --fix");
  console.log("Prebuild scripts completed.");

  console.log("Starting webpack build...");
  run("yarn webpack --config configs/webpack.prod.cjs");
  console.log("Webpack build completed.");

  console.log("Starting postbuild steps...");
  run("mkdir -p dist/www");
  run("mv dist/*.js dist/www && mv dist/*.txt dist/www");
  run("cp package.app.json dist/package.json");
  console.log("Postbuild steps completed.");

  console.log("Build finished successfully!");
} catch (err) {
  console.error("\nBuild failed:");
  console.error(err && err.message ? err.message : err);
  process.exit(1);
}

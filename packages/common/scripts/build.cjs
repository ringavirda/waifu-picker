#!/usr/bin/env node
const { execSync } = require("child_process");

function run(cmd) {
  console.log("> " + cmd);
  execSync(cmd, { stdio: "inherit", shell: true });
}

try {
  console.log("Starting package build...");
  run("yarn clear");
  run("yarn format");
  run("yarn lint");
  console.log("Prebuild scripts completed.");

  console.log("Building TypeScript outputs...");
  run("tsc -p ./configs/tsconfig.cjs.json");
  console.log("Completed building CJS output.");
  run("tsc -p ./configs/tsconfig.esm.json");
  console.log("Completed building ESM output.");
  run("tsc -p ./configs/tsconfig.types.json");
  console.log("Completed building types output.");
  console.log("TypeScript build completed.");

  console.log("Starting postbuild steps...");
  run("yarn cpy README.md dist/");
  run("yarn cpy package.lib.json dist/ --rename package.json");
  console.log("Postbuild steps completed.");

  console.log("Build finished successfully!");
} catch (err) {
  console.error("\nBuild failed:");
  console.error(err && err.message ? err.message : err);
  process.exit(1);
}

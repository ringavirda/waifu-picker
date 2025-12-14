#!/usr/bin/env node
const { execSync } = require("child_process");

function run(cmd) {
  console.log("> " + cmd);
  execSync(cmd, { stdio: "inherit", shell: true });
}

try {
  console.log("Starting full app build...");

  run("rm -rf dist/wp-plain && mkdir -p dist/wp-plain");

  console.log("Building common package...");
  execSync("yarn workspace @wp/common run build", { stdio: "inherit" });
  console.log("Common package build completed.");

  console.log("Building server package...");
  execSync("yarn workspace @wp/server-ts run build:full", { stdio: "inherit" });
  console.log("Server package build completed.");

  console.log("Building client plain app...");
  execSync(`yarn workspace @wp/client-plain run build:full`, {
    stdio: "inherit",
    shell: true,
  });
  console.log("Client plain app build completed.");

  console.log("Scaffolding final application...");
  run("mkdir -p dist/wp-plain");
  run("cp -r apps/server-ts/dist/* dist/wp-plain/");
  run("mkdir -p dist/wp-plain/www/public");
  run("cp -r apps/client-plain/dist/* dist/wp-plain/www/public/");
  console.log("Final application composed successfully.");

  console.log("Composing Docker image...");
  run("cp scripts/Dockerfile.waifu dist/wp-plain/Dockerfile");
  process.chdir("dist/wp-plain");
  run("docker buildx build --platform=linux/arm64 -t wp-plain:arm64 .");
  console.log("Docker image composed successfully.");

  console.log("Saving image to tarball...");
  run("mkdir -p ../artifacts");
  run("docker save wp-plain:arm64 -o ../artifacts/wp-plain-arm64.tar");
  console.log("Image saved to tarball successfully.");

  console.log("Full build finished successfully!");
} catch (err) {
  console.error("\nBuild failed:");
  console.error(err && err.message ? err.message : err);
  process.exit(1);
}

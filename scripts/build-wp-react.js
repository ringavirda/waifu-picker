#!/usr/bin/env node
const { execSync } = require("child_process");

function run(cmd) {
  console.log("> " + cmd);
  execSync(cmd, { stdio: "inherit", shell: true });
}

try {
  console.log("Starting full app build...");

  run("rm -rf dist/wp-react && mkdir -p dist/wp-react");

  console.log("Building common package...");
  execSync("yarn workspace @wp/common run build", { stdio: "inherit" });
  console.log("Common package build completed.");

  console.log("Building server package...");
  execSync("yarn workspace @wp/server-ts run build:full", { stdio: "inherit" });
  console.log("Server package build completed.");

  console.log("Building client react app...");
  execSync(`yarn workspace @wp/client-react run build:full`, {
    stdio: "inherit",
    shell: true,
  });
  console.log("Client react app build completed.");

  console.log("Scaffolding final application...");
  run("mkdir -p dist/wp-react");
  run("cp -r apps/server-ts/dist/* dist/wp-react/");
  run("mkdir -p dist/wp-react/www/public");
  run("cp -r apps/client-react/dist/* dist/wp-react/www/public/");
  console.log("Final application composed successfully.");

  console.log("Composing Docker image...");
  run("cp scripts/Dockerfile.waifu-new dist/wp-react/Dockerfile");
  process.chdir("dist/wp-react");
  run("docker buildx build --platform=linux/arm64 -t wp-react:arm64 .");
  console.log("Docker image composed successfully.");

  console.log("Saving image to tarball...");
  run("mkdir -p ../artifacts");
  run("docker save wp-react:arm64 -o ../artifacts/wp-react-arm64.tar");
  console.log("Image saved to tarball successfully.");

  console.log("Full build finished successfully!");
} catch (err) {
  console.error("\nBuild failed:");
  console.error(err && err.message ? err.message : err);
  process.exit(1);
}

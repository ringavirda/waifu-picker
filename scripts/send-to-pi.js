#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");

function run(cmd) {
  console.log("> " + cmd);
  execSync(cmd, { stdio: "inherit", shell: true });
}

try {
  console.log("Sending build artifacts to Raspberry Pi...");
  const piUser = "fallen";
  const piHost = "origin.felled-stars.org";
  const piPort = 2200;
  const piPath = "/home/fallen/images";

  const artifactPlain = "dist/artifacts/wp-plain-arm64.tar";
  if (fs.existsSync(artifactPlain)) {
    console.log("Sending wp-plain-arm64.tar...");
    run(
      `scp -P ${piPort} dist/artifacts/wp-plain-arm64.tar ${piUser}@${piHost}:${piPath}/wp-plain-arm64.tar`,
    );
    console.log("wp-plain-arm64.tar sent successfully.");
  } else console.error(`Artifact not found: ${artifactPlain}`);

  const artifactReact = "dist/artifacts/wp-react-arm64.tar";
  if (fs.existsSync(artifactReact)) {
    console.log("Sending wp-react-arm64.tar...");
    run(
      `scp -P ${piPort} dist/artifacts/wp-react-arm64.tar ${piUser}@${piHost}:${piPath}/wp-react-arm64.tar`,
    );
    console.log("wp-react-arm64.tar sent successfully.");
  } else console.error(`Artifact not found: ${artifactReact}`);

  console.log("Build artifacts sent successfully!");
} catch (err) {
  console.error("\nBuild failed:");
  console.error(err && err.message ? err.message : err);
  process.exit(1);
}

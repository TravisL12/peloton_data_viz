#!/usr/bin/env node
const { execSync } = require("child_process");

function main(command) {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (e) {
    console.error("Failed", e);
    return false;
  }

  return true;
}

const directoryName = process.argv[2];
const cloneCommand = `
  git clone --depth 1 git@github.com:TravisL12/webpack_boilerplate.git ${directoryName} &&
  cd ${directoryName} &&
  rm -rf .git && git init
`;
const installed = main(cloneCommand);
if (!installed) process.exit();

console.log(`Installing dependencies for ${directoryName}`);
const installCommand = `cd ${directoryName} && yarn`;
const installedDeps = main(installCommand);
if (!installedDeps) process.exit();

console.log("Installed!");
console.log(`cd ${directoryName} && yarn start`);

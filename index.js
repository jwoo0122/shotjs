import { promises as fs } from "fs";
import { promisify } from "util";
import { exec } from "child_process";
import { isBuiltin } from "module";

const execPromise = promisify(exec);

const fileName = process.argv.slice()[2];
const file = await fs.readFile(fileName);
const fileContent = file.toString();

const tempDir = await fs.mkdtemp("shot-");

const importStatements = fileContent
  .split("\n")
  .filter((line) => line.startsWith("import"))
  .map((line) => line.split(" ").at(-1).replace('"', "").replace('";', ""))
  .filter((name) => isBuiltin(name) === false);

console.log("Shot.js running... hold on.");

await fs.writeFile(`${tempDir}/index.mjs`, fileContent);
await fs.writeFile(
  `${tempDir}/package.json`,
  JSON.stringify({
    name: "shot",
    dependencies: importStatements.reduce(
      (acc, name) => ({ ...acc, [name]: "latest" }),
      {}
    ),
  })
);

await execPromise(`npm install`, { cwd: tempDir });
const runResult = await execPromise(`node index.mjs`, { cwd: tempDir });

console.log(`=== FROM ${fileName} ===`);

if (runResult.stderr) {
  console.error(runResult.stderr);
} else {
  console.log(runResult.stdout);
}

console.log("=== END ===");

await fs.rm(tempDir, { recursive: true, force: true });

console.log("Cleaned up.");

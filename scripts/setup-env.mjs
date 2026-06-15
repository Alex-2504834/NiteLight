import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const files = [
  {
    from: "config/public/app.env",
    to: ".env",
  },
  {
    from: "config/public/google-services.json",
    to: "android/app/google-services.json",
  },
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyRequiredFile({ from, to }) {
  const sourcePath = path.join(rootDir, from);
  const targetPath = path.join(rootDir, to);

  if (!(await exists(sourcePath))) {
    throw new Error(`Missing required source file: ${from}`);
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.copyFile(sourcePath, targetPath);

  console.log(`Created ${to}`);
}

async function main() {
  console.log("Setting up local environment files...");

  for (const file of files) {
    await copyRequiredFile(file);
  }

  console.log("Done. You can now run: npm run android");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

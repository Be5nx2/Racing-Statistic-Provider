/**
 * Example CLI script – run with:
 *   npm run cli-tools -- cli-tools/example.ts
 *
 * Add your own scripts in this folder and run them the same way.
 */

async function main(): Promise<void> {
  console.log("CLI tools – example script");
  console.log("Args:", process.argv.slice(2));
  // Example: import from server when needed
  // import { something } from "../src/some-module";
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

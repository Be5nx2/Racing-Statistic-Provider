import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

export function assertDirectoryExists(directory: string): void {
  if (!existsSync(directory)) {
    throw new Error(`Directory ${directory} does not exist`);
  }
}

export function listFiles(directory: string): string[] {
  assertDirectoryExists(directory);
  return readdirSync(directory).filter((file) => statSync(join(directory, file)).isFile());
}
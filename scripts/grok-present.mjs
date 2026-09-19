import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function grokSkillsPresent(root = PROJECT_ROOT) {
  return existsSync(join(root, ".grok/skills/og/SKILL.md"));
}

export function grokAppEnvPresent(root = PROJECT_ROOT) {
  return existsSync(join(root, ".grok/app-env.json"));
}

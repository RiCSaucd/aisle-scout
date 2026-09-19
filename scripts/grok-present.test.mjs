import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { grokAppEnvPresent, grokSkillsPresent } from "./grok-present.mjs";

test("grokSkillsPresent is false when the og skill is missing", () => {
  const root = mkdtempSync(join(tmpdir(), "no-grok-skill-"));
  assert.equal(grokSkillsPresent(root), false);
});

test("grokSkillsPresent is true when SKILL.md is on disk", () => {
  const root = mkdtempSync(join(tmpdir(), "has-grok-skill-"));
  mkdirSync(join(root, ".grok/skills/og"), { recursive: true });
  writeFileSync(join(root, ".grok/skills/og/SKILL.md"), "# og");
  assert.equal(grokSkillsPresent(root), true);
});

test("grokAppEnvPresent is false when app-env.json is missing", () => {
  const root = mkdtempSync(join(tmpdir(), "no-app-env-"));
  assert.equal(grokAppEnvPresent(root), false);
});

test("grokAppEnvPresent is true when app-env.json is on disk", () => {
  const root = mkdtempSync(join(tmpdir(), "has-app-env-"));
  mkdirSync(join(root, ".grok"), { recursive: true });
  writeFileSync(join(root, ".grok/app-env.json"), "{}");
  assert.equal(grokAppEnvPresent(root), true);
});

import { cpSync, existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DIST_DIR = resolve(process.cwd(), "dist");
const INDEX_HTML = resolve(DIST_DIR, "index.html");
const NOT_FOUND_HTML = resolve(DIST_DIR, "404.html");
const CNAME_FILE = resolve(DIST_DIR, "CNAME");
const NO_JEKYLL_FILE = resolve(DIST_DIR, ".nojekyll");
const DOMAIN = "painel.tableforge.com.br";

if (!existsSync(DIST_DIR)) {
  throw new Error("Build output not found. Run npm run build first.");
}

cpSync(INDEX_HTML, NOT_FOUND_HTML);
writeFileSync(CNAME_FILE, `${DOMAIN}\n`, "utf-8");
writeFileSync(NO_JEKYLL_FILE, "", "utf-8");

console.log("GitHub Pages artifacts prepared:");
console.log("- 404.html copied from index.html (SPA fallback)");
console.log(`- CNAME set to ${DOMAIN}`);
console.log("- .nojekyll created");

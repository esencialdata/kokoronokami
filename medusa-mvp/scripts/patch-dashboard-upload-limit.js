const fs = require("fs")
const path = require("path")

const dashboardDist = path.join(
  process.cwd(),
  "node_modules",
  "@medusajs",
  "dashboard",
  "dist"
)

const filesToPatch = [
  "app.js",
  "chunk-BYOPZAGX.mjs",
  "chunk-DODQ3KJT.mjs",
]

const replacements = [
  {
    from: /DEFAULT_MAX_FILE_SIZE\s*=\s*1024\s*\*\s*1024/g,
    to: "DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024",
  },
  {
    from: /size:\s*"1MB"/g,
    to: 'size: "10MB"',
  },
]

let patchedAny = false

for (const relativeFile of filesToPatch) {
  const fullPath = path.join(dashboardDist, relativeFile)

  if (!fs.existsSync(fullPath)) {
    continue
  }

  let content = fs.readFileSync(fullPath, "utf8")
  const original = content

  for (const r of replacements) {
    content = content.replace(r.from, r.to)
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, "utf8")
    patchedAny = true
    console.log(`[patch-dashboard] patched ${relativeFile}`)
  }
}

if (!patchedAny) {
  console.log("[patch-dashboard] no changes needed")
}

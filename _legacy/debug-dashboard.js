
const fs = require('fs');
const path = "/Users/aaronespinosa/Proyectos WIP/Origami/medusa-mvp/node_modules/@medusajs/dashboard/dist/chunk-JXJ7ZKKY.mjs";

try {
    const data = fs.readFileSync(path, 'utf8');
    const index = data.indexOf("fileTooLarge");
    if (index !== -1) {
        // Print 500 chars before and 200 after
        console.log(data.substring(Math.max(0, index - 500), index + 200));
    } else {
        console.log("String not found");
    }
} catch (e) {
    console.error(e);
}

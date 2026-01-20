
const fs = require('fs');
const path = "/Users/aaronespinosa/Proyectos WIP/Origami/medusa-mvp/node_modules/@medusajs/dashboard/dist/chunk-JXJ7ZKKY.mjs";

try {
    const data = fs.readFileSync(path, 'utf8');
    // Find all occurrences of maxSize
    let pos = 0;
    while (true) {
        const index = data.indexOf("maxSize", pos);
        if (index === -1) break;

        console.log(`--- Match at ${index} ---`);
        console.log(data.substring(Math.max(0, index - 50), index + 50));
        pos = index + 1;
        if (pos > data.length) break;
    }
} catch (e) {
    console.error(e);
}

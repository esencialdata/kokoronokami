const fetch = require('node-fetch');

// Key from previous step
const PK = "pk_a8cb5b741c9ce501a9390c2869d6e2c795e39ea8c01747496ea1830a6b930f5d";
const REGION = "mx";

async function checkProducts() {
    console.log("Fetching products with PK...");
    try {
        const res = await fetch(`http://localhost:9000/store/products?fields=title,handle`, {
            headers: {
                'x-publishable-api-key': PK,
            }
        });

        const data = await res.json();

        if (data.products) {
            console.log("Visible Products:");
            data.products.forEach(p => console.log(`- ${p.title} (${p.handle})`));
        } else {
            console.log("No products found or error:", data);
        }

        console.log("\nChecking Store Name...");
        const storeRes = await fetch(`http://localhost:9000/store`, {
            headers: {
                'x-publishable-api-key': PK,
            }
        });
        const storeData = await storeRes.json();
        console.log("Store Name:", storeData.store?.name);

    } catch (e) {
        console.error("Error fetching:", e);
    }
}

checkProducts();

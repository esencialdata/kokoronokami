
import { ExecArgs } from "@medusajs/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils";

export default async function listProductsDebug({ container }: ExecArgs) {
    const productModuleService = container.resolve(Modules.PRODUCT);
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    try {
        logger.info("Fetching all products...");

        // Using Query to get relations easily including sales channels
        const { data: products } = await query.graph({
            entity: "product",
            fields: ["id", "title", "sales_channels.*"],
        });

        console.log("PRODUCTS IN DB:");
        if (products.length === 0) {
            console.log("No products found.");
        }
        products.forEach(p => {
            console.log(`- ${p.title} (${p.id})`);
            console.log(`  Sales Channels: ${p.sales_channels.map(sc => `${sc.name} (${sc.id})`).join(", ")}`);
        });

        // Also list keys and their sales channels
        const { data: keys } = await query.graph({
            entity: "api_key",
            fields: ["title", "token", "sales_channels.*"],
            filters: { type: "publishable" }
        });

        console.log("\nAPI KEYS:");
        keys.forEach(k => {
            console.log(`- ${k.title}: ${k.token}`);
            console.log(`  Linked Channels: ${k.sales_channels.map(sc => `${sc.name} (${sc.id})`).join(", ")}`);
        });

    } catch (error) {
        logger.error(`Failed to list products: ${error.message}`);
        console.error(error);
    }
}

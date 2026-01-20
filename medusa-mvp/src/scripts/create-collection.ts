import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function createFeaturedCollection({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const productModuleService = container.resolve(Modules.PRODUCT);

    logger.info("Creating Featured collection...");

    // 1. Check if collection exists
    const [existingCollection] = await productModuleService.listCollections({
        title: "Destacados",
    });

    let collectionId = existingCollection?.id;

    if (!collectionId) {
        const createdCollection = await productModuleService.createCollections({
            title: "Destacados",
            handle: "destacados",
        });
        collectionId = createdCollection.id;
        logger.info(`Created collection 'Destacados' with ID: ${collectionId}`);
    } else {
        logger.info(`Collection 'Destacados' already exists with ID: ${collectionId}`);
    }

    // 2. Get all products
    const products = await productModuleService.listProducts({ limit: 100 });

    if (products.length === 0) {
        logger.warn("No products found to add to collection.");
        return;
    }

    logger.info(`Adding ${products.length} products to collection...`);

    // 3. Add products to collection
    // Product Module's updateProducts accepts an array of updates
    await productModuleService.updateProducts(
        products.map((p) => ({
            id: p.id,
            collection_id: collectionId,
        }))
    );

    logger.info("Done!");
}


import { ExecArgs } from "@medusajs/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils";

export default async function cleanupProducts({ container }: ExecArgs) {
    const productModuleService = container.resolve(Modules.PRODUCT);
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

    try {
        logger.info("Fetching all products...");
        const products = await productModuleService.listProducts({});

        if (products.length > 0) {
            const ids = products.map(p => p.id);
            logger.info(`Deleting ${ids.length} products...`);
            await productModuleService.deleteProducts(ids);
            logger.info("Successfully deleted all products.");
        } else {
            logger.info("No products to delete.");
        }

        logger.info("Fetching all product categories...");
        const categories = await productModuleService.listProductCategories({});
        if (categories.length > 0) {
            const ids = categories.map(c => c.id);
            logger.info(`Deleting ${ids.length} categories...`);
            await productModuleService.deleteProductCategories(ids);
            logger.info("Successfully deleted all categories.");
        } else {
            logger.info("No product categories to delete.");
        }

        const inventoryModuleService = container.resolve(Modules.INVENTORY);
        logger.info("Fetching all inventory items...");
        const inventoryItems = await inventoryModuleService.listInventoryItems({});

        if (inventoryItems && inventoryItems.length > 0) {
            const ids = inventoryItems.map(i => i.id);
            logger.info(`Deleting ${ids.length} inventory items...`);
            await inventoryModuleService.deleteInventoryItems(ids);
            logger.info("Successfully deleted all inventory items.");
        } else {
            logger.info("No inventory items to delete.");
        }

    } catch (error) {
        logger.error(`Failed to cleanup products: ${error.message}`);
    }
}

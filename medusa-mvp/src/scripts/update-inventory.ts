
import { ExecArgs } from "@medusajs/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils";

export default async function updateInventory({ container }: ExecArgs) {
    const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
    const inventoryModuleService = container.resolve(Modules.INVENTORY);
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

    try {
        logger.info("Starting inventory update...");

        // 1. Get default Stock Location
        const locations = await stockLocationModuleService.listStockLocations({});
        if (locations.length === 0) {
            throw new Error("No stock locations found!");
        }
        const locationId = locations[0].id;
        logger.info(`Using Stock Location: ${locations[0].name} (${locationId})`);

        // 2. Get all inventory items
        const inventoryItems = await inventoryModuleService.listInventoryItems({});
        logger.info(`Found ${inventoryItems.length} inventory items.`);

        // 3. Update stock
        for (const item of inventoryItems) {
            logger.info(`Processing Item: ${item.sku} (${item.id})`);

            // precise check
            const levels = await inventoryModuleService.listInventoryLevels({
                inventory_item_id: item.id,
                location_id: locationId
            });

            if (levels.length > 0) {
                logger.info(`Level exists (${levels[0].stocked_quantity}), updating...`);
                await inventoryModuleService.updateInventoryLevels(item.id, locationId, {
                    stocked_quantity: 1000,
                });
                logger.info(`Updated level for ${item.sku}`);
            } else {
                logger.info(`Level missing, creating...`);
                try {
                    await inventoryModuleService.createInventoryLevels([
                        {
                            inventory_item_id: item.id,
                            location_id: locationId,
                            stocked_quantity: 1000,
                            incoming_quantity: 100,
                        }
                    ]);
                    logger.info(`Created level for ${item.sku}`);
                } catch (e) {
                    logger.error(`Failed to create level: ${e.message}`);
                }
            }
        }

        logger.info("Finished updating inventory.");
    } catch (error) {
        logger.error(`Failed to update inventory: ${error.message}`);
        console.error(error);
    }
}

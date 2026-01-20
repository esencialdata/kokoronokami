
import { ExecArgs } from "@medusajs/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils";

export default async function debugStockSimple({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const stockLocationService = container.resolve(Modules.STOCK_LOCATION);
    const inventoryService = container.resolve(Modules.INVENTORY);

    try {
        logger.info("Debugging Stock (Simple Mode)...");

        // 1. Get Stock Locations
        const locations = await stockLocationService.listStockLocations({});

        if (locations.length === 0) {
            logger.error("NO STOCK LOCATIONS FOUND!");
            return;
        }
        const loc = locations[0];
        logger.info(`Default Location: ${loc.name} (${loc.id})`);

        // 2. Get Inventory Items
        const items = await inventoryService.listInventoryItems({});
        logger.info(`Found ${items.length} Inventory Items.`);

        // 3. Check Levels
        for (const item of items) {
            const levels = await inventoryService.listInventoryLevels({
                inventory_item_id: item.id,
                location_id: loc.id
            });

            let status = "MISSING";
            if (levels.length > 0) {
                status = `${levels[0].stocked_quantity} (Reserved: ${levels[0].reserved_quantity})`;
            }

            logger.info(`Item ${item.sku} -> Level: ${status}`);
        }

        logger.info("Debug complete.");

    } catch (error) {
        logger.error(`Debug failed: ${error.message}`);
        console.error(error);
    }
}

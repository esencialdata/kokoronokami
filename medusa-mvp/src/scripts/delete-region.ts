import { ExecArgs } from "@medusajs/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils";

export default async function deleteRegion({ container }: ExecArgs) {
    const regionModuleService = container.resolve(Modules.REGION);
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

    const regionId = "reg_01KEHVAXS5MJEETR49G604SM69";

    try {
        logger.info(`Attempting to delete region ${regionId}...`);
        // Check if it exists first
        const region = await regionModuleService.retrieveRegion(regionId).catch(() => null);

        if (region) {
            await regionModuleService.deleteRegions([regionId]);
            logger.info(`Successfully deleted region ${regionId}`);
        } else {
            logger.info(`Region ${regionId} not found, maybe already deleted.`);
        }
    } catch (error) {
        logger.error(`Failed to delete region: ${error.message}`);
    }
}

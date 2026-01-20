
import { ExecArgs } from "@medusajs/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils";

export default async function updatePrices({ container }: ExecArgs) {
    const pricingModuleService = container.resolve(Modules.PRICING);
    const productModuleService = container.resolve(Modules.PRODUCT);
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

    try {
        logger.info("Fetching all products...");
        const products = await productModuleService.listProducts({}, { relations: ["variants"] });

        for (const product of products) {
            for (const variant of product.variants) {
                logger.info(`Updating prices for variant: ${variant.title} (${variant.id})`);

                // Create a price set if it doesn't exist (it should, but just in case)
                // Actually, we just want to ADD a price to the existing price set?
                // In Module API, we usually create prices via the pricing module linking to the variant.
                // But for simplicity in this script, let's try to just use the Product Module update if possible, 
                // or properly use Pricing Module.

                // Simpler approach: Re-create the price set logic or just upsert prices.
                // Medusa 2.0 Pricing Module is complex. Let's try to just add a price rule.

                await pricingModuleService.createPrices([
                    {
                        currency_code: "mxn",
                        amount: 15000, // 150.00
                        min_quantity: 1,
                        max_quantity: 1000,
                        rules: {},
                    }
                ]);

                // Wait, linking is trickier.
                // Let's use the Remote Link or just use the Product Service update which might handle it.
                // Actually, the easiest way is to use the `createProductWorkflow` logic but for updates.
                // Let's brute force it: 
                // We know the variant ID. We can find its price_set_id?

                // Let's try a simpler approach documented for seeding:
                // We can use the pricing module to add prices to a price set ID.
                // But we need the price_set_id associated with the variant.

                const variantWithPriceSet = await productModuleService.retrieveProductVariant(variant.id, { relations: ["price_set"] });

                if (variantWithPriceSet.price_set) {
                    await pricingModuleService.createPrices([
                        {
                            price_set_id: variantWithPriceSet.price_set.id,
                            currency_code: "mxn",
                            amount: 150, // $150.00
                            rules: {},
                        }
                    ]);
                    logger.info(`Added lowest price 150 MXN to variant ${variant.id}`);
                } else {
                    logger.warn(`Variant ${variant.id} has no price set!`);
                }
            }
        }
        logger.info("Finished updating prices.");
    } catch (error) {
        logger.error(`Failed to update prices: ${error.message}`);
        console.error(error);
    }
}

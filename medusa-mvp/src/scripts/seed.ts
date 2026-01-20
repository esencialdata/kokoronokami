import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
  createCollectionsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  // Update Store to use MXN
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [{ currency_code: "mxn", is_default: true }],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  logger.info("Seeding region data...");
  const existingRegions = await query.graph({
    entity: "region",
    fields: ["id", "name", "countries.iso_2"],
    filters: {
      name: "México",
    },
  });

  let region: any = existingRegions.data[0];

  if (!region) {
    // Check if MX is already assigned
    const mxRegion = await query.graph({
      entity: "region",
      fields: ["id"],
      filters: {
        countries: { iso_2: "mx" }
      }
    });

    if (mxRegion.data.length > 0) {
      logger.info("Mexico (mx) already assigned to a region.");
      region = mxRegion.data[0];
    } else {
      const { result: regionResult } = await createRegionsWorkflow(container).run({
        input: {
          regions: [
            {
              name: "México",
              currency_code: "mxn",
              countries: ["mx"],
              payment_providers: ["pp_system_default"],
            },
          ],
        },
      });
      region = regionResult[0];
    }
  }

  logger.info("Seeding stock location data...");
  const existingStockLocations = await query.graph({
    entity: "stock_location",
    fields: ["id"],
    filters: { name: "Almacén Central" }
  });

  let stockLocation: any = existingStockLocations.data[0];

  if (!stockLocation) {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "Almacén Central",
            address: {
              city: "Ciudad de México",
              country_code: "MX",
              address_1: "Calle Falsa 123",
            },
          },
        ],
      },
    });
    stockLocation = stockLocationResult[0];
  }


  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  // ... (previous code)

  logger.info("Seeding fulfillment data...");
  const existingProfiles = await fulfillmentModuleService.listShippingProfiles({
    name: "Default Shipping Profile",
  });

  let shippingProfile = existingProfiles[0];

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  // Check if Fulfillment Set exists
  const existingSets = await fulfillmentModuleService.listFulfillmentSets(
    {
      name: "Envíos México",
    },
    {
      relations: ["service_zones", "service_zones.geo_zones"],
    }
  );

  let fulfillmentSet = existingSets[0];

  if (!fulfillmentSet) {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Envíos México",
      type: "shipping",
      service_zones: [
        {
          name: "México",
          geo_zones: [
            {
              country_code: "mx",
              type: "country",
            },
          ],
        },
      ],
    });

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    });
  }


  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Envío Estándar",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Estándar",
          description: "Envío en 3-5 días hábiles.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "mxn",
            amount: 150, // $150.00 MXN
          },
          {
            region_id: region.id,
            amount: 150,
          }
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq"
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq"
          }
        ]
      },
    ],
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  logger.info("Seeding publishable API key data...");
  const {
    result: [publishableApiKeyResult],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "system",
        },
      ],
    },
  });

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKeyResult.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  logger.info("Seeding product data...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Joyería", is_active: true },
        { name: "Navidad", is_active: true },
        { name: "Empaques", is_active: true },
      ],
    },
  });
  // Create Featured Collection
  logger.info("Seeding collections...");
  const { result: collectionResult } = await createCollectionsWorkflow(container).run({
    input: {
      collections: [
        {
          title: "Destacados",
          handle: "destacados",
        },
      ],
    },
  });
  const featuredCollection = collectionResult[0];

  // Products
  const productsData = [
    {
      title: "Árbol de Navidad Artesanal",
      description: "Hermoso árbol de navidad hecho a mano con papel orgánico reciclado.",
      handle: "arbol-navidad",
      status: ProductStatus.PUBLISHED,
      images: [{ url: "https://dummyimage.com/600x800/f9f7f2/8c7b5b&text=Arbol+Navidad" }],
      category_ids: [categoryResult.find(c => c.name === "Navidad")!.id],
      options: [{ title: "Tamaño", values: ["Grande", "Mediano"] }],
      variants: [
        {
          title: "Grande",
          sku: "XMAS-Tree-L",
          options: { "Tamaño": "Grande" },
          prices: [{ amount: 1200, currency_code: "mxn" }]
        },
        {
          title: "Mediano",
          sku: "XMAS-Tree-M",
          options: { "Tamaño": "Mediano" },
          prices: [{ amount: 850, currency_code: "mxn" }]
        }
      ]
    },
    {
      title: "Aretes Tsuru de Oro",
      description: "Aretes elegantes con figura de grulla (Tsuru) en papel metalizado.",
      handle: "aretes-tsuru",
      status: ProductStatus.PUBLISHED,
      images: [{ url: "https://dummyimage.com/600x800/f9f7f2/8c7b5b&text=Aretes+Tsuru" }],
      category_ids: [categoryResult.find(c => c.name === "Joyería")!.id],
      options: [{ title: "Color", values: ["Dorado", "Plateado"] }],
      variants: [
        {
          title: "Dorado",
          sku: "EAR-TSURU-GOLD",
          options: { "Color": "Dorado" },
          prices: [{ amount: 450, currency_code: "mxn" }]
        }
      ]
    },
    {
      title: "Empaque Navideño Especial",
      description: "Caja de regalo con detalles navideños y listón de seda.",
      handle: "empaque-navidad",
      status: ProductStatus.PUBLISHED,
      images: [{ url: "https://dummyimage.com/600x800/f9f7f2/8c7b5b&text=Empaque" }],
      category_ids: [categoryResult.find(c => c.name === "Empaques")!.id],
      options: [{ title: "Tipo", values: ["Estándar"] }],
      variants: [
        {
          title: "Estándar",
          sku: "BOX-XMAS",
          options: { "Tipo": "Estándar" },
          prices: [{ amount: 50, currency_code: "mxn" }]
        }
      ]
    },
    {
      title: "Aretes Geométricos",
      description: "Diseño moderno y minimalista.",
      handle: "aretes-geo",
      status: ProductStatus.PUBLISHED,
      images: [{ url: "https://dummyimage.com/600x800/f9f7f2/8c7b5b&text=Aretes+Geo" }],
      category_ids: [categoryResult.find(c => c.name === "Joyería")!.id],
      options: [{ title: "Material", values: ["Papel"] }],
      variants: [
        {
          title: "Papel",
          sku: "EAR-GEO",
          options: { "Material": "Papel" },
          prices: [{ amount: 350, currency_code: "mxn" }]
        }
      ]
    },
    {
      title: "Figura Decorativa Dragón",
      description: "Figura compleja de dragón para decoración de espacios.",
      handle: "figura-dragon",
      status: ProductStatus.PUBLISHED,
      images: [{ url: "https://dummyimage.com/600x800/f9f7f2/8c7b5b&text=Dragon" }],
      category_ids: [categoryResult.find(c => c.name === "Navidad")!.id], // Poniendo en Navidad como placeholder
      options: [{ title: "Edición", values: ["Limitada"] }],
      variants: [
        {
          title: "Limitada",
          sku: "FIG-DRAGON",
          options: { "Edición": "Limitada" },
          prices: [{ amount: 2500, currency_code: "mxn" }]
        }
      ]
    }
  ];

  await createProductsWorkflow(container).run({
    input: {
      products: productsData.map(p => ({
        ...p,
        collection_id: featuredCollection.id,
        shipping_profile_id: shippingProfile.id,
        sales_channels: [{ id: defaultSalesChannel[0].id }]
      }))
    }
  });

  logger.info("Finished seeding demo data.");
}

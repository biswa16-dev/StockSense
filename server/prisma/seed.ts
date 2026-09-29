import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const initialProducts = [
  { name: "Premium Leather Sofa", sku: "FURN-SOF-01", price: 107817.00, stock: 12, category: "Living Room", unit: "piece" },
  { name: "Oak Dining Table", sku: "FURN-TBL-02", price: 70467.00, stock: 4, category: "Dining Room", unit: "piece" },
  { name: "Glass Coffee Table", sku: "FURN-COF-03", price: 28967.00, stock: 0, category: "Living Room", unit: "piece" },
  { name: "Ergonomic Office Chair", sku: "FURN-CHR-04", price: 24817.00, stock: 45, category: "Office", unit: "piece" },
  { name: "King Size Bed Frame", sku: "FURN-BED-05", price: 82917.00, stock: 8, category: "Bedroom", unit: "piece" },
  { name: "Modern Upholstered Dining Chair", sku: "FURN-DNC-06", price: 12367.00, stock: 24, category: "Dining Room", unit: "piece" },
  { name: "Tripod Shelf Floor Lamp", sku: "LIGH-FLR-07", price: 10707.00, stock: 15, category: "Lighting", unit: "piece" }
]

async function main() {
  console.log('Seeding database...')

  // Create standard Warehouse
  const mainWarehouse = await prisma.warehouse.upsert({
    where: { name: 'Main Warehouse' },
    update: {},
    create: {
      name: 'Main Warehouse',
      address: '123 Supply Chain Ave',
      isActive: true,
      locations: {
        create: [
          { name: 'WH/Stock', type: 'STORAGE' },
          { name: 'WH/Receiving', type: 'STAGING' },
          { name: 'WH/Dispatch', type: 'STAGING' }
        ]
      }
    }
  })

  // Get the WH/Stock location to assign inventory
  const stockLocation = await prisma.location.findFirst({
    where: { name: 'WH/Stock' }
  })

  if (!stockLocation) throw new Error("Could not find WH/Stock location")

  for (const p of initialProducts) {
    // Upsert Category
    const category = await prisma.category.upsert({
      where: { name: p.category },
      update: {},
      create: { name: p.category }
    })

    // Upsert Product
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        name: p.name,
        sku: p.sku,
        categoryId: category.id,
        unit: p.unit,
        reorderLevel: 5
      }
    })

    // Upsert Stock Level (quantity from initial data)
    await prisma.stockLevel.upsert({
      where: {
        productId_locationId: {
          productId: product.id,
          locationId: stockLocation.id
        }
      },
      update: {
        quantity: p.stock
      },
      create: {
        productId: product.id,
        locationId: stockLocation.id,
        quantity: p.stock
      }
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

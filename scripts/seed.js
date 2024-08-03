require("dotenv").config();
const { db } = require("@vercel/postgres");

DUMMY_INVENTORY = [
  {
    name: "apple",
    quantity: 10,
    image:
      "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "banana",
    quantity: 20,
    image:
      "https://images.pexels.com/photos/2872767/pexels-photo-2872767.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "cherry",
    quantity: 30,
    image:
      "https://images.pexels.com/photos/23183/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "mango",
    quantity: 40,
    image:
      "https://images.pexels.com/photos/2935021/pexels-photo-2935021.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

async function seedInventory(client) {
  try {
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        image VARCHAR(255)
      );
    `;

    console.log(`Created "inventory" table`);

    // Insert the dummy inventory data
    for (const item of DUMMY_INVENTORY) {
      await client.sql`
        INSERT INTO inventory (name, quantity, image)
        VALUES (${item.name}, ${item.quantity}, ${item.image});
      `;
    }

    console.log(`Seeded "inventory" table`);

    return createTable;
  } catch (error) {
    console.error("Error seeding inventory:", error);
    throw error;
  }
}

async function main() {
  // Create a new client
  const client = await db.connect();

  // Create the "inventory" table
  await seedInventory(client);

  // Close the client connection
  await client.end();
}

main().catch((error) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    error
  );
  process.exit(1);
});

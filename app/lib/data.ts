import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchInventoryItems(query: string) {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    console.log('Fetching Inventory Data...');
    const data = await sql<InventoryItem>`SELECT id, name, quantity, image FROM inventory WHERE name ILIKE ${`%${query}%`} ORDER BY id DESC`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }

}
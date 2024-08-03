"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Quantity must be at least 1." }),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      `Invalid image type. Accepted types are: ${ACCEPTED_IMAGE_TYPES.join(
        ", "
      )}`
    ),
});

export async function addItem(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    console.log(
      "Validation failed:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to add item.",
    };
  }

  const { name, quantity, image } = validatedFields.data;

  try {
    // Store the image
    const filename = await storeImage(image as File, name);
    const imagePath = `/uploads/${filename}`;

    // Save the image path to the database
    await sql`INSERT INTO inventory (name, quantity, image) VALUES (${name}, ${quantity}, ${imagePath})`;
  } catch (error) {
    console.error("Error in addItem:", (error as Error).message);
    return {
      message: "Error: Failed to add item. " + (error as Error).message,
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function removeItem(itemId: number): Promise<void> {
  console.log("Removing item from inventory:", itemId);

  try {
    // First, retrieve the image path from the database
    const result = await sql`SELECT image FROM inventory WHERE id = ${itemId}`;

    if (result.rows.length === 0) {
      throw new Error("Item not found.");
    }

    const imagePath = result.rows[0].image;

    // Delete the image file if it exists
    if (imagePath) {
      const fullPath = path.join(process.cwd(), "public", imagePath);
      try {
        await unlink(fullPath);
        console.log(`Deleted image file: ${fullPath}`);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
        // We'll continue even if file deletion fails
      }
    }

    // Delete the item from the database
    await sql`DELETE FROM inventory WHERE id = ${itemId}`;
    console.log(`Deleted item with ID: ${itemId} from the database`);
  } catch (error) {
    console.error(
      "Database Error: Failed to remove item from inventory:",
      error
    );
    throw new Error(
      "Failed to remove item from inventory: " + (error as Error).message
    );
  }

  revalidatePath("/");
}

export async function updateItem(
  itemId: number,
  quantity: number
): Promise<void> {
  console.log("Updating item in inventory:", itemId);

  if (quantity === 0) {
    try {
      await sql`DELETE FROM inventory WHERE id = ${itemId}`;
    } catch (error) {
      console.error(
        "Database Error: Failed to remove item from inventory:",
        error
      );
      throw new Error("Database Error: Failed to remove item from inventory.");
    }
  }

  try {
    await sql`UPDATE inventory SET quantity = ${quantity} WHERE id = ${itemId}`;
  } catch (error) {
    console.error("Database Error: Failed to update item in inventory:", error);
    throw new Error("Database Error: Failed to update item in inventory.");
  }

  revalidatePath("/");
}

async function storeImage(image: File, name: string): Promise<string> {
  try {
    // Process the image
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${name
      .replace(/\s+/g, "-")
      .toLowerCase()}-${uniqueSuffix}${path.extname(image.name)}`;

    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Save the file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return filename;
  } catch (error) {
    console.error("Error storing image:", error);
    throw new Error("Failed to store image.");
  }
}

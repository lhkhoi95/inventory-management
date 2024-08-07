"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { removeImage, storeImage } from "./cloudinary";
import { itemsRecognizer } from "./image-processing";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const ItemSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Quantity must be at least 1." }),
  image: z
    .instanceof(File)
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      `Invalid image type. Accepted types are: ${ACCEPTED_IMAGE_TYPES.join(
        ", "
      )}`
    ),
});

const ItemsSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
    })
  ),
  image: z
    .instanceof(File)
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
  const validatedFields = ItemSchema.safeParse({
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
    const { imageUrl, publicId } = await storeImage(image, name);

    // Save the image path to the database
    await sql`INSERT INTO inventory (name, quantity, image, public_id) VALUES (${name}, ${quantity}, ${imageUrl}, ${publicId})`;
  } catch (error) {
    console.error("Error in addItem:", (error as Error).message);
    return {
      message: "Error: Failed to add item. " + (error as Error).message,
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function addItems(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawItems = JSON.parse(formData.get("items") as string);
  const rawImage = formData.get("image");
  const itemsWithIntQuantities = rawItems.map((item: any) => ({
    name: item.name,
    quantity: parseInt(item.quantity, 10),
  }));

  const validatedFields = ItemsSchema.safeParse({
    items: itemsWithIntQuantities,
    image: rawImage,
  });

  if (!validatedFields.success) {
    console.log(
      "Validation failed:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to add items.",
    };
  }

  const { items, image } = validatedFields.data;

  try {
    // Start a transaction
    await sql`BEGIN`;

    for (const item of items) {
      const { name, quantity } = item;

      // Store the image
      const { imageUrl, publicId } = await storeImage(image, name);

      // Insert the item
      await sql`
        INSERT INTO inventory (name, quantity, image, public_id)
        VALUES (${name}, ${quantity}, ${imageUrl}, ${publicId})
      `;
    }

    // Commit the transaction
    await sql`COMMIT`;
  } catch (error) {
    // Rollback in case of error
    await sql`ROLLBACK`;
    console.error("Error in addItems:", (error as Error).message);
    return {
      message: "Error: Failed to add items. " + (error as Error).message,
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function fetchItemsAI(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const imageName = formData.get("name") as string;
  const imageFile = formData.get("image") as File;
  let { imageUrl, publicId } = { imageUrl: "", publicId: "" };

  try {
    // Store image in Cloudinary
    ({ imageUrl, publicId } = await storeImage(imageFile, imageName));
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return { message: "Failed to upload image to Cloudinary." };
  }

  try {
    // Analyze the image and extract the items and quantities
    const response: AIDetectedItems = await itemsRecognizer(imageUrl);

    // Remove the image from Cloudinary
    await removeImage(publicId);

    return { message: null, items: response.items };
  } catch (error) {
    console.log("Error identifying objects by OpenAI:", error);
    return { message: "Failed to identify objects." };
  }
}

export async function removeItem(itemId: number): Promise<void> {
  // Remove the image from Cloudinary
  try {
    const imageToDelete =
      await sql`SELECT public_id FROM inventory WHERE id = ${itemId}`;

    await removeImage(imageToDelete.rows[0].public_id);
  } catch (error) {
    console.error("Error in removeItem:", error);
    throw new Error("Failed to remove item on Cloudinary.");
  }

  // Remove the item from the database
  try {
    await sql`DELETE FROM inventory WHERE id = ${itemId}`;
  } catch (error) {
    console.error(
      "Database Error: Failed to remove item from inventory:",
      error
    );
    throw new Error("Database Error: Failed to remove item from inventory.");
  }
  revalidatePath("/");
}

export async function updateItem(
  itemId: number,
  quantity: number
): Promise<void> {
  console.log("Updating item in inventory:", itemId);

  if (quantity === 0) {
    await removeItem(itemId);
  }

  try {
    await sql`UPDATE inventory SET quantity = ${quantity} WHERE id = ${itemId}`;
  } catch (error) {
    console.error("Database Error: Failed to update item in inventory:", error);
    throw new Error("Database Error: Failed to update item in inventory.");
  }

  revalidatePath("/");
}

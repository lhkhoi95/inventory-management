import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiOptions,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function storeImage(
  image: File,
  name: string
): Promise<CloudinaryResponse> {
  try {
    // Process the image
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${name
      .replace(/\s+/g, "-")
      .toLowerCase()}-${uniqueSuffix}`;

    const folderPath = "inventory-management/uploads";

    // Upload to Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      // Image will be stored inside the "inventory-management/uploads" folder in Cloudinary
      const uploadOptions: UploadApiOptions = {
        resource_type: "auto",
        public_id: `${filename}`,
        folder: `${folderPath}`,
      };

      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        })
        .end(buffer);
    });

    // Return URL and public_id
    return {
      imageUrl: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error storing image:", error);
    throw new Error("Failed to store image.");
  }
}

export async function removeImage(publicId: string): Promise<any> {
  //   console.log("Removing image from Cloudinary:", publicId);
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    console.log("Cloudinary response:", result);
  } catch (error) {
    console.error("Error removing image from Cloudinary:", error);
    throw new Error("Failed to remove image from Cloudinary.");
  }
}

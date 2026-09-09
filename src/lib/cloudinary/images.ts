import "server-only";

import { v2 as cloudinary } from "cloudinary";

import {
  ImageValidationError,
  validateManagedImage,
} from "@/lib/cloudinary/image-validation";
import { cloudinaryEnvSchema } from "@/validation/env";

const CATEGORY_FOLDER = "mens-hub/categories";
const PRODUCT_FOLDER = "mens-hub/products";
const CONTENT_FOLDER = "mens-hub/content";
const MAX_DIMENSION = 10_000;
const MAX_PIXELS = 40_000_000;

export type UploadedImage = {
  secureUrl: string;
  publicId: string;
};

function configureCloudinary(): string {
  const env = cloudinaryEnvSchema.parse(process.env);
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return env.CLOUDINARY_CLOUD_NAME;
}

async function uploadManagedImage(file: File, folder: string): Promise<UploadedImage> {
  const bytes = await validateManagedImage(file);
  const cloudName = configureCloudinary();
  const dataUri = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
    overwrite: false,
    unique_filename: true,
    use_filename: false,
  });

  const validDeliveryUrl = result.secure_url.startsWith(
    `https://res.cloudinary.com/${cloudName}/image/upload/`,
  );
  const width = result.width ?? 0;
  const height = result.height ?? 0;
  const dimensionsAreValid =
    width > 0 &&
    height > 0 &&
    width <= MAX_DIMENSION &&
    height <= MAX_DIMENSION &&
    width * height <= MAX_PIXELS;

  if (!validDeliveryUrl || !dimensionsAreValid) {
    await deleteManagedImage(result.public_id, folder).catch(() => undefined);
    throw new ImageValidationError("The uploaded image dimensions or delivery URL are invalid.");
  }

  return { secureUrl: result.secure_url, publicId: result.public_id };
}

async function deleteManagedImage(publicId: string, folder: string): Promise<void> {
  if (!publicId.startsWith(`${folder}/`) || publicId.includes("..")) return;
  configureCloudinary();
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
  if (result.result !== "ok" && result.result !== "not found") throw new Error(`Cloudinary did not delete ${publicId}.`);
}

export function uploadCategoryImage(file: File): Promise<UploadedImage> {
  return uploadManagedImage(file, CATEGORY_FOLDER);
}

export function uploadProductImage(file: File): Promise<UploadedImage> {
  return uploadManagedImage(file, PRODUCT_FOLDER);
}

export function uploadContentImage(file: File): Promise<UploadedImage> {
  return uploadManagedImage(file, CONTENT_FOLDER);
}

export async function deleteCategoryImage(publicId: string): Promise<void> {
  return deleteManagedImage(publicId, CATEGORY_FOLDER);
}

export async function deleteProductImage(publicId: string): Promise<void> {
  return deleteManagedImage(publicId, PRODUCT_FOLDER);
}

export async function deleteContentImage(publicId: string): Promise<void> {
  return deleteManagedImage(publicId, CONTENT_FOLDER);
}

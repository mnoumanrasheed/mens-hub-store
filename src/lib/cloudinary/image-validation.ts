export const MAX_MANAGED_IMAGE_BYTES = 5 * 1024 * 1024;

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageValidationError";
  }
}

function hasValidSignature(bytes: Uint8Array, mimeType: string): boolean {
  if (mimeType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mimeType === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (byte, index) => bytes[index] === byte,
    );
  }

  if (mimeType === "image/webp") {
    return (
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    );
  }

  return false;
}

export async function validateManagedImage(file: File): Promise<Uint8Array> {
  if (file.size === 0) {
    throw new ImageValidationError("The selected image is empty.");
  }
  if (file.size > MAX_MANAGED_IMAGE_BYTES) {
    throw new ImageValidationError("Images must be 5 MB or smaller.");
  }
  if (!allowedMimeTypes.has(file.type)) {
    throw new ImageValidationError("Use a JPG, JPEG, PNG, or WebP image.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !allowedExtensions.has(extension)) {
    throw new ImageValidationError("The image filename must use JPG, JPEG, PNG, or WebP.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidSignature(bytes, file.type)) {
    throw new ImageValidationError("The file content does not match its image type.");
  }

  return bytes;
}

export const validateCategoryImage = validateManagedImage;

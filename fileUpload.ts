/**
 * File upload helper for converting base64/blob data to storage
 */
import { storagePut } from "server/storage";

export async function uploadGeneratedFile(
  base64Data: string,
  fileName: string,
  mimeType: string = "application/octet-stream"
): Promise<{ url: string; key: string }> {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Determine file extension
    let ext = "bin";
    if (mimeType.includes("image")) ext = "png";
    else if (mimeType.includes("video")) ext = "mp4";
    else if (mimeType.includes("jpeg")) ext = "jpg";
    else if (mimeType.includes("webp")) ext = "webp";

    // Upload to storage
    const { url, key } = await storagePut(
      `generated/${Date.now()}-${fileName}.${ext}`,
      buffer,
      mimeType
    );

    return { url, key };
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
}

export async function uploadFileFromBlob(
  blob: Blob,
  fileName: string,
  mimeType: string = "application/octet-stream"
): Promise<{ url: string; key: string }> {
  try {
    // Convert blob to buffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine file extension
    let ext = "bin";
    if (mimeType.includes("image")) ext = "png";
    else if (mimeType.includes("video")) ext = "mp4";
    else if (mimeType.includes("jpeg")) ext = "jpg";
    else if (mimeType.includes("webp")) ext = "webp";

    // Upload to storage
    const { url, key } = await storagePut(
      `generated/${Date.now()}-${fileName}.${ext}`,
      buffer,
      mimeType
    );

    return { url, key };
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
}

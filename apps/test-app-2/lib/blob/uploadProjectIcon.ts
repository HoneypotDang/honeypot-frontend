import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function uploadImage(image: File, imageName: string) {
  const blob = await put("projectIcons/" + imageName, image, {
    access: "public",
  });

  revalidatePath("/");
  console.log("Image uploaded to", blob);
  return blob;
}

export function base64ToFile(
  base64String: string,
  fileName: string
): {
  file: File;
  blob: Blob;
  url: string;
} {
  // Split the base64 string to get the content and type
  const [metadata, base64Data] = base64String.split(",");
  const mimeType = metadata.match(/:(.*?);/)?.[1]; // Extract MIME type

  // Convert base64 data to a binary buffer
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob from the byte array
  const blob = new Blob([byteArray], { type: mimeType });

  // convert the Blob to a File
  const file = new File([blob], fileName, { type: mimeType });

  //create a url for the file
  const url = URL.createObjectURL(blob);

  return { file, blob, url };
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

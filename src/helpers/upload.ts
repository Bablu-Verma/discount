import { NextResponse } from "next/server";
import path from "path";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";

export const upload_single_image = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const uploadDir = path.join(process.cwd(), "public", "uploads/image");
  await fs.mkdir(uploadDir, { recursive: true });
  const fileExtension = path.extname(file.name);
  const baseFileName = path.basename(file.name, fileExtension);
  const uniqueFileName = `${baseFileName}-${Date.now()}${fileExtension}`;
  const filePath = path.join(uploadDir, uniqueFileName);

  await fs.writeFile(filePath, buffer);
  revalidatePath("/");
  const image_path = `${process.env.HOST_URL}/uploads/image/${uniqueFileName}`;
  return image_path;
};

export const upload_multiple_images = async (files: File[]) => {
  const imagePaths: string[] = [];

  // Iterate over each file and upload
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const uploadDir = path.join(process.cwd(), "public", "uploads/image");

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const fileExtension = path.extname(file.name);
    const baseFileName = path.basename(file.name, fileExtension);
    const uniqueFileName = `${baseFileName}-${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);

    // Add image path to the array
    const imagePath = `${process.env.HOST_URL}/uploads/image/${uniqueFileName}`;
    imagePaths.push(imagePath);
  }

  // Revalidate the path if necessary
  revalidatePath("/");

  return imagePaths;
};

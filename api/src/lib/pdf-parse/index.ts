import fs from "fs";
import { PDFParse, TextResult } from "pdf-parse";

export const parsePdf = async (
  arrayBuffer: ArrayBuffer,
): Promise<TextResult> => {
  const dataUint8Array = new Uint8Array(arrayBuffer);
  const parser = await new PDFParse(dataUint8Array);
  const data = await parser.getText();
  return data;
};

export async function parsePdfFromPath(filePath: string) {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await parsePdf(buffer.buffer as ArrayBuffer);
    console.log("\n=== FIRST 500 CHARS ===");
    console.log(data.text.substring(0, 500));
    return data;
  } catch (error) {
    console.error("Error parsing PDF from path:", error);
    throw error;
  }
}

export async function parsePdfFromUrl(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch PDF: ${response.status} ${response.statusText}`,
      );
    }
    const arrayBuffer = await response.arrayBuffer();
    const data = await parsePdf(arrayBuffer);
    console.log("\n=== FIRST 500 CHARS ===");
    console.log(data.text.substring(0, 500));
    return data;
  } catch (error) {
    console.error("Error parsing PDF from URL:", error);
    throw error;
  }
}

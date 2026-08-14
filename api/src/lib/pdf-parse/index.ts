import fs from "fs";
import { PDFParse, TextResult } from "pdf-parse";

export const parsePdf = async (
  source: ArrayBuffer | Uint8Array,
): Promise<TextResult> => {
  const dataUint8Array =
    source instanceof ArrayBuffer ? new Uint8Array(source) : source;
  const parser = await new PDFParse(dataUint8Array);
  const data = await parser.getText();
  return data;
};

export async function parsePdfFromPath(filePath: string) {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await parsePdf(buffer);
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
    return data;
  } catch (error) {
    console.error("Error parsing PDF from URL:", error);
    throw error;
  }
}

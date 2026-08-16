import fs from "fs";
import path from "path";
import { ensureStorageDir, SAMPLES_DIR } from "./storage";
import { logger } from "@/lib/logger";

interface SampleDefinition {
  fileName: string;
  title: string;
  body: string;
}

const SAMPLES: SampleDefinition[] = [
  {
    fileName: "landlord-tenant-act-2022.pdf",
    title: "Landlord and Tenant Act 2022",
    body: "An Act to provide for the relationship between landlords and tenants, the responsibilities of each party, and the resolution of disputes arising from tenancy agreements in Uganda.",
  },
  {
    fileName: "constitution-of-uganda.pdf",
    title: "The Constitution of Uganda",
    body: "The supreme law of the Republic of Uganda, establishing the country as a sovereign state, defining its structure, and guaranteeing fundamental rights and freedoms.",
  },
];

function escapePdfText(text: string): string {
  return text.replace(/[()\\]/g, "\\$&").slice(0, 200);
}

function buildPdf(title: string, body: string): Buffer {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
  ];

  const contentStream =
    `BT /F1 20 Tf 72 720 Td (${escapePdfText(title)}) Tj ET\n` +
    `BT /F1 12 Tf 72 690 Td (${escapePdfText(body)}) Tj ET`;
  objects.push(
    `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`,
  );
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}

export async function generateSamples(): Promise<void> {
  ensureStorageDir();
  for (const sample of SAMPLES) {
    const filePath = path.join(SAMPLES_DIR, sample.fileName);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, buildPdf(sample.title, sample.body));
      logger.info(`Generated sample: ${sample.fileName}`);
    }
  }
}

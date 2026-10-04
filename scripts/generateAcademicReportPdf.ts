import fs from "fs";
import path from "path";
import { createBlackBookContext } from "./blackbook/helpers.js";
import { generatePreliminaryPages } from "./blackbook/preliminary.js";
import { generateChapters1and2 } from "./blackbook/chapter1_2.js";
import { generateChapters3and4 } from "./blackbook/chapter3_4.js";
import { generateChapter5 } from "./blackbook/chapter5.js";
import { generateChapters6and7 } from "./blackbook/chapter6_7.js";
import { generateChapters8and9 } from "./blackbook/chapter8_9.js";

export function generateAcademicReport(): Buffer {
  const ctx = createBlackBookContext();

  console.log("[BlackBook] 1. Generating Preliminary Pages (Pages 1–10)...");
  generatePreliminaryPages(ctx);

  console.log("[BlackBook] 2. Generating Chapters 1 & 2 (Pages 11–18)...");
  generateChapters1and2(ctx);

  console.log("[BlackBook] 3. Generating Chapters 3 & 4 (Pages 19–38)...");
  generateChapters3and4(ctx);

  console.log("[BlackBook] 4. Generating Chapter 5 (Pages 39–49)...");
  generateChapter5(ctx);

  console.log("[BlackBook] 5. Generating Chapters 6 & 7 (Pages 50–55)...");
  generateChapters6and7(ctx);

  console.log("[BlackBook] 6. Generating Chapters 8 & 9 (Pages 56–60)...");
  generateChapters8and9(ctx);

  const totalPages = ctx.doc.getNumberOfPages();
  console.log(`[BlackBook] Successfully generated complete dissertation! Total Pages: ${totalPages}`);

  const outputArrayBuffer = ctx.doc.output("arraybuffer");
  return Buffer.from(outputArrayBuffer);
}

// Auto-run when executed directly via npx tsx scripts/generateAcademicReportPdf.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const buf = generateAcademicReport();
    const outPath = path.resolve(process.cwd(), "FinTrackPro_Academic_Project_Report.pdf");
    fs.writeFileSync(outPath, buf);
    console.log(`[BlackBook] PDF written to: ${outPath} (${buf.byteLength} bytes)`);
  } catch (err) {
    console.error("[BlackBook] Error generating PDF:", err);
    process.exit(1);
  }
}

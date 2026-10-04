import fs from "fs";
import path from "path";
import * as jspdfMod from "jspdf";
import * as autoTableMod from "jspdf-autotable";

const jsPDF = (jspdfMod as any).jsPDF || (jspdfMod as any).default || jspdfMod;
const autoTable = (autoTableMod as any).default || autoTableMod;

export function buildMumbaiUniversityBlackBook(): Buffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const leftMargin = 25; // 25mm left margin for Mumbai University Black Book binding
  const rightMargin = 15;
  const contentWidth = pageWidth - leftMargin - rightMargin; // 170mm
  const topMargin = 20;
  const bottomMargin = 20;

  // Professional Palette
  const blackCoverBg = [10, 15, 26]; // Dark Black Book cover
  const goldPrimary = [212, 175, 55]; // Metallic Gold
  const goldSecondary = [245, 158, 11]; // Warm Amber Gold
  const textDark = [15, 23, 42]; // Slate 900
  const textBody = [30, 41, 59]; // Slate 800
  const textMuted = [100, 116, 139]; // Slate 500
  const emeraldPrimary = [16, 185, 129]; // Emerald 500
  const emeraldDark = [5, 150, 105]; // Emerald 600
  const boxBg = [248, 250, 252]; // Slate 50
  const borderLight = [226, 232, 240]; // Slate 200

  let curY = topMargin;

  // Running Headers & Footers
  function drawRunningHeaderFooter(pageNumber: number, romanStr?: string, chapterTitle?: string) {
    if (pageNumber === 1 || pageNumber === 2) return; // Skip outer & inner cover

    // Running Header (only for pages >= 3)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text("FinTrackPro: Enterprise Wealth Management & Mutual Fund Advisory Platform", leftMargin, 12);
    if (chapterTitle) {
      doc.text(chapterTitle, pageWidth - rightMargin, 12, { align: "right" });
    }
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, 14, pageWidth - rightMargin, 14);

    // Running Footer
    doc.line(leftMargin, pageHeight - 14, pageWidth - rightMargin, pageHeight - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text("Department of Computer Engineering, University of Mumbai", leftMargin, pageHeight - 9);

    if (romanStr) {
      doc.text(romanStr, pageWidth - rightMargin, pageHeight - 9, { align: "right" });
    } else {
      doc.text(`Page ${pageNumber}`, pageWidth - rightMargin, pageHeight - 9, { align: "right" });
    }
  }

  function startNewPage(headerTitle?: string, romanStr?: string) {
    doc.addPage();
    curY = topMargin;
    const pageNum = doc.getNumberOfPages();
    drawRunningHeaderFooter(pageNum, romanStr, headerTitle);
  }

  function drawChapterHeading(chNum: string, title: string) {
    doc.setFillColor(boxBg[0], boxBg[1], boxBg[2]);
    doc.roundedRect(leftMargin, curY, contentWidth, 18, 2, 2, "F");
    doc.setFillColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
    doc.roundedRect(leftMargin, curY, 4, 18, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(`${chNum}: ${title}`, leftMargin + 8, curY + 11.5);
    curY += 24;
  }

  function drawSectionHeading(num: string, title: string) {
    if (curY > pageHeight - 35) {
      startNewPage();
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
    doc.text(`${num} ${title}`, leftMargin, curY);

    doc.setDrawColor(emeraldPrimary[0], emeraldPrimary[1], emeraldPrimary[2]);
    doc.setLineWidth(0.4);
    doc.line(leftMargin, curY + 1.5, leftMargin + 30, curY + 1.5);
    curY += 7;
  }

  function drawParagraph(text: string): number {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(textBody[0], textBody[1], textBody[2]);
    const splitLines = doc.splitTextToSize(text, contentWidth);
    const blockHeight = splitLines.length * 4.4;

    if (curY + blockHeight > pageHeight - bottomMargin) {
      startNewPage();
    }

    doc.text(splitLines, leftMargin, curY);
    curY += blockHeight + 3.5;
    return curY;
  }

  function drawBullet(title: string, desc: string): number {
    if (curY > pageHeight - 30) {
      startNewPage();
    }
    doc.setFillColor(emeraldPrimary[0], emeraldPrimary[1], emeraldPrimary[2]);
    doc.circle(leftMargin + 2, curY - 1.2, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    const titleText = `   ${title}: `;
    const titleWidth = doc.getTextWidth(titleText);
    doc.text(titleText, leftMargin, curY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(textBody[0], textBody[1], textBody[2]);
    const splitDesc = doc.splitTextToSize(desc, contentWidth - titleWidth - 2);
    doc.text(splitDesc, leftMargin + titleWidth, curY);

    const blockHeight = Math.max(splitDesc.length * 4.4, 5);
    curY += blockHeight + 2;
    return curY;
  }

  function drawCodeBlock(code: string): number {
    const lines = code.split("\n");
    const blockHeight = lines.length * 3.8 + 6;
    if (curY + blockHeight > pageHeight - bottomMargin) {
      startNewPage();
    }

    doc.setFillColor(15, 23, 42); // slate 900
    doc.roundedRect(leftMargin, curY, contentWidth, blockHeight, 2, 2, "F");

    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(16, 185, 129); // emerald 500

    let lineY = curY + 5;
    lines.forEach((l) => {
      doc.text(l, leftMargin + 4, lineY);
      lineY += 3.8;
    });

    curY += blockHeight + 4;
    return curY;
  }

  // ==========================================
  // PAGE 1: MUMBAI UNIVERSITY BLACK BOOK OUTER COVER
  // ==========================================
  doc.setFillColor(blackCoverBg[0], blackCoverBg[1], blackCoverBg[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Golden Outer Border (Black Book Embossed Edge)
  doc.setDrawColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.setLineWidth(1.2);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
  doc.setLineWidth(0.4);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // University Header
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.text("UNIVERSITY OF MUMBAI", pageWidth / 2, 28, { align: "center" });

  doc.setFontSize(10.5);
  doc.setTextColor(goldSecondary[0], goldSecondary[1], goldSecondary[2]);
  doc.text("A CAPSTONE PROJECT DISSERTATION (BLACK BOOK)", pageWidth / 2, 35, { align: "center" });

  // University Emblem Emblem Simulation Box
  doc.setDrawColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.setLineWidth(0.6);
  doc.circle(pageWidth / 2, 53, 12, "S");
  doc.setFont("times", "bold");
  doc.setFontSize(9);
  doc.text("MU", pageWidth / 2, 54.5, { align: "center" });
  doc.setFontSize(6.5);
  doc.text("ESTD 1857", pageWidth / 2, 59, { align: "center" });

  // Project Title
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.text("FinTrackPro", pageWidth / 2, 78, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(245, 245, 245);
  const subTitleLines = doc.splitTextToSize(
    "An Enterprise Wealth Management, Multi-Asset Mutual Fund Advisory & NACH Mandate Execution Platform",
    contentWidth - 10
  );
  doc.text(subTitleLines, pageWidth / 2, 88, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(180, 190, 205);
  doc.text("Submitted in partial fulfillment of the requirements for the award of the Degree of", pageWidth / 2, 108, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.setTextColor(goldSecondary[0], goldSecondary[1], goldSecondary[2]);
  doc.text("BACHELOR OF TECHNOLOGY / ENGINEERING", pageWidth / 2, 116, { align: "center" });
  doc.text("IN COMPUTER ENGINEERING / INFORMATION TECHNOLOGY", pageWidth / 2, 122, { align: "center" });

  // Candidate Details
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(leftMargin + 5, 140, contentWidth - 10, 52, 2, 2, "F");
  doc.setDrawColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(leftMargin + 5, 140, contentWidth - 10, 52, 2, 2, "S");

  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.setTextColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.text("CANDIDATE CREDENTIALS", pageWidth / 2, 148, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(240, 240, 240);
  doc.text("Candidate Name:", leftMargin + 12, 158);
  doc.text("Sarathy Rangarajan", leftMargin + 55, 158);

  doc.text("Registration / Roll No:", leftMargin + 12, 165);
  doc.text("2022-CSE-8491", leftMargin + 55, 165);

  doc.text("Under the Guidance of:", leftMargin + 12, 172);
  doc.text("Dr. R. K. Sharma, Professor & Guide", leftMargin + 55, 172);

  doc.text("Industry Mentor:", leftMargin + 12, 179);
  doc.text("PARTHASARATHY Radhakrishnan (ARN-348996)", leftMargin + 55, 179);

  doc.text("Academic Session:", leftMargin + 12, 186);
  doc.text("2025 – 2026", leftMargin + 55, 186);

  // Footer on Cover Page
  doc.setFont("times", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(goldPrimary[0], goldPrimary[1], goldPrimary[2]);
  doc.text("DEPARTMENT OF COMPUTER ENGINEERING", pageWidth / 2, 255, { align: "center" });
  doc.text("UNIVERSITY OF MUMBAI", pageWidth / 2, 262, { align: "center" });
  doc.setFontSize(9.5);
  doc.text("MUMBAI, MAHARASHTRA, INDIA — SEPTEMBER 2026", pageWidth / 2, 269, { align: "center" });

  console.log("Page 1 Cover generated.");

  // Write file out to test
  return doc.output("arraybuffer") as any;
}

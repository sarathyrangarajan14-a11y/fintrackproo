import * as jspdfMod from "jspdf";
import * as autoTableMod from "jspdf-autotable";

export const jsPDF = (jspdfMod as any).jsPDF || (jspdfMod as any).default || jspdfMod;
export const autoTable = (autoTableMod as any).default || autoTableMod;

export interface BlackBookContext {
  doc: any;
  pageWidth: number;
  pageHeight: number;
  leftMargin: number;
  rightMargin: number;
  contentWidth: number;
  topMargin: number;
  bottomMargin: number;
  curY: number;
  // Colors
  blackCoverBg: number[];
  goldPrimary: number[];
  goldSecondary: number[];
  textDark: number[];
  textBody: number[];
  textMuted: number[];
  emeraldPrimary: number[];
  emeraldDark: number[];
  boxBg: number[];
  borderLight: number[];
}

export function createBlackBookContext(): BlackBookContext {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const leftMargin = 25; // Mumbai University binding margin
  const rightMargin = 15;
  const contentWidth = pageWidth - leftMargin - rightMargin; // 170mm

  return {
    doc,
    pageWidth,
    pageHeight,
    leftMargin,
    rightMargin,
    contentWidth,
    topMargin: 20,
    bottomMargin: 20,
    curY: 20,
    blackCoverBg: [10, 15, 26],
    goldPrimary: [212, 175, 55],
    goldSecondary: [245, 158, 11],
    textDark: [15, 23, 42],
    textBody: [30, 41, 59],
    textMuted: [100, 116, 139],
    emeraldPrimary: [16, 185, 129],
    emeraldDark: [5, 150, 105],
    boxBg: [248, 250, 252],
    borderLight: [226, 232, 240],
  };
}

export function drawRunningHeaderFooter(ctx: BlackBookContext, pageNum: number, romanStr?: string, chapterTitle?: string) {
  if (pageNum <= 2) return; // Skip cover and inner title page

  const { doc, leftMargin, rightMargin, pageWidth, pageHeight, borderLight, textMuted } = ctx;

  // Running Header
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
  doc.text("Department of Computer Science, S.I.E.S College, Sion(W), Mumbai", leftMargin, pageHeight - 9);

  if (romanStr) {
    doc.text(romanStr, pageWidth - rightMargin, pageHeight - 9, { align: "right" });
  } else {
    doc.text(`Page ${pageNum}`, pageWidth - rightMargin, pageHeight - 9, { align: "right" });
  }
}

export function startNewPage(ctx: BlackBookContext, headerTitle?: string, romanStr?: string) {
  ctx.doc.addPage();
  ctx.curY = ctx.topMargin;
  const pageNum = ctx.doc.getNumberOfPages();
  drawRunningHeaderFooter(ctx, pageNum, romanStr, headerTitle);
}

export function drawChapterHeading(ctx: BlackBookContext, chNum: string, title: string) {
  const { doc, leftMargin, contentWidth, boxBg, emeraldDark, textDark } = ctx;
  doc.setFillColor(boxBg[0], boxBg[1], boxBg[2]);
  doc.roundedRect(leftMargin, ctx.curY, contentWidth, 18, 2, 2, "F");
  doc.setFillColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
  doc.roundedRect(leftMargin, ctx.curY, 4, 18, 1, 1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`${chNum}: ${title}`, leftMargin + 8, ctx.curY + 11.5);
  ctx.curY += 24;
}

export function drawSectionHeading(ctx: BlackBookContext, num: string, title: string, chapterTitle?: string) {
  if (ctx.curY > ctx.pageHeight - 35) {
    startNewPage(ctx, chapterTitle);
  }
  const { doc, leftMargin, emeraldDark, emeraldPrimary } = ctx;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
  doc.text(`${num} ${title}`, leftMargin, ctx.curY);

  doc.setDrawColor(emeraldPrimary[0], emeraldPrimary[1], emeraldPrimary[2]);
  doc.setLineWidth(0.4);
  doc.line(leftMargin, ctx.curY + 1.5, leftMargin + 30, ctx.curY + 1.5);
  ctx.curY += 7;
}

export function drawParagraph(ctx: BlackBookContext, text: string, chapterTitle?: string): number {
  const { doc, leftMargin, contentWidth, pageHeight, bottomMargin, textBody } = ctx;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(textBody[0], textBody[1], textBody[2]);
  const splitLines = doc.splitTextToSize(text, contentWidth);
  const blockHeight = splitLines.length * 4.4;

  if (ctx.curY + blockHeight > pageHeight - bottomMargin) {
    startNewPage(ctx, chapterTitle);
  }

  doc.text(splitLines, leftMargin, ctx.curY);
  ctx.curY += blockHeight + 3.5;
  return ctx.curY;
}

export function drawBullet(ctx: BlackBookContext, title: string, desc: string, chapterTitle?: string): number {
  if (ctx.curY > ctx.pageHeight - 30) {
    startNewPage(ctx, chapterTitle);
  }
  const { doc, leftMargin, contentWidth, emeraldPrimary, textDark, textBody } = ctx;
  doc.setFillColor(emeraldPrimary[0], emeraldPrimary[1], emeraldPrimary[2]);
  doc.circle(leftMargin + 2, ctx.curY - 1.2, 1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const titleText = `   ${title}: `;
  const titleWidth = doc.getTextWidth(titleText);
  doc.text(titleText, leftMargin, ctx.curY);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(textBody[0], textBody[1], textBody[2]);
  const splitDesc = doc.splitTextToSize(desc, contentWidth - titleWidth - 2);
  doc.text(splitDesc, leftMargin + titleWidth, ctx.curY);

  const blockHeight = Math.max(splitDesc.length * 4.4, 5);
  ctx.curY += blockHeight + 2;
  return ctx.curY;
}

export function drawCodeBlock(ctx: BlackBookContext, code: string, chapterTitle?: string): number {
  const lines = code.split("\n");
  const blockHeight = lines.length * 3.8 + 6;
  if (ctx.curY + blockHeight > ctx.pageHeight - ctx.bottomMargin) {
    startNewPage(ctx, chapterTitle);
  }

  const { doc, leftMargin, contentWidth } = ctx;
  doc.setFillColor(15, 23, 42); // slate 900
  doc.roundedRect(leftMargin, ctx.curY, contentWidth, blockHeight, 2, 2, "F");

  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(16, 185, 129); // emerald 500

  let lineY = ctx.curY + 5;
  lines.forEach((l) => {
    doc.text(l, leftMargin + 4, lineY);
    lineY += 3.8;
  });

  ctx.curY += blockHeight + 4;
  return ctx.curY;
}

export function drawDiagramBox(ctx: BlackBookContext, figNum: string, title: string, heightMm: number, renderContent: (x: number, y: number, w: number, h: number) => void, chapterTitle?: string) {
  if (ctx.curY + heightMm + 12 > ctx.pageHeight - ctx.bottomMargin) {
    startNewPage(ctx, chapterTitle);
  }

  const { doc, leftMargin, contentWidth, boxBg, borderLight, textMuted } = ctx;
  const boxY = ctx.curY;
  doc.setFillColor(boxBg[0], boxBg[1], boxBg[2]);
  doc.roundedRect(leftMargin, boxY, contentWidth, heightMm, 2, 2, "F");
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(leftMargin, boxY, contentWidth, heightMm, 2, 2, "S");

  renderContent(leftMargin, boxY, contentWidth, heightMm);

  ctx.curY = boxY + heightMm + 4;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`${figNum}: ${title}`, ctx.pageWidth / 2, ctx.curY, { align: "center" });
  ctx.curY += 8;
}

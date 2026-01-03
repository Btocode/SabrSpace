import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type PdfVariant = "minimal" | "comprehensive";

type BiodataLike = {
  id: number;
  token?: string | null;
  status?: string | null;
  fullName?: string | null;
  gender?: string | null;
  dateOfBirth?: string | Date | null;
  height?: string | null;
  weight?: string | null;
  complexion?: string | null;
  bloodGroup?: string | null;
  religion?: string | null;
  sect?: string | null;
  prayerFrequency?: string | null;
  quranReading?: string | null;
  educationLevel?: string | null;
  educationDetails?: string | null;
  profession?: string | null;
  occupation?: string | null;
  annualIncome?: string | null;
  workLocation?: string | null;
  fatherOccupation?: string | null;
  motherOccupation?: string | null;
  siblingsCount?: number | null;
  siblingsDetails?: string | null;
  maritalStatus?: string | null;
  preferredAgeMin?: number | null;
  preferredAgeMax?: number | null;
  preferredEducation?: string | null;
  preferredProfession?: string | null;
  preferredLocation?: string | null;
  otherPreferences?: string | null;
  aboutMe?: string | null;
  expectations?: string | null;
  hobbies?: string | null;
  languages?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

function safeText(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function formatDate(v: unknown): string {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(String(v));
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function calcAge(v: unknown): string {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(String(v));
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  if (age < 0 || age > 120) return "";
  return String(age);
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const t = text.trim();
  if (!t) return [];
  const words = t.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const candidate = line ? `${line} ${w}` : w;
    if (candidate.length > maxCharsPerLine) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildBiodataPdf(biodata: BiodataLike, variant: PdfVariant): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const colorText = rgb(0.11, 0.11, 0.12);
  const colorMuted = rgb(0.45, 0.45, 0.5);
  const colorPrimary = rgb(0.05, 0.45, 0.35);
  const colorCard = rgb(0.97, 0.98, 0.99);
  const colorBorder = rgb(0.87, 0.9, 0.92);

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.99, 0.99, 0.995) });

  // Header band
  const headerH = 90;
  page.drawRectangle({ x: 0, y: height - headerH, width, height: headerH, color: rgb(0.95, 0.99, 0.98) });
  page.drawRectangle({ x: 0, y: height - 6, width, height: 6, color: colorPrimary });

  const marginX = 44;

  const title = safeText(biodata.fullName) || "Biodata";
  const subtitle = variant === "minimal" ? "Minimal biodata (required essentials)" : "Comprehensive biodata";

  page.drawText(title, {
    x: marginX,
    y: height - 52,
    size: 20,
    font: fontBold,
    color: colorText,
  });

  page.drawText(subtitle, {
    x: marginX,
    y: height - 72,
    size: 10,
    font: fontRegular,
    color: colorMuted,
  });

  const badgeText = safeText(biodata.status) ? `Status: ${safeText(biodata.status)}` : "";
  if (badgeText) {
    const badgeW = 150;
    const badgeH = 22;
    page.drawRectangle({
      x: width - marginX - badgeW,
      y: height - 60,
      width: badgeW,
      height: badgeH,
      color: rgb(1, 1, 1),
      borderColor: colorBorder,
      borderWidth: 1,
    });
    page.drawText(badgeText, {
      x: width - marginX - badgeW + 10,
      y: height - 54,
      size: 9,
      font: fontBold,
      color: colorPrimary,
    });
  }

  // Helper to draw a section card
  let cursorY = height - headerH - 24;

  const drawSection = (heading: string, rows: Array<[string, string]>) => {
    const usableW = width - marginX * 2;

    const rowLines: Array<{ label: string; valueLines: string[] }> = rows
      .map(([l, v]) => ({ label: l, valueLines: wrapText(safeText(v) || "—", 52) }))
      .filter((r) => r.label.trim().length > 0);

    const lineH = 14;
    const headingH = 18;
    const padding = 14;
    const rowsH = rowLines.reduce((acc, r) => acc + Math.max(1, r.valueLines.length) * lineH, 0);
    const cardH = padding + headingH + 8 + rowsH + padding;

    if (cursorY - cardH < 50) {
      // no pagination for now (single page) - clamp
      return;
    }

    page.drawRectangle({
      x: marginX,
      y: cursorY - cardH,
      width: usableW,
      height: cardH,
      color: colorCard,
      borderColor: colorBorder,
      borderWidth: 1,
    });

    page.drawText(heading, {
      x: marginX + padding,
      y: cursorY - padding - 4,
      size: 12,
      font: fontBold,
      color: colorPrimary,
    });

    let y = cursorY - padding - headingH - 4;
    const colLabelX = marginX + padding;
    const colValueX = marginX + padding + 165;

    for (const r of rowLines) {
      page.drawText(r.label, {
        x: colLabelX,
        y,
        size: 10,
        font: fontBold,
        color: colorText,
      });

      const lines = r.valueLines.length ? r.valueLines : ["—"];
      let yy = y;
      for (const ln of lines) {
        page.drawText(ln, {
          x: colValueX,
          y: yy,
          size: 10,
          font: fontRegular,
          color: colorText,
        });
        yy -= lineH;
      }
      y -= Math.max(1, lines.length) * lineH;
    }

    cursorY -= cardH + 14;
  };

  const basicRows: Array<[string, string]> = [
    ["Full name", safeText(biodata.fullName)],
    ["Gender", safeText(biodata.gender)],
    ["Date of birth", formatDate(biodata.dateOfBirth)],
    ["Age", calcAge(biodata.dateOfBirth)],
    ["Height", safeText(biodata.height)],
    ["Weight", safeText(biodata.weight)],
    ["Blood group", safeText(biodata.bloodGroup)],
    ["Complexion", safeText(biodata.complexion)],
  ];

  drawSection("Basic information", basicRows);

  const locationRows: Array<[string, string]> = [
    ["Country", safeText(biodata.country)],
    ["State/Division", safeText(biodata.state)],
    ["City/District", safeText(biodata.city)],
    ["Address", safeText(biodata.address)],
  ];

  if (variant === "comprehensive") {
    drawSection("Location", locationRows);
  } else {
    drawSection("Location", locationRows.slice(0, 3));
  }

  // Minimal has only essentials
  if (variant === "comprehensive") {
    drawSection("Education & work", [
      ["Education level", safeText(biodata.educationLevel)],
      ["Education details", safeText(biodata.educationDetails)],
      ["Profession", safeText(biodata.profession)],
      ["Occupation", safeText(biodata.occupation)],
      ["Annual income", safeText(biodata.annualIncome)],
      ["Work location", safeText(biodata.workLocation)],
    ]);

    drawSection("Family", [
      ["Father occupation", safeText(biodata.fatherOccupation)],
      ["Mother occupation", safeText(biodata.motherOccupation)],
      ["Siblings", biodata.siblingsCount != null ? String(biodata.siblingsCount) : ""],
      ["Siblings details", safeText(biodata.siblingsDetails)],
    ]);

    drawSection("Religious practice", [
      ["Religion", safeText(biodata.religion)],
      ["Sect", safeText(biodata.sect)],
      ["Prayer", safeText(biodata.prayerFrequency)],
      ["Quran reading", safeText(biodata.quranReading)],
    ]);

    drawSection("Marriage preferences", [
      ["Marital status", safeText(biodata.maritalStatus)],
      ["Preferred age", biodata.preferredAgeMin && biodata.preferredAgeMax ? `${biodata.preferredAgeMin}–${biodata.preferredAgeMax}` : ""],
      ["Preferred education", safeText(biodata.preferredEducation)],
      ["Preferred profession", safeText(biodata.preferredProfession)],
      ["Preferred location", safeText(biodata.preferredLocation)],
      ["Other preferences", safeText(biodata.otherPreferences)],
    ]);

    drawSection("About", [
      ["About me", safeText(biodata.aboutMe)],
      ["Hobbies", safeText(biodata.hobbies)],
      ["Languages", safeText(biodata.languages)],
      ["Expectations", safeText(biodata.expectations)],
    ]);
  } else {
    // Minimal: the absolute must-haves for a matching intro
    drawSection("Quick overview", [
      ["Marital status", safeText(biodata.maritalStatus)],
      ["Education", safeText(biodata.educationLevel)],
      ["Profession", safeText(biodata.profession || biodata.occupation)],
      ["City", safeText(biodata.city)],
    ]);
  }

  // Footer
  page.drawText("Generated by SabrSpace", {
    x: marginX,
    y: 22,
    size: 9,
    font: fontRegular,
    color: colorMuted,
  });

  const idLine = `Biodata #${biodata.id}${biodata.token ? ` • Token: ${biodata.token}` : ""}`;
  page.drawText(idLine, {
    x: width - marginX - fontRegular.widthOfTextAtSize(idLine, 9),
    y: 22,
    size: 9,
    font: fontRegular,
    color: colorMuted,
  });

  return await pdfDoc.save();
}

// src/components/biodata/BiodataPdf.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

type Biodata = {
  id?: number;
  token: string;
  status: "draft" | "pending_review" | "published" | "rejected";
  fullName: string;
  gender: "male" | "female";
  dateOfBirth?: string | null;
  height?: string | null;
  weight?: string | null;
  complexion?: string | null;
  bloodGroup?: string | null;
  nationality?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  educationLevel?: string | null;
  educationDetails?: string | null;
  profession?: string | null;
  occupation?: string | null;
  annualIncome?: string | null;
  workLocation?: string | null;
  fatherName?: string | null;
  fatherOccupation?: string | null;
  motherName?: string | null;
  motherOccupation?: string | null;
  siblingsCount?: number | null;
  siblingsDetails?: string | null;
  religion?: string | null;
  sect?: string | null;
  religiousPractice?: string | null;
  prayerFrequency?: string | null;
  fasting?: string | null;
  quranReading?: string | null;
  maritalStatus?: string | null;
  willingToRelocate?: boolean | null;
  preferredAgeMin?: number | null;
  preferredAgeMax?: number | null;
  preferredEducation?: string | null;
  preferredProfession?: string | null;
  preferredLocation?: string | null;
  otherPreferences?: string | null;
  hobbies?: string | null;
  languages?: string | null;
  aboutMe?: string | null;
  expectations?: string | null;
  profilePhoto?: string | null;
  additionalPhotos?: string[] | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
};

const COLORS = {
  primary: "#4F46E5",
  ink: "#0F172A",
  muted: "#475569",
  faint: "#94A3B8",
  border: "#E2E8F0",
  paper: "#FFFFFF",
  background: "#FAFAFA",
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    color: COLORS.ink,
    backgroundColor: COLORS.background,
  },

  // Hero section
  hero: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 8,
  },
  heroMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  heroMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  heroMetaText: {
    fontSize: 9,
    color: COLORS.muted,
  },
  heroAbout: {
    fontSize: 10,
    lineHeight: 1.4,
    color: COLORS.ink,
    maxWidth: 400,
  },

  // Status badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 8,
    fontWeight: 600,
  },
  statusDraft: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.paper,
    color: COLORS.muted,
  },
  statusPending: {
    borderColor: "#C7D2FE",
    backgroundColor: "#EEF2FF",
    color: COLORS.primary,
  },
  statusPublished: {
    borderColor: "#BBF7D0",
    backgroundColor: "#ECFDF5",
    color: "#047857",
  },
  statusRejected: {
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    color: "#B91C1C",
  },

  // Stats row (4 small cards)
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 14,
    fontWeight: 800,
    marginTop: 6,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 4,
    textAlign: "center",
  },

  // Section grid
  grid2: {
    flexDirection: "row",
    gap: 16,
  },
  col: { flex: 1, gap: 16 },

  // Card
  card: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 9,
    color: COLORS.muted,
  },

  // Info row
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: {
    fontSize: 9,
    color: COLORS.muted,
    flex: 1,
  },
  infoValue: {
    fontSize: 9.5,
    color: COLORS.ink,
    textAlign: "right",
    flex: 1,
  },

  // Text block
  textBlock: {
    marginTop: 8,
    padding: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  textBlockLabel: {
    fontSize: 9,
    color: COLORS.muted,
    fontWeight: 700,
    marginBottom: 4,
  },
  textBlockContent: {
    fontSize: 9.5,
    lineHeight: 1.4,
    color: COLORS.ink,
  },

  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLORS.faint,
  },
});

function prettyEnum(value?: string | null) {
  if (!value) return "";
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function has(value: any) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function StatusBadge({ status }: { status: Biodata["status"] }) {
  let style = styles.statusBadge;
  let text = "";

  switch (status) {
    case "draft":
      style = { ...styles.statusBadge, ...styles.statusDraft };
      text = "Draft";
      break;
    case "pending_review":
      style = { ...styles.statusBadge, ...styles.statusPending };
      text = "Pending Review";
      break;
    case "published":
      style = { ...styles.statusBadge, ...styles.statusPublished };
      text = "Published";
      break;
    case "rejected":
      style = { ...styles.statusBadge, ...styles.statusRejected };
      text = "Rejected";
      break;
    default:
      style = { ...styles.statusBadge, ...styles.statusDraft };
      text = "Unknown";
  }

  return <Text style={style}>{text}</Text>;
}

function InfoRow({ label, value, last }: { label: string; value?: string | number | null; last?: boolean }) {
  if (!has(value)) return null;
  return (
    <View style={last ? [styles.infoRow, styles.infoRowLast] : styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{String(value)}</Text>
    </View>
  );
}

function TextBlock({ label, text }: { label: string; text?: string | null }) {
  if (!has(text)) return null;
  return (
    <View style={styles.textBlock}>
      <Text style={styles.textBlockLabel}>{label}</Text>
      <Text style={styles.textBlockContent}>{String(text)}</Text>
    </View>
  );
}

export function BiodataPdfDocument({
  biodata,
  variant = "comprehensive",
}: {
  biodata: Biodata;
  variant?: "minimal" | "comprehensive";
}) {
  const showLong = variant === "comprehensive";

  const location = [biodata.city, biodata.country].filter(Boolean).join(", ");
  const fullAddress = [biodata.address, biodata.city, biodata.state, biodata.country].filter(Boolean).join(", ");

  const ageRange =
    biodata.preferredAgeMin != null && biodata.preferredAgeMax != null
      ? `${biodata.preferredAgeMin} - ${biodata.preferredAgeMax} years`
      : null;

  const statGender = biodata.gender === "male" ? "Brother" : "Sister";
  const statMarital = biodata.maritalStatus ? prettyEnum(biodata.maritalStatus) : "Not specified";
  const statHeight = biodata.height || "—";
  const statPractice = biodata.religiousPractice ? prettyEnum(biodata.religiousPractice) : "Not specified";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <Text style={styles.heroTitle}>{biodata.fullName}</Text>
                <StatusBadge status={biodata.status} />
              </View>

              <View style={styles.heroMeta}>
                {biodata.profession && (
                  <View style={styles.heroMetaItem}>
                    <Text style={styles.heroMetaText}>{biodata.profession}</Text>
                  </View>
                )}
                {location && (
                  <View style={styles.heroMetaItem}>
                    <Text style={styles.heroMetaText}>{location}</Text>
                  </View>
                )}
                {biodata.religion && (
                  <View style={styles.heroMetaItem}>
                    <Text style={styles.heroMetaText}>{prettyEnum(biodata.religion)}</Text>
                  </View>
                )}
              </View>

              {showLong && biodata.aboutMe && (
                <Text style={styles.heroAbout}>{biodata.aboutMe}</Text>
              )}

              <View style={{ marginTop: 12 }}>
                <Text style={{ fontSize: 8, color: COLORS.faint }}>Token: {biodata.token}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statGender}</Text>
            <Text style={styles.statLabel}>Gender</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statMarital}</Text>
            <Text style={styles.statLabel}>Marital Status</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statHeight}</Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{statPractice}</Text>
            <Text style={styles.statLabel}>Practice</Text>
          </View>
        </View>

        {/* Details Grid */}
        <View style={styles.grid2}>
          <View style={styles.col}>
            {/* Basic Information */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Basic Information</Text>
                <Text style={styles.cardDesc}>Essential personal details</Text>
              </View>

              <InfoRow label="Gender" value={prettyEnum(biodata.gender)} />
              <InfoRow label="Marital Status" value={biodata.maritalStatus ? prettyEnum(biodata.maritalStatus) : null} />
              <InfoRow label="Height" value={biodata.height} />
              <InfoRow label="Weight" value={biodata.weight} />
              <InfoRow label="Complexion" value={biodata.complexion ? prettyEnum(biodata.complexion) : null} />
              <InfoRow label="Blood Group" value={biodata.bloodGroup} />
              <InfoRow label="Nationality" value={biodata.nationality} last />
            </View>

            {/* Contact & Location */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Contact & Location</Text>
                <Text style={styles.cardDesc}>Where and how to reach</Text>
              </View>

              <InfoRow label="Phone" value={biodata.phone} />
              <InfoRow label="Email" value={biodata.email} />
              <InfoRow label="Address" value={fullAddress || null} last />
            </View>
          </View>

          <View style={styles.col}>
            {/* Education */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Education</Text>
                <Text style={styles.cardDesc}>Educational background</Text>
              </View>

              <InfoRow label="Education Level" value={biodata.educationLevel ? prettyEnum(biodata.educationLevel) : null} last={!showLong || !has(biodata.educationDetails)} />
              {showLong && <TextBlock label="Education Details" text={biodata.educationDetails} />}
            </View>

            {/* Career & Income */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Career & Income</Text>
                <Text style={styles.cardDesc}>Professional background</Text>
              </View>

              <InfoRow label="Profession" value={biodata.profession} />
              <InfoRow label="Annual Income" value={biodata.annualIncome} />
              <InfoRow label="Work Location" value={biodata.workLocation} last={!showLong || !has(biodata.occupation)} />
              {showLong && <TextBlock label="Occupation Details" text={biodata.occupation} />}
            </View>
          </View>
        </View>

        {/* Family & Religious */}
        <View style={styles.grid2}>
          <View style={styles.col}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Family Information</Text>
                <Text style={styles.cardDesc}>Family background</Text>
              </View>

              <InfoRow label="Father's Occupation" value={biodata.fatherOccupation} />
              <InfoRow label="Mother's Occupation" value={biodata.motherOccupation} />
              <InfoRow label="Siblings" value={typeof biodata.siblingsCount === "number" ? `${biodata.siblingsCount}` : null} last={!showLong || !has(biodata.siblingsDetails)} />
              {showLong && <TextBlock label="Siblings Details" text={biodata.siblingsDetails} />}
            </View>
          </View>

          <View style={styles.col}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Religious Practice</Text>
                <Text style={styles.cardDesc}>Background and practices</Text>
              </View>

              <InfoRow label="Religion" value={biodata.religion ? prettyEnum(biodata.religion) : null} />
              <InfoRow label="Sect" value={biodata.sect ? prettyEnum(biodata.sect) : null} />
              <InfoRow label="Practice" value={biodata.religiousPractice ? prettyEnum(biodata.religiousPractice) : null} />
              <InfoRow label="Prayer Frequency" value={biodata.prayerFrequency ? prettyEnum(biodata.prayerFrequency) : null} />
              <InfoRow label="Fasting" value={biodata.fasting ? prettyEnum(biodata.fasting) : null} />
              <InfoRow label="Quran Reading" value={biodata.quranReading ? prettyEnum(biodata.quranReading) : null} last />
            </View>
          </View>
        </View>

        {/* About & Preferences */}
        <View style={styles.grid2}>
          <View style={styles.col}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>About</Text>
                <Text style={styles.cardDesc}>Personal notes</Text>
              </View>

              <TextBlock label="About Me" text={biodata.aboutMe} />
              <TextBlock label="Hobbies & Interests" text={biodata.hobbies} />
              <TextBlock label="Languages" text={biodata.languages} />
            </View>
          </View>

          <View style={styles.col}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Marriage Preferences</Text>
                <Text style={styles.cardDesc}>What they're looking for</Text>
              </View>

              <InfoRow label="Preferred Age Range" value={ageRange} />
              <InfoRow label="Preferred Education" value={biodata.preferredEducation} />
              <InfoRow label="Preferred Profession" value={biodata.preferredProfession} />
              <InfoRow label="Preferred Location" value={biodata.preferredLocation} />
              <InfoRow label="Willing To Relocate" value={biodata.willingToRelocate == null ? null : biodata.willingToRelocate ? "Yes" : "No"} last={!showLong || (!has(biodata.expectations) && !has(biodata.otherPreferences))} />

              {showLong && (
                <>
                  <TextBlock label="Expectations" text={biodata.expectations} />
                  <TextBlock label="Other Preferences" text={biodata.otherPreferences} />
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
          <Text>{biodata.fullName}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function downloadBeautifulBiodataPdf(
  biodata: Biodata,
  variant: "minimal" | "comprehensive" = "comprehensive"
) {
  const blob = await pdf(<BiodataPdfDocument biodata={biodata} variant={variant} />).toBlob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${(biodata.fullName || "biodata").trim().replaceAll(" ", "_")}-${variant}.pdf`;
  document.body.appendChild(a);
  a.click();

  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

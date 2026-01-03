import { useEffect, useMemo, useState } from "react";
import { useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { api } from "@shared/routes";
import { useToast } from "@/components/ui/toast-custom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  Copy,
  CheckCircle,
  User,
  MapPin,
  Heart,
  FileText,
  Mail,
  Phone,
  Building,
  Users,
  BookOpen,
  Calendar,
  Target,
} from "lucide-react";
import { downloadBeautifulBiodataPdf } from "@/components/biodata/BiodataPdf";

  

interface Biodata {
  id: number;
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
}

function prettyEnum(value?: string | null) {
  if (!value) return "";
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-right text-foreground">{String(value)}</div>
    </div>
  );
}

function TextBlock({ label, text }: { label: string; text?: string | null }) {
  if (!text) return null;
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">{text}</p>
      </div>
    </div>
  );
}

export default function BiodataView() {
  // Handle both /biodata/:id (authenticated) and /b/:token (public) routes
  const idParams = useParams<{ id: string }>();
  const tokenParams = useParams<{ token: string }>();

  const id = idParams?.id;
  const token = tokenParams?.token;
  const identifier = id || token; // Use either id or token
  const isPublicView = !!token; // If we have a token param, it's a public view

  const { addToast } = useToast();
  const [biodata, setBiodata] = useState<Biodata | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAuth, setHasAuth] = useState(false);

  useEffect(() => {
    try {
      setHasAuth(!!localStorage.getItem("auth_token"));
    } catch {
      setHasAuth(false);
    }
  }, []);

  useEffect(() => {
    const fetchBiodata = async () => {
      if (!identifier) return;

      setLoading(true);
      try {
        // For shared links (/b/:token), go directly to public route
        if (isPublicView) {
          const publicResponse = await fetch(api.publicBiodata.get.path.replace(":token", token!));
          if (publicResponse.ok) {
            const data = await publicResponse.json();
            setBiodata(data);
            return;
          }
        } else {
          // For authenticated views (/biodata/:id), try private route first
          const authToken = localStorage.getItem("auth_token");

          // First try the private route (owners + accessible biodata)
          const response = await fetch(api.biodata.get.path.replace(":id", id!), {
            headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
          });

          if (response.ok) {
            const data = await response.json();
            setBiodata(data);
            return;
          }

          // Fallback: public route (published only)
          const publicResponse = await fetch(api.publicBiodata.get.path.replace(":token", id!));
          if (publicResponse.ok) {
            const data = await publicResponse.json();
            setBiodata(data);
            return;
          }
        }

        setBiodata(null);
        addToast({
          type: "error",
          title: "Biodata not found",
          description: "The biodata you're looking for doesn't exist or is not accessible.",
          duration: 5000,
        });
      } catch (error) {
        console.error("Failed to fetch biodata:", error);
        setBiodata(null);
        addToast({
          type: "error",
          title: "Failed to load biodata",
          description: "Please try again later.",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBiodata();
  }, [identifier, id, token, isPublicView, addToast]);

  const shareUrl = useMemo(() => {
    if (!biodata) return "";
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/b/${biodata.token}`;
  }, [biodata]);

  // Don't show share section for public views (already a shared link)
  const showShareSection = !isPublicView && hasAuth;

  const getStatusBadge = (status: Biodata["status"]) => {
    const base = "border border-border/60";
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary" className={`${base} bg-muted/50`}>
            Draft
          </Badge>
        );
      case "pending_review":
        return (
          <Badge variant="secondary" className={`${base} bg-primary/10 text-primary`}>
            Pending Review
          </Badge>
        );
      case "published":
        return (
          <Badge variant="secondary" className={`${base} bg-emerald-500/10 text-emerald-700 dark:text-emerald-300`}>
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Published
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className={`${base} bg-destructive/10 text-destructive`}>
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className={base}>
            Unknown
          </Badge>
        );
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (!text) throw new Error("Missing link");
      if (!navigator?.clipboard) throw new Error("Clipboard not available");
      await navigator.clipboard.writeText(text);
      addToast({
        type: "success",
        title: "Copied!",
        description: "Biodata link copied to clipboard.",
        duration: 2500,
      });
    } catch {
      addToast({
        type: "error",
        title: "Failed to copy",
        description: "Please copy the link manually.",
        duration: 4000,
      });
    }
  };

  const handleShare = async () => {
    if (!biodata) return;
    if (!shareUrl) return;

    if ((navigator as any)?.share) {
      try {
        await (navigator as any).share({
          title: `${biodata.fullName}'s Biodata`,
          text: `Marriage biodata of ${biodata.fullName}`,
          url: shareUrl,
        });
        return;
      } catch {
        // fall through to copy
      }
    }
    await copyToClipboard(shareUrl);
  };

  const handleDownload = async (variant: "minimal" | "comprehensive" = "comprehensive") => {
    if (!biodata) return;
  
    try {
      // New beautiful PDF (client-side)
      await downloadBeautifulBiodataPdf(biodata, variant);
    } catch (error) {
      console.error("Beautiful PDF failed, falling back:", error);
  
      // Fallback to backend download if needed
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(
          api.biodata.download.path.replace(":id", String(biodata.id)) + `?variant=${variant}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (!response.ok) throw new Error("Backend PDF failed");
  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${(biodata.fullName || "biodata").trim().replaceAll(" ", "_")}-${variant}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch {
        addToast({
          type: "error",
          title: "Download failed",
          description: "Could not generate the PDF right now.",
          duration: 5000,
        });
      }
    }
  };
  

  const glass =
    "bg-background/70 backdrop-blur-md border border-border/50 shadow-sm hover:shadow-md transition-shadow";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-96 rounded-2xl" />
              <Skeleton className="h-96 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!biodata) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <h1 className="text-2xl font-bold">Biodata Not Found</h1>
            <p className="text-muted-foreground">
              The biodata you're looking for doesn't exist or is not accessible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Soft background accent (no custom classes needed) */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_10%_10%,rgba(99,102,241,0.12),transparent_60%),radial-gradient(50rem_30rem_at_90%_20%,rgba(245,158,11,0.10),transparent_55%)]" />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero */}
          <Card className={`overflow-hidden rounded-2xl ${glass}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-amber-500/10" />
              <CardContent className="relative p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">

                    {/* Title + meta */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">
                          {biodata.fullName}
                        </h1>
                        {getStatusBadge(biodata.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                        {biodata.profession && (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            <span className="text-sm">{biodata.profession}</span>
                          </div>
                        )}
                        {(biodata.city || biodata.country) && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{[biodata.city, biodata.country].filter(Boolean).join(", ")}</span>
                          </div>
                        )}
                        {biodata.religion && (
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm capitalize">{biodata.religion}</span>
                          </div>
                        )}
                      </div>

                      {biodata.aboutMe && (
                        <p className="text-foreground/80 max-w-2xl leading-relaxed">
                          {biodata.aboutMe}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                    {hasAuth && (
                      <>
                        <Button variant="outline" onClick={() => handleDownload("minimal")} className="gap-2">
                          <Download className="w-4 h-4" />
                          PDF
                        </Button>
                        <Button variant="outline" onClick={() => handleDownload("comprehensive")} className="gap-2">
                          <FileText className="w-4 h-4" />
                          Full PDF
                        </Button>
                      </>
                    )}
                    <Button onClick={handleShare} className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Share bar - only show for authenticated users viewing their own biodata */}
                {showShareSection && !!shareUrl && (
                  <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3 rounded-2xl border border-border/50 bg-background/60 backdrop-blur p-4">
                    <div className="text-sm text-muted-foreground flex-1">
                      Share link
                      <div className="font-mono text-xs md:text-sm text-foreground break-all mt-1">{shareUrl}</div>
                    </div>
                    <Button variant="outline" className="gap-2" onClick={() => copyToClipboard(shareUrl)}>
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={`rounded-2xl ${glass}`}>
              <CardContent className="p-5 text-center">
                <User className="w-7 h-7 mx-auto mb-2 text-primary" />
                <div className="text-xl font-bold font-serif">
                  {biodata.gender === "male" ? "Brother" : "Sister"}
                </div>
                <div className="text-xs text-muted-foreground">Gender</div>
              </CardContent>
            </Card>

            <Card className={`rounded-2xl ${glass}`}>
              <CardContent className="p-5 text-center">
                <Calendar className="w-7 h-7 mx-auto mb-2 text-primary" />
                <div className="text-xl font-bold font-serif">
                  {biodata.maritalStatus ? prettyEnum(biodata.maritalStatus) : "Not specified"}
                </div>
                <div className="text-xs text-muted-foreground">Marital Status</div>
              </CardContent>
            </Card>

            <Card className={`rounded-2xl ${glass}`}>
              <CardContent className="p-5 text-center">
                <Target className="w-7 h-7 mx-auto mb-2 text-primary" />
                <div className="text-xl font-bold font-serif">
                  {biodata.height || "—"}
                </div>
                <div className="text-xs text-muted-foreground">Height</div>
              </CardContent>
            </Card>

            <Card className={`rounded-2xl ${glass}`}>
              <CardContent className="p-5 text-center">
                <Heart className="w-7 h-7 mx-auto mb-2 text-primary" />
                <div className="text-xl font-bold font-serif">
                  {biodata.religiousPractice ? prettyEnum(biodata.religiousPractice) : "Not specified"}
                </div>
                <div className="text-xs text-muted-foreground">Practice</div>
              </CardContent>
            </Card>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic */}
            <Card className={`rounded-2xl ${glass}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>Essential personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <InfoRow label="Gender" value={prettyEnum(biodata.gender)} />
                <InfoRow label="Marital Status" value={biodata.maritalStatus ? prettyEnum(biodata.maritalStatus) : null} />
                <InfoRow label="Height" value={biodata.height} />
                <InfoRow label="Weight" value={biodata.weight} />
                <InfoRow label="Complexion" value={biodata.complexion ? prettyEnum(biodata.complexion) : null} />
                <InfoRow label="Blood Group" value={biodata.bloodGroup} />
                <InfoRow label="Nationality" value={biodata.nationality} />
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className={`rounded-2xl ${glass}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Contact & Location
                </CardTitle>
                <CardDescription>Where and how to reach</CardDescription>
              </CardHeader>
              <CardContent>
                {/* If you want to hide phone/email on public view, wrap these with `hasAuth && ...` */}
                <InfoRow label="Phone" value={biodata.phone} icon={<Phone className="w-4 h-4" />} />
                <InfoRow label="Email" value={biodata.email} icon={<Mail className="w-4 h-4" />} />
                <InfoRow
                  label="Address"
                  value={[biodata.address, biodata.city, biodata.state, biodata.country].filter(Boolean).join(", ") || null}
                  icon={<MapPin className="w-4 h-4" />}
                />
              </CardContent>
            </Card>
          </div>

          {/* Education & Career */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={`rounded-2xl ${glass}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Education
                </CardTitle>
                <CardDescription>Educational background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Education Level" value={biodata.educationLevel ? prettyEnum(biodata.educationLevel) : null} />
                <TextBlock label="Education Details" text={biodata.educationDetails} />
                {!biodata.educationLevel && !biodata.educationDetails && (
                  <div className="text-sm text-muted-foreground">Not provided.</div>
                )}
              </CardContent>
            </Card>

            <Card className={`rounded-2xl ${glass}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Career & Income
                </CardTitle>
                <CardDescription>Professional background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Profession" value={biodata.profession} />
                <InfoRow label="Annual Income" value={biodata.annualIncome} />
                <InfoRow label="Work Location" value={biodata.workLocation} />
                <TextBlock label="Occupation Details" text={biodata.occupation} />
                {!biodata.profession && !biodata.annualIncome && !biodata.workLocation && !biodata.occupation && (
                  <div className="text-sm text-muted-foreground">Not provided.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Family & Religious */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={`rounded-2xl ${glass}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Family Information
                </CardTitle>
                <CardDescription>Family background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Father's Occupation" value={biodata.fatherOccupation} />
                <InfoRow label="Mother's Occupation" value={biodata.motherOccupation} />
                <InfoRow label="Siblings" value={typeof biodata.siblingsCount === "number" ? `${biodata.siblingsCount}` : null} />
                <TextBlock label="Siblings Details" text={biodata.siblingsDetails} />
                {!biodata.fatherOccupation && !biodata.motherOccupation && biodata.siblingsCount == null && !biodata.siblingsDetails && (
                  <div className="text-sm text-muted-foreground">Not provided.</div>
                )}
              </CardContent>
            </Card>

            <Card className={`rounded-2xl ${glass}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Religious Practice
                </CardTitle>
                <CardDescription>Background and practices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Religion" value={biodata.religion ? prettyEnum(biodata.religion) : null} />
                <InfoRow label="Sect" value={biodata.sect ? prettyEnum(biodata.sect) : null} />
                <InfoRow label="Practice" value={biodata.religiousPractice ? prettyEnum(biodata.religiousPractice) : null} />
                <InfoRow label="Prayer Frequency" value={biodata.prayerFrequency ? prettyEnum(biodata.prayerFrequency) : null} />
                <InfoRow label="Fasting" value={biodata.fasting ? prettyEnum(biodata.fasting) : null} />
                <InfoRow label="Quran Reading" value={biodata.quranReading ? prettyEnum(biodata.quranReading) : null} />
                {!biodata.religion && !biodata.sect && !biodata.religiousPractice && !biodata.prayerFrequency && !biodata.fasting && !biodata.quranReading && (
                  <div className="text-sm text-muted-foreground">Not provided.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* About & Preferences */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={`rounded-2xl ${glass}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  About
                </CardTitle>
                <CardDescription>Personal notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextBlock label="About Me" text={biodata.aboutMe} />
                <TextBlock label="Hobbies & Interests" text={biodata.hobbies} />
                <TextBlock label="Languages" text={biodata.languages} />
                {!biodata.aboutMe && !biodata.hobbies && !biodata.languages && (
                  <div className="text-sm text-muted-foreground">Not provided.</div>
                )}
              </CardContent>
            </Card>

            <Card className={`rounded-2xl ${glass}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Marriage Preferences
                </CardTitle>
                <CardDescription>What they're looking for</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {biodata.preferredAgeMin != null && biodata.preferredAgeMax != null && (
                  <InfoRow
                    label="Preferred Age Range"
                    value={`${biodata.preferredAgeMin} - ${biodata.preferredAgeMax} years`}
                  />
                )}
                <InfoRow label="Preferred Education" value={biodata.preferredEducation} />
                <InfoRow label="Preferred Profession" value={biodata.preferredProfession} />
                <InfoRow label="Preferred Location" value={biodata.preferredLocation} />
                <InfoRow
                  label="Willing To Relocate"
                  value={biodata.willingToRelocate == null ? null : biodata.willingToRelocate ? "Yes" : "No"}
                />
                <TextBlock label="Expectations" text={biodata.expectations} />
                <TextBlock label="Other Preferences" text={biodata.otherPreferences} />
                {!biodata.preferredEducation &&
                  !biodata.preferredProfession &&
                  !biodata.preferredLocation &&
                  (biodata.preferredAgeMin == null || biodata.preferredAgeMax == null) &&
                  biodata.willingToRelocate == null &&
                  !biodata.expectations &&
                  !biodata.otherPreferences && <div className="text-sm text-muted-foreground">Not provided.</div>}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

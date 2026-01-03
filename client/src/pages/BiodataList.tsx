import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Download, Share2, Heart, Users, BookOpen, Shield } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { api } from "@shared/routes";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast-custom";

export default function BiodataList() {
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [downloadVariant, setDownloadVariant] = useState<"minimal" | "comprehensive">("comprehensive");
  const [downloadTargetId, setDownloadTargetId] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: biodata, isLoading } = useQuery({
    queryKey: ["biodata"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(api.biodata.list.path, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Failed to fetch biodata");
      return response.json();
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      pending_review: "outline",
      published: "default",
      rejected: "destructive",
    } as const;

    const labels = {
      draft: "Draft",
      pending_review: "Review",
      published: "Published",
      rejected: "Rejected",
    };

    const colors = {
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
      pending_review: "bg-blue-100 text-blue-800 border-blue-200",
      published: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <Badge
        variant={variants[status as keyof typeof variants] || "secondary"}
        className={colors[status as keyof typeof colors] || ""}
      >
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const sortedBiodata = useMemo(() => {
    const items = Array.isArray(biodata) ? [...biodata] : [];
    items.sort((a: any, b: any) => {
      const da = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
      const db = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
      return db - da;
    });
    return items;
  }, [biodata]);

  const featured = sortedBiodata[0] as any | undefined;

  const biodataCount = Array.isArray(biodata) ? biodata.length : 0;

  const downloadPdf = async (id: number, variant: "minimal" | "comprehensive") => {
    setIsDownloading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const url = `${api.biodata.download.path.replace(":id", String(id))}?variant=${variant}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        let details = "Failed to download PDF";
        try {
          const err = await res.json();
          if (err?.message) details = String(err.message);
        } catch {
          // ignore
        }
        throw new Error(details);
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `biodata-${id}-${variant}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);

      addToast({
        type: "success",
        title: "Downloaded",
        description: "Your biodata PDF has been downloaded.",
        duration: 2500,
      });
    } catch (e) {
      addToast({
        type: "error",
        title: "Download failed",
        description: e instanceof Error ? e.message : "Please try again",
        duration: 5000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const copyShareLink = async (token: string) => {
    const url = `${window.location.origin}/b/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      addToast({
        type: "success",
        title: "Copied!",
        description: "Share link copied to clipboard.",
        duration: 2500,
      });
    } catch {
      addToast({
        type: "error",
        title: "Copy failed",
        description: "Could not copy link. Please copy manually.",
        duration: 5000,
      });
    }
  };

  const calcAge = (dateOfBirth?: string | null) => {
    if (!dateOfBirth) return null;
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    return age;
  };

  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
              <p className="mt-4 text-muted-foreground">Loading your biodata...</p>
            </div>
          ) : null}

          {!isLoading ? (
            <>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Your Biodata Profiles</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Draft, publish, and share your marriage biodata.
                  </p>
                </div>

                <Link href="/biodata/create">
                  <Button className="gap-2 rounded-full">
                    <Plus className="w-4 h-4" />
                    Create biodata
                  </Button>
                </Link>
              </div>

              {featured ? (
                <Card className="mb-6 overflow-hidden border-primary/20">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-background to-amber-500/10" />
                      <div className="relative p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              {getStatusBadge(featured.status)}
                              <Badge variant="outline" className="rounded-full">
                                Active
                              </Badge>
                            </div>
                            <p className="mt-2 text-lg font-semibold text-foreground">
                              {featured.fullName || "Untitled Biodata"}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Keep it clear and honest. Strong biodata increases meaningful matches.
                            </p>

                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">Gender:</span> {featured.gender || "Not set"}
                              </div>
                              <div>
                                <span className="font-medium">Age:</span> {calcAge(featured.dateOfBirth) ?? "Not set"}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Link href={`/biodata/${featured.id}`}>
                              <Button variant="outline" size="sm" className="gap-1 h-9 rounded-full">
                                <Eye className="w-4 h-4" />
                                Preview
                              </Button>
                            </Link>
                            <Link href={`/biodata/create?edit=${featured.id}`}>
                              <Button variant="outline" size="sm" className="gap-1 h-9 rounded-full">
                                <Edit className="w-4 h-4" />
                                Continue
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              className="gap-1 h-9 rounded-full"
                              disabled={featured.status === "draft"}
                              onClick={() => {
                                setDownloadTargetId(featured.id);
                                setDownloadVariant("comprehensive");
                                setIsDownloadOpen(true);
                              }}
                            >
                              <Download className="w-4 h-4" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {/* Main Content */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left Side - Guidelines */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Key Islamic Principles */}
                  

              {/* Quick Tips */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    What to Remember
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-xs space-y-2 text-muted-foreground">
                    <li>• Be truthful and accurate</li>
                    <li>• Focus on character and faith</li>
                    <li>• Marriage is a sacred commitment</li>
                    <li>• Seek Allah's guidance</li>
                    <li>• Base on mutual respect</li>
                  </ul>
                </CardContent>
              </Card>

                  <Card className="border-border bg-background/70">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        How biodata helps you match better
                      </CardTitle>
                      <CardDescription className="text-xs">
                        A good biodata filters for compatibility early and reduces awkward back-and-forth.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="text-xs space-y-2 text-muted-foreground">
                        <li>• Clear essentials (age, location, education) save time for both families.</li>
                        <li>• Specific religious practice helps align expectations.</li>
                        <li>• Honest preferences reduce mismatches and ghosting.</li>
                        <li>
                          • Minimal PDF is best for first introductions; comprehensive is best after serious
                          interest.
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Side - Biodata Cards */}
                <div className="lg:col-span-8 space-y-6">
                  {biodataCount === 0 ? (
                    <Card className="glass-panel border-dashed border-2 border-primary/20">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-center space-y-4">
                          <div className="text-4xl">📝</div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">No biodata yet</h3>
                            <p className="text-muted-foreground text-sm max-w-sm">
                              Create your first marriage biodata profile to get started on your journey
                            </p>
                          </div>
                          <Link href="/biodata/create">
                            <Button className="gap-2 rounded-full">
                              <Plus className="w-4 h-4" />
                              Create Biodata
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                      {sortedBiodata.map((item: any) => (
                        <Card key={item.id} className="overflow-hidden border-primary/20">
                          <CardContent className="p-0">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-amber-500/10" />
                              <div className="relative p-5">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      {getStatusBadge(item.status)}
                                      <Badge variant="outline" className="rounded-full">
                                        Biodata
                                      </Badge>
                                    </div>
                                    <p className="mt-2 text-base font-semibold text-foreground">
                                      {item.fullName || "Untitled Biodata"}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      Updated {new Date(item.updatedAt ?? item.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>

                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">#{item.id}</p>
                                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1 text-xs text-muted-foreground border border-border">
                                      <Shield className="w-4 h-4 text-primary" />
                                      {item.status === "published" ? "Public" : "Private"}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                  <div>
                                    <span className="font-medium">Gender:</span> {item.gender || "Not set"}
                                  </div>
                                  <div>
                                    <span className="font-medium">Age:</span> {calcAge(item.dateOfBirth) ?? "Not set"}
                                  </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                  <Link href={`/biodata/${item.id}`}>
                                    <Button variant="outline" size="sm" className="gap-1 h-8 rounded-full">
                                      <Eye className="w-3 h-3" />
                                      View
                                    </Button>
                                  </Link>
                                  <Link href={`/biodata/create?edit=${item.id}`}>
                                    <Button variant="outline" size="sm" className="gap-1 h-8 rounded-full">
                                      <Edit className="w-3 h-3" />
                                      Edit
                                    </Button>
                                  </Link>

                                  {item.status === "published" && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 h-8 rounded-full"
                                        onClick={() => copyShareLink(item.token)}
                                      >
                                        <Share2 className="w-3 h-3" />
                                        Share
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 h-8 rounded-full"
                                        onClick={() => {
                                          setDownloadTargetId(item.id);
                                          setDownloadVariant("comprehensive");
                                          setIsDownloadOpen(true);
                                        }}
                                      >
                                        <Download className="w-3 h-3" />
                                        PDF
                                      </Button>
                                    </>
                                  )}

                                  {item.status !== "published" && item.status !== "draft" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="gap-1 h-8 rounded-full"
                                      onClick={() => {
                                        setDownloadTargetId(item.id);
                                        setDownloadVariant("comprehensive");
                                        setIsDownloadOpen(true);
                                      }}
                                    >
                                      <Download className="w-3 h-3" />
                                      PDF
                                    </Button>
                                  )}

                                  {item.status === "draft" && (
                                    <Button
                                      size="sm"
                                      className="gap-1 h-8 rounded-full"
                                      onClick={() => {
                                        addToast({
                                          type: "info",
                                          title: "Coming soon",
                                          description: "Publish functionality is coming soon!",
                                          duration: 3000,
                                        });
                                      }}
                                    >
                                      Publish
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Download biodata PDF</DialogTitle>
                    <DialogDescription>
                      Choose a format. Minimal is best for first introductions; comprehensive includes everything you
                      filled.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3">
                    <RadioGroup
                      value={downloadVariant}
                      onValueChange={(v) => {
                        if (v === "minimal" || v === "comprehensive") setDownloadVariant(v);
                      }}
                    >
                      <div className="flex items-start gap-3 rounded-lg border p-3">
                        <RadioGroupItem value="minimal" id="pdf-minimal" className="mt-1" />
                        <div>
                          <Label htmlFor="pdf-minimal" className="font-medium">
                            Minimal
                          </Label>
                          <p className="text-xs text-muted-foreground">Essentials only (safe to share widely).</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-lg border p-3">
                        <RadioGroupItem value="comprehensive" id="pdf-comprehensive" className="mt-1" />
                        <div>
                          <Label htmlFor="pdf-comprehensive" className="font-medium">
                            Comprehensive
                          </Label>
                          <p className="text-xs text-muted-foreground">All available sections for serious proposals.</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDownloadOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      disabled={!downloadTargetId || isDownloading}
                      onClick={async () => {
                        if (!downloadTargetId) return;
                        await downloadPdf(downloadTargetId, downloadVariant);
                        setIsDownloadOpen(false);
                      }}
                    >
                      {isDownloading ? "Preparing…" : "Download"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

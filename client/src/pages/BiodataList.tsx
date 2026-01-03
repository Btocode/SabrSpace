import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Eye, Edit, Download, Share2, Heart, Users, BookOpen, Shield } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { api } from "@shared/routes";

export default function BiodataList() {
  const { t } = useLanguage();

  const { data: biodata, isLoading } = useQuery({
    queryKey: ["biodata"],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(api.biodata.list.path, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error("Failed to fetch biodata");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pattern">
        <Navbar />
        <div className="container mx-auto p-6">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your biodata...</p>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Content - Left/Right Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Islamic Guidance */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quran Quote */}
              <Card className="glass-panel border-none">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="text-4xl font-arabic text-primary">﷽</div>
                  <blockquote className="text-sm text-muted-foreground italic">
                    "And one of His signs is that He created for you spouses from among yourselves so that you may find comfort in them..."
                  </blockquote>
                  <cite className="text-xs font-medium text-primary">- Surah Ar-Rum (30:21)</cite>
                </CardContent>
              </Card>

              {/* Key Islamic Principles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-serif">Islamic Guidance</h3>

                <Card className="border-amber-200/20 bg-amber-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-amber-800">Divine Union</h4>
                        <p className="text-xs text-amber-700">"And marry those among you who are single..." - Surah An-Nur (24:32)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/20 bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-blue-800">Trust & Protection</h4>
                        <p className="text-xs text-blue-700">"The believing men and women are allies..." - Surah At-Tawbah (9:71)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200/20 bg-purple-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-purple-800">Family Foundation</h4>
                        <p className="text-xs text-purple-700">"And it is He who created man from water..." - Surah Al-Furqan (25:54)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

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
            </div>

            {/* Right Side - Biodata Management */}
            <div className="lg:col-span-2 space-y-6">
              {/* Biodata List Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Biodata Profiles</h2>
                <Link href="/biodata/create">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    New
                  </Button>
                </Link>
              </div>

              {/* Biodata Grid */}
              {biodata?.length === 0 ? (
                <Card className="border-dashed border-2 border-primary/20">
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
                        <Button className="gap-2">
                          <Plus className="w-4 h-4" />
                          Create Biodata
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  {biodata?.map((item: any) => (
                    <Card key={item.id} className="glass-panel border-none">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{item.fullName || 'Untitled Biodata'}</CardTitle>
                            <CardDescription className="text-xs">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Gender:</span> {item.gender || 'Not set'}
                            </div>
                            <div>
                              <span className="font-medium">Age:</span> {item.dateOfBirth ? new Date().getFullYear() - new Date(item.dateOfBirth).getFullYear() : 'Not set'}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Link href={`/biodata/${item.id}`}>
                              <Button variant="outline" size="sm" className="gap-1 h-8">
                                <Eye className="w-3 h-3" />
                                View
                              </Button>
                            </Link>
                            <Link href={`/biodata/create?edit=${item.id}`}>
                              <Button variant="outline" size="sm" className="gap-1 h-8">
                                <Edit className="w-3 h-3" />
                                Edit
                              </Button>
                            </Link>
                            {item.status === 'published' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1 h-8"
                                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/b/${item.token}`)}
                                >
                                  <Share2 className="w-3 h-3" />
                                  Share
                                </Button>
                                <Button variant="outline" size="sm" className="gap-1 h-8">
                                  <Download className="w-3 h-3" />
                                  PDF
                                </Button>
                              </>
                            )}
                            {item.status === 'draft' && (
                              <Button
                                size="sm"
                                className="gap-1 h-8"
                                onClick={async () => {
                                  alert('Publish functionality coming soon!');
                                }}
                              >
                                Publish
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

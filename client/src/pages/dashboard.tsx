import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IslamicCard } from "@/components/ui/geometric-pattern";
import {
  Plus,
  Eye,
  MessageSquare,
  Users,
  Settings,
  Copy,
  ExternalLink,
  Bell,
  Loader2,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { buildUrl } from "@shared/routes";
import type { QuestionSet } from "@shared/schema";

interface DashboardStats {
  totalSets: number;
  totalResponses: number;
  totalViews: number;
}

export default function Dashboard() {
  const { user, isLoading: authLoading, logout } = useAuth();

  // Fetch question sets
  const { data: sets, isLoading: setsLoading } = useQuery<QuestionSet[]>({
    queryKey: ["/api/sets"],
    enabled: !!user,
  });

  // Fetch stats
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  // Fetch notifications
  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/api/login";
    return null;
  }

  const copyShareLink = (token: string) => {
    const url = `${window.location.origin}/s/${token}`;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <h1 className="text-xl font-bold">SabrSpace</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-xs px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              Demo Mode
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your question sets and responses</p>
          </div>
          <Button asChild className="islamic-button">
            <Link href="/dashboard/sets/new">
              <Plus className="w-4 h-4 mr-2" />
              Create New Set
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <IslamicCard className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalSets}</p>
                  <p className="text-sm text-muted-foreground">Question Sets</p>
                </div>
              </div>
            </IslamicCard>

            <IslamicCard className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalResponses}</p>
                  <p className="text-sm text-muted-foreground">Total Responses</p>
                </div>
              </div>
            </IslamicCard>

            <IslamicCard className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </IslamicCard>
          </div>
        )}

        {/* Question Sets */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Question Sets</h2>

          {setsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : sets?.length === 0 ? (
            <IslamicCard className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Question Sets Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first question set to start collecting meaningful responses.
              </p>
              <Button asChild className="islamic-button">
                <Link href="/dashboard/sets/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Set
                </Link>
              </Button>
            </IslamicCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sets?.map((set) => (
                <IslamicCard key={set.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{set.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {set.description || "No description"}
                      </p>
                    </div>
                    <Badge variant={set.isOpen ? "default" : "secondary"}>
                      {set.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Views</span>
                      <span className="font-medium">{set.views}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Responses</span>
                      <span className="font-medium">
                        {/* This would need to be calculated from responses */}
                        0
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Language</span>
                      <Badge variant="outline" className="text-xs">
                        {set.defaultLocale.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyShareLink(set.token)}
                      className="flex-1"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy Link
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/sets/${set.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/sets/${set.id}/responses`}>
                        View Responses
                      </Link>
                    </Button>
                  </div>
                </IslamicCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Navbar } from "@/components/Navbar";
import { useSets, useDeleteSet } from "@/hooks/use-sets";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  MessageCircle,
  Eye,
  MoreVertical,
  Share2,
  Trash2,
  ExternalLink,
  X,
  UserPlus,
  Heart,
  Users,
  Globe
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { t } = useLanguage();
  const { data: sets, isLoading: setsLoading } = useSets();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const deleteSet = useDeleteSet();
  const { toast } = useToast();
  const { isAnonymous, convertAnonymous, isConvertingAnonymous, user } = useAuth();

  console.log("Dashboard - isAnonymous:", isAnonymous, "user:", user);
  const { isOpen: showUpgradeModal, openModal: openUpgradeModal, closeModal: closeUpgradeModal } = useUpgradeModal();
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);

  // Manage banner visibility based on auth state and dismissal
  useEffect(() => {
    if (!isAnonymous) {
      setShowUpgradeBanner(false);
      return;
    }

    const bannerDismissed = localStorage.getItem('upgrade-banner-dismissed');
    setShowUpgradeBanner(!bannerDismissed);
  }, [isAnonymous]);
  const [upgradeData, setUpgradeData] = useState({ email: '', password: '' });

  const dismissBanner = () => {
    setShowUpgradeBanner(false);
    localStorage.setItem('upgrade-banner-dismissed', 'true');
  };

  const handleUpgradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await convertAnonymous(upgradeData);
      toast({
        title: "Upgrade initiated!",
        description: "Check your email to complete the account upgrade.",
      });
      closeUpgradeModal();
      setUpgradeData({ email: '', password: '' });
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/s/${token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "Link copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />

      {/* Anonymous User Migration Banner */}
      {isAnonymous && showUpgradeBanner && (
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-slate-600" />
                  <div className="text-sm">
                    <span className="text-slate-700 font-medium">Want to create a real account? </span>
                    <button
                      onClick={openUpgradeModal}
                      className="text-primary hover:text-primary/80 underline font-medium"
                    >
                      Sign up for full access
                    </button>
                  </div>
                </div>
              </div>
              <Button
                onClick={dismissBanner}
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-700 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Row */}
        <section>
          <h1 className="text-3xl font-bold mb-6 font-serif text-foreground">{t("dashboard.welcome")}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.totalSets")}
                </CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold text-primary">{stats?.totalSets}</div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-panel border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.totalResponses")}
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold text-amber-600">{stats?.totalResponses}</div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-panel border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.totalViews")}
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold text-teal-800">{stats?.totalViews}</div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sets List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-serif">{t("dashboard.sets")}</h2>
            <Link href="/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t("set.create")}
              </Button>
            </Link>
          </div>

          {setsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
            </div>
          ) : sets?.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
              <p className="text-muted-foreground mb-4">{t("dashboard.noSets")}</p>
              <Link href="/create">
                <Button variant="outline">{t("set.create")}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {sets?.map((set) => (
                <Card key={set.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/sets/${set.id}`} className="font-bold text-lg hover:text-primary hover:underline">
                          {set.title}
                        </Link>
                        {!set.isOpen && (
                          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">{t("dashboard.closed")}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{set.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                        <span>{format(new Date(set.createdAt!), "MMM d, yyyy")}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {set.views}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => copyLink(set.token)} title={t("dashboard.share")}>
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/sets/${set.id}`} className="cursor-pointer">
                              {t("dashboard.viewResponses")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`/s/${set.token}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              {t("dashboard.viewPublicPage")}
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteSet.mutate(set.id)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t("dashboard.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Anonymous User Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={closeUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Create Your Account
            </DialogTitle>
            <DialogDescription>
              Sign up for a permanent account to access all features and save your data.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpgradeSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modal-email">Email</Label>
              <Input
                id="modal-email"
                type="email"
                placeholder="your@email.com"
                value={upgradeData.email}
                onChange={(e) => setUpgradeData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-password">Password</Label>
              <Input
                id="modal-password"
                type="password"
                placeholder="••••••••"
                value={upgradeData.password}
                onChange={(e) => setUpgradeData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={isConvertingAnonymous}
              >
                {isConvertingAnonymous ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Upgrade Account
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={closeUpgradeModal}
              >
                Cancel
              </Button>
            </div>

            <Alert className="mt-4">
              <Heart className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Benefits of upgrading:</strong>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>• Publish and share your biodata</li>
                  <li>• Contribute to community discussions</li>
                  <li>• Access all premium features</li>
                  <li>• Data persists across devices</li>
                </ul>
              </AlertDescription>
            </Alert>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

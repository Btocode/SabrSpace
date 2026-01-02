import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Languages,
  Heart
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const [location] = useLocation();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'bn' : 'en');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="text-xl font-serif text-primary">س</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
            {t("app.name")}
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLanguage}
            className="text-muted-foreground hover:text-foreground font-medium"
          >
            <Languages className="w-4 h-4 mr-2" />
            {locale === 'en' ? 'English' : 'বাংলা'}
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button
                  variant={location === "/dashboard" ? "secondary" : "ghost"}
                  size="sm"
                  className="hidden md:flex"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  {t("nav.dashboard")}
                </Button>
              </Link>

              <Link href="/biodata">
                <Button
                  variant={location.startsWith("/biodata") ? "secondary" : "ghost"}
                  size="sm"
                  className="hidden md:flex"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Biodata
                </Button>
              </Link>

              <Link href="/create">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hidden md:flex"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {t("nav.create")}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer md:hidden">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t("nav.dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/biodata" className="cursor-pointer md:hidden">
                      <Heart className="mr-2 h-4 w-4" />
                      Biodata
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/create" className="cursor-pointer md:hidden">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t("nav.create")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button onClick={() => window.location.href = "/login"} variant="default" size="sm">
              {t("nav.login")}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

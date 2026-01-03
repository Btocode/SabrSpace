import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
import { Loader2, User, Users, LogIn, UserPlus, Mail, Heart, FileText, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const {
    user,
    login,
    register,
    loginAnonymously,
    loginWithOAuth,
    convertAnonymous,
    isAnonymous,
    isLoggingIn,
    isRegistering,
    isLoggingInAnonymously,
    isLoggingInWithOAuth,
    isConvertingAnonymous,
  } = useAuth();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [upgradeData, setUpgradeData] = useState({ email: "", password: "" });
  const [showUpgradeForm, setShowUpgradeForm] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(loginData);
      navigate("/dashboard");
    } catch {
      // handled by hook
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await register(registerData);
      // With Supabase, user might need email confirmation
      // For now, redirect to dashboard assuming confirmation is handled
      navigate("/dashboard");
    } catch {
      // handled by hook
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      console.log("Starting anonymous login...");
      const user = await loginAnonymously();
      console.log("Anonymous login successful, user:", user);
      console.log("Navigating to dashboard...");
      navigate("/dashboard");
    } catch (err: unknown) {
      console.error("Anonymous login failed:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Login failed: ${message}`);
    }
  };

  const handleUpgradeAnonymous = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await convertAnonymous(upgradeData);
      alert("Check your email to verify and complete your account upgrade!");
      setShowUpgradeForm(false);
    } catch (err: unknown) {
      console.error("Upgrade failed:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Upgrade failed: ${message}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Starting Google OAuth login...");
      await loginWithOAuth('google');
      // OAuth will redirect automatically
    } catch (err: unknown) {
      console.error("Google login failed:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Google login failed: ${message}`);
    }
  };

  // If user is already logged in anonymously, show different UI
  if (isAnonymous) {
    return (
      <div className="min-h-screen bg-pattern">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-border/50">
              <CardHeader className="text-center pb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4 border border-primary/20">
                  <Heart className="w-4 h-4 fill-primary text-primary" />
                  <span>Ready for More?</span>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground font-serif">
                  Unlock Your Marriage Journey
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  You're exploring with a temporary account. Create your permanent profile to find meaningful Islamic connections.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upgrade to Permanent Account */}
                  <div className="p-6 bg-gradient-to-br from-primary/5 via-background to-amber-500/5 rounded-xl border border-primary/20 hover:shadow-md transition-shadow">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Find Your Blessed Match</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Create your permanent Islamic marriage profile and connect with compatible partners.
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-primary">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span>Publish biodata</span>
                          </div>
                          <div className="flex items-center gap-2 text-amber-700">
                            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                            <span>AI matching</span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-700">
                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                            <span>Community access</span>
                          </div>
                          <div className="flex items-center gap-2 text-primary">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span>Data persistence</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowUpgradeForm(true)}
                        className="w-full bg-primary hover:bg-primary/90 rounded-full"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create Account
                      </Button>
                    </div>
                  </div>

                  {/* Continue Exploring */}
                  <div className="p-6 bg-gradient-to-br from-emerald-500/5 via-background to-primary/5 rounded-xl border border-emerald-500/20 hover:shadow-md transition-shadow">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Keep Exploring</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Continue discovering marriage features without commitment.
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <span>View sample biodatas</span>
                            <span className="text-muted-foreground/50">•</span>
                            <span>Test features</span>
                            <span className="text-muted-foreground/50">•</span>
                            <span>Browse community</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Your exploration data stays temporary
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate('/dashboard')}
                        variant="outline"
                        className="w-full border-emerald-500/20 text-emerald-700 hover:bg-emerald-50 rounded-full"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Continue Exploring
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Upgrade Modal */}
                <Dialog open={showUpgradeForm} onOpenChange={setShowUpgradeForm}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Upgrade to Permanent Account
                      </DialogTitle>
                      <DialogDescription>
                        Create a permanent account to unlock all features and save your data.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpgradeAnonymous} className="space-y-4">
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
                          onClick={() => setShowUpgradeForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>

                      <Alert className="mt-4">
                        <Mail className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          You'll receive an email verification link. Click it to complete your account upgrade.
                        </AlertDescription>
                      </Alert>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main login page for non-authenticated users
  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              <Heart className="w-4 h-4 fill-primary text-primary" />
              <span>Islamic Marriage Platform</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
              Begin Your Journey to Finding Love
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Join SabrSpace to create meaningful connections through Islamic marriage. Choose how you'd like to start your journey.
            </p>
          </div>

          {/* Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side: Explore Features */}
            <Card className="bg-gradient-to-br from-primary/5 via-background to-amber-500/5 border-primary/20 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-primary font-serif text-xl">Explore Marriage Features</CardTitle>
                <CardDescription className="text-base">
                  Discover how SabrSpace helps you find meaningful Islamic connections
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">What you can explore:</h3>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-primary/10">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground">Marriage Biodata</h4>
                        <p className="text-xs text-muted-foreground">Create Islamic marriage profiles with religious markers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-amber-500/10">
                      <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-amber-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground">Compatibility Questions</h4>
                        <p className="text-xs text-muted-foreground">Ask meaningful questions for relationship discovery</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-emerald-500/10">
                      <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground">Faith Community</h4>
                        <p className="text-xs text-muted-foreground">Connect with Muslims seeking blessed marriages</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleAnonymousLogin}
                    disabled={isLoggingInAnonymously}
                    className="w-full bg-primary hover:bg-primary/90 rounded-full h-12 text-base"
                  >
                    {isLoggingInAnonymously ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Heart className="w-5 h-5 mr-2" />
                    )}
                    Start Exploring
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    No registration required • Explore all features
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Right Side: Full Access */}
            <Card className="bg-white/80 backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/10 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Create Your Account</CardTitle>
                <CardDescription className="text-base">
                  Unlock all marriage features and find your blessed match
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Google OAuth */}
                <div className="space-y-3">
                  <Button
                    onClick={handleGoogleLogin}
                    disabled={isLoggingInWithOAuth}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                    variant="outline"
                  >
                    {isLoggingInWithOAuth ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-3" />
                    ) : (
                      <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    Continue with Google
                  </Button>
                </div>

                <Separator />

                {/* Email/Password Form */}
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your@email.com"
                          value={loginData.email}
                          onChange={(e) =>
                            setLoginData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoggingIn}
                      >
                        {isLoggingIn ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <>
                            <LogIn className="w-4 h-4 mr-2" />
                            Sign In
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="mt-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-firstName">First Name</Label>
                          <Input
                            id="register-firstName"
                            placeholder="John"
                            value={registerData.firstName}
                            onChange={(e) =>
                              setRegisterData((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-lastName">Last Name</Label>
                          <Input
                            id="register-lastName"
                            placeholder="Doe"
                            value={registerData.lastName}
                            onChange={(e) =>
                              setRegisterData((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="your@email.com"
                          value={registerData.email}
                          onChange={(e) =>
                            setRegisterData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={(e) =>
                            setRegisterData((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isRegistering}
                      >
                        {isRegistering ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <User className="w-4 h-4 mr-2" />
                        )}
                        Create Account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

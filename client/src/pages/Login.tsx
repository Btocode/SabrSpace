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
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
import { Loader2, User, Users, LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const {
    login,
    register,
    loginAnonymously,
    isLoggingIn,
    isRegistering,
    isLoggingInAnonymously,
  } = useAuth();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

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
      await register(registerData);
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

  return (
    <div className="min-h-screen bg-pattern flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-border/50">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">
                {t("login.welcome")}
              </CardTitle>
              <CardDescription>{t("login.choose")}</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Anonymous Login Option */}
              <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-medium text-primary font-serif">
                    {t("login.quickStart")}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("login.continueAnonymously")}
                </p>
                <Button
                  onClick={handleAnonymousLogin}
                  disabled={isLoggingInAnonymously}
                  className="w-full rounded-full"
                  variant="outline"
                >
                  {isLoggingInAnonymously ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Users className="w-4 h-4 mr-2" />
                  )}
                  Continue Anonymously
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/80 backdrop-blur-sm px-3 py-1 text-muted-foreground rounded-full border border-border/50 font-serif">
                    Or create an account
                  </span>
                </div>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                  <TabsTrigger value="login" className="text-sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-sm">
                    <User className="w-4 h-4 mr-2" />
                    Register
                  </TabsTrigger>
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
                        className="bg-white/50 border-border/50 focus:border-primary"
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
                        className="bg-white/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full rounded-full shadow-lg shadow-primary/20"
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
                          className="bg-white/50 border-border/50 focus:border-primary"
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
                          className="bg-white/50 border-border/50 focus:border-primary"
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
                        className="bg-white/50 border-border/50 focus:border-primary"
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
                        className="bg-white/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full rounded-full shadow-lg shadow-primary/20"
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
        </motion.div>
      </div>
    </div>
  );
}

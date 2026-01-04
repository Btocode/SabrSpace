import { useRoute } from "wouter";
import { usePublicSet, useSubmitResponse } from "@/hooks/use-responses";
import { useAddAnswererCurator } from "@/hooks/use-sets";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/components/ui/toast-custom";
import { Bismillah } from "@/components/Bismillah";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  CheckCircle2,
  Heart,
  Languages,
  Shield,
  MessageSquare,
  Crown,
  Sparkles,
  BookOpen,
  Eye,
  User,
  UserPlus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper to get/set localStorage for single-response and draft
function getLocalResponseKey(token: string) {
  return `sabrspace_response_${token}`;
}
function getLocalDraftKey(token: string) {
  return `sabrspace_draft_${token}`;
}

export default function PublicResponse() {
  const [, params] = useRoute("/s/:token");
  const token = params?.token || "";
  const { data: set, isLoading, error } = usePublicSet(token);
  const submitResponse = useSubmitResponse();
  const addCurator = useAddAnswererCurator();
  const { addToast } = useToast();
  const { t, locale, setLocale } = useLanguage();
  const [success, setSuccess] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showDraftWarning, setShowDraftWarning] = useState(false);
  const [curatorDialogOpen, setCuratorDialogOpen] = useState(false);
  const [curatorEmail, setCuratorEmail] = useState("");
  const curatorSuccessHandled = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm();

  // Watch attestation for validation if required
  const attestationChecked = watch("attestation");

  // On mount, check if already submitted (single response mode)
  useEffect(() => {
    if (set && !set.allowMultipleSubmissions) {
      const key = getLocalResponseKey(token);
      if (localStorage.getItem(key)) {
        setHasSubmitted(true);
      }
    }
  }, [set, token]);

  // Save draft to localStorage on change
  useEffect(() => {
    if (!set) return;
    const subscription = watch((values) => {
      localStorage.setItem(getLocalDraftKey(token), JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [set, token, watch]);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!set) return;
    const draft = localStorage.getItem(getLocalDraftKey(token));
    if (draft) {
      try {
        reset(JSON.parse(draft));
        setShowDraftWarning(true);
      } catch {}
    }
  }, [set, token, reset]);

  // Warn on reload if draft exists
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (localStorage.getItem(getLocalDraftKey(token))) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [token]);

  // Handle curator addition success/error
  useEffect(() => {
    if (addCurator.isSuccess && addCurator.data && !curatorSuccessHandled.current) {
      curatorSuccessHandled.current = true;
      addToast({
        type: "success",
        title: "Curator Added Successfully",
        description: addCurator.data.message,
        duration: 4000,
      });
      setCuratorEmail("");
      setCuratorDialogOpen(false);
      // The query invalidation in the hook should refresh the data
    }
  }, [addCurator.isSuccess, addCurator.data, addToast]);

  useEffect(() => {
    if (addCurator.isError && addCurator.error) {
      addToast({
        type: "error",
        title: "Failed to Add Curator",
        description:
          (addCurator.error as Error).message || "Please try again later.",
        duration: 5000,
      });
    }
  }, [addCurator.isError, addCurator.error, addToast]);

  // Reset the success handler when starting a new mutation
  useEffect(() => {
    if (addCurator.isPending) {
      curatorSuccessHandled.current = false;
    }
  }, [addCurator.isPending]);

  const handleAddCurator = async () => {
    if (!curatorEmail.trim()) {
      addToast({
        type: "error",
        title: "Email required",
        description: "Please enter a valid email address.",
        duration: 4000,
      });
      return;
    }

    addCurator.mutate({
      token,
      email: curatorEmail.trim(),
    });
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  if (error || !set)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        {t("response.notFound")}
      </div>
    );

  const onSubmit = (data: any) => {
    if (set && !set.allowMultipleSubmissions) {
      const key = getLocalResponseKey(token);
      if (localStorage.getItem(key)) {
        setHasSubmitted(true);
        addToast({
          type: "error",
          title: "Already Submitted",
          description: "You have already submitted a response for this set.",
          duration: 4000,
        });
        return;
      }
    }
    const answers = set.questions.map((q: any) => ({
      questionId: q.id,
      value: data[`question_${q.id}`],
    }));
    submitResponse.mutate(
      {
        token,
        data: {
          responderName: data.name || null,
          attestationAcceptedAt: data.attestation ? new Date() : null,
          localeUsed: locale,
          answers,
        },
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            title: "JazakAllah Khair",
            description: t("response.success"),
            duration: 4000,
          });
          setSuccess(true);
          // Mark as submitted for single-response mode
          if (set && !set.allowMultipleSubmissions) {
            localStorage.setItem(getLocalResponseKey(token), "1");
          }
          // Remove draft
          localStorage.removeItem(getLocalDraftKey(token));
        },
        onError: (error: any) => {
          addToast({
            type: "error",
            title: "Submission Failed",
            description: error.message || "Failed to submit response",
            duration: 5000,
          });
        },
      }
    );
  };

  if (hasSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full bg-white/90 rounded-xl shadow-lg p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">Response Already Submitted</h2>
          <p className="text-muted-foreground mb-4">You have already submitted a response for this set. Only one response is allowed.</p>
        </div>
      </div>
    );
  }
  if (success) {
      {showDraftWarning && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <div className="bg-amber-100 border border-amber-300 text-amber-900 rounded-b-xl px-4 py-2 text-sm shadow-md mt-0">
            <b>Warning:</b> You have a saved draft. Reloading or closing this page may cause you to lose unsaved data.
          </div>
        </div>
      )}
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm max-w-2xl w-full rounded-3xl shadow-xl border border-primary/20 overflow-hidden">
          {/* Split Layout - No Gap */}
          <div className="flex">
            {/* Left Section - Islamic Greeting */}
            <div className="flex-1 bg-gradient-to-br from-primary/5 via-primary/3 to-accent/5 p-8 text-center flex flex-col justify-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold font-serif text-primary mb-2">
                  جزاك الله خيراً
                </h2>
                <p className="text-xl text-primary font-medium">
                  JazakAllah Khair
                </p>
                <p className="text-muted-foreground leading-relaxed text-base mt-4">
                  {t("response.success")}
                </p>
              </div>
            </div>

            {/* Right Section - Islamic Blessings */}
            <div className="flex-1 bg-gradient-to-br from-emerald-50 via-primary/5 to-amber-50 p-8 flex flex-col justify-center">
              <div className="space-y-4">
                <p className="text-sm text-emerald-800 leading-relaxed italic text-center">
                  "May Allah bless you with the best partner and fill your life
                  with barakah and happiness. 🤲"
                </p>

                <p className="text-xs text-emerald-700 font-medium text-center mt-4">
                  May your sincere responses bring you closer to finding your
                  ideal Islamic marriage partner through divine guidance.
                </p>
              </div>
            </div>
          </div>

          {/* Powered by SabrSpace Banner */}
          <div className="bg-gradient-to-r from-primary/8 via-primary/4 to-accent/8 border-t border-primary/15 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-serif text-primary">س</span>
                </div>
                <span className="text-sm font-medium">
                  <span className="text-primary/60">Powered by </span>
                  <span className="text-primary font-semibold">SabrSpace</span>
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary hover:bg-primary/10 rounded-full px-4 py-1 h-auto text-xs font-medium bg-primary/20"
                onClick={() => window.open("https://sabrspace.com", "_blank")}
              >
                Explore SabrSpace
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern pb-24">
      {/* Soft background accent */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_10%_10%,rgba(99,102,241,0.08),transparent_60%),radial-gradient(50rem_30rem_at_90%_20%,rgba(245,158,11,0.06),transparent_55%)]" />

      {/* Top Header - Logo and Language Toggle */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/40 sm:static sm:border-0 sm:bg-transparent sm:backdrop-blur-none">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="text-xl font-serif text-primary">س</span>
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
              {t("app.name")}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocale(locale === "en" ? "bn" : "en")}
            className="bg-white/90 backdrop-blur-sm border-emerald-200 hover:bg-emerald-50 rounded-full px-3 py-1 text-xs sm:text-sm"
          >
            <Languages className="w-4 h-4 mr-2" />
            {locale === "en" ? "বাংলা" : "English"}
          </Button>
        </div>
      </div>

      <div className="relative max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto px-2 sm:px-4 pt-20 sm:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <Bismillah className="mb-3 sm:mb-6 opacity-80 text-2xl sm:text-3xl" />

          {/* Reorganized Left-Aligned Hero Header */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/8 via-background to-amber-500/8 border border-primary/15 p-4 sm:p-6 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-amber-500/3" />
            <div className="relative">
              {/* Add Curator Button - Top Right */}
              {!set.requireAttestation && !set.answererCuratorEmail && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2">
                  <Dialog
                    open={curatorDialogOpen}
                    onOpenChange={setCuratorDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/90 backdrop-blur-sm border-emerald-200 hover:bg-emerald-50 rounded-full shadow-sm"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Curator
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Question Curator</DialogTitle>
                        <DialogDescription>
                          Add someone who can view and help manage these
                          questions. They will receive access to review
                          responses.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="curator-email">Email Address</Label>
                          <Input
                            id="curator-email"
                            type="email"
                            placeholder="trusted.person@email.com"
                            value={curatorEmail}
                            onChange={(e) => setCuratorEmail(e.target.value)}
                            disabled={addCurator.isPending}
                          />
                          {set.answererCuratorEmail && (
                            <p className="text-xs text-muted-foreground">
                              Current answerer curator:{" "}
                              {set.answererCuratorEmail}
                            </p>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCuratorDialogOpen(false)}
                          disabled={addCurator.isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleAddCurator}
                          disabled={
                            addCurator.isPending || !curatorEmail.trim()
                          }
                          className="bg-primary hover:bg-primary/90"
                        >
                          {addCurator.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Adding...
                            </>
                          ) : (
                            "Add Curator"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Header Row */}
              <div className="mb-3 sm:mb-4">
                {/* Question Creator Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">
                    Questions by:{" "}
                  </span>
                  <span>
                    {set.questionerName ||
                      (set.userId ? "Family Member" : "Direct Party")}
                  </span>
                </div>

                {/* Communication & Curation Status */}
                <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-800 font-medium">
                    {set.requireAttestation
                      ? "Third person involved - Islamic oath required for authenticity"
                      : set.answererCuratorEmail
                        ? `${set.answererCuratorEmail} is actively curating this conversation.`
                        : "Direct communication - No third person involved in this Islamic marriage inquiry"}
                  </span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs">
                <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-2 text-muted-foreground border border-border/60">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">
                    {set.questions.length} Questions
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-2 text-muted-foreground border border-border/60">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">
                    {set.requireAttestation
                      ? "With Islamic Oath"
                      : "No Oath Required"}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-2 text-muted-foreground border border-border/60">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">
                    {set.views} Views
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 sm:space-y-8"
        >
          {/* Responder Info - Enhanced Name Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-primary/20 p-4 sm:p-6 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
              <div className="relative">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  {/* User avatar removed on mobile */}
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2 sm:mb-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2"
                      >
                        {t("response.name")}
                        {!set.allowAnonymous && (
                          <span className="text-destructive text-base">*</span>
                        )}
                        {set.allowAnonymous && (
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            (Optional)
                          </span>
                        )}
                      </Label>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Your name helps us provide personalized Islamic marriage guidance
                      </p>
                    </div>

                    <div className="relative">
                      <Input
                        id="name"
                        {...register("name", { required: !set.allowAnonymous })}
                        className="h-10 sm:h-12 text-sm sm:text-base bg-background/90 border-primary/30 focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground/60"
                        placeholder={
                          set.allowAnonymous
                            ? "Enter your name or leave blank for anonymous"
                            : "Enter your full name"
                        }
                      />
                      {errors.name && (
                        <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-destructive">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
                          <span>
                            Name is required for personalized guidance
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-2 sm:px-3 py-1 text-xs text-primary">
                      <Shield className="w-3 h-3" />
                      <span>Private & Confidential</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Islamic Oath & Privacy */}
          {/* Islamic Oath moved before submit button, privacy/trust and title removed */}

          {/* Dua Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 via-background to-primary/5 border border-emerald-200/50 p-3 sm:p-6 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-primary/5" />
              <div className="relative">
                <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-2 sm:mb-0">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                      <h3 className="font-semibold text-emerald-900 text-base sm:text-lg">
                        Dua for Guidance
                      </h3>
                      <div className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-emerald-100 px-2 py-0.5 sm:py-1 text-xs text-emerald-800 mt-1 sm:mt-0">
                        <Crown className="w-3 h-3" />
                        Islamic Prayer
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <blockquote className="text-emerald-900 font-serif text-sm sm:text-base leading-relaxed border-l-4 border-emerald-400 pl-3 sm:pl-4 italic">
                        "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا
                        قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا"
                      </blockquote>
                      <p className="text-xs sm:text-sm text-emerald-800/80">
                        <strong>Translation:</strong> "Our Lord, grant us from
                        among our spouses and offspring comfort to our eyes and
                        make us a leader for the righteous." (Surah Al-Furqan:
                        74)
                      </p>
                      <p className="text-xs text-emerald-700">
                        May Allah guide you to the best partner and bless your
                        journey with barakah and happiness. 🤲
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Questions - Compact Design */}
          <div className="space-y-3 sm:space-y-4">
            {set.questions.map((question: any, idx: number) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.05 }}
              >
                <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-br from-white/90 via-background to-white/70 border border-border/40 p-3 sm:p-4 shadow-md backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-transparent" />

                  <div className="relative space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold text-xs flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Label className="text-sm sm:text-base font-medium block text-foreground leading-snug">
                          {question.prompt}
                          {question.required && (
                            <span className="text-destructive ml-1.5 text-xs sm:text-sm">
                              *
                            </span>
                          )}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {question.required ? "Required" : "Optional"}
                        </p>
                      </div>
                    </div>

                    <Textarea
                      {...register(`question_${question.id}`, {
                        required: question.required,
                      })}
                      className="min-h-[64px] sm:min-h-[80px] max-h-[120px] resize-none bg-background/70 border-border/50 focus:border-primary/40 focus:ring-primary/10 text-xs sm:text-sm"
                      placeholder="Share your thoughts here..."
                    />
                    {errors[`question_${question.id}`] && (
                      <p className="text-xs text-destructive flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-destructive"></span>
                        Required
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Submit Section */}
          {set.requireAttestation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + set.questions.length * 0.1 }}
              className="pt-4"
            >
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-50 via-background to-emerald-50 border border-amber-200/50 p-3 sm:p-4 shadow-lg mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-emerald-500/5" />
                <div className="relative">
                  <Label
                    htmlFor="attestation"
                    className="font-serif text-sm sm:text-base leading-relaxed text-amber-900 cursor-pointer block"
                  >
                    <Checkbox
                      id="attestation"
                      {...register("attestation", { required: true })}
                      className="mr-2 sm:mr-3 border-amber-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                    "{t("response.attestation")}" 
                  </Label>
                  <p className="text-xs text-amber-700 mt-2">
                    By submitting, you affirm that all information provided is truthful and intended for Islamic marriage guidance only.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.81 + set.questions.length * 0.1 }}
            className="pt-2 sm:pt-8 pb-20"
          >
            <div className="bg-muted/30 border border-border/40 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                      Ready to Submit?
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      You can submit this form only once.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="h-10 sm:h-12 px-6 sm:px-8 rounded-lg bg-primary hover:bg-primary/90 text-base font-medium w-full sm:w-auto mt-3 sm:mt-0"
                    disabled={
                      submitResponse.isPending ||
                      (set.requireAttestation && !attestationChecked)
                    }
                  >
                    {submitResponse.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Heart className="w-5 h-5 mr-2" />
                    )}
                    {t("response.submit")}
                  </Button>
                </div>

                {set.requireAttestation && !attestationChecked && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-600 mt-3">
                    <Shield className="w-4 h-4" />
                    <span>
                      Please accept the Islamic oath above to submit your responses.
                    </span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Your information is handled with Islamic principles of trust and privacy.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}

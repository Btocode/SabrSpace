import { useRoute } from "wouter";
import { usePublicSet, useSubmitResponse } from "@/hooks/use-responses";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/components/ui/toast-custom";
import { Bismillah } from "@/components/Bismillah";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, Heart, Languages, Shield, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicResponse() {
  const [, params] = useRoute("/s/:token");
  const token = params?.token || "";
  const { data: set, isLoading, error } = usePublicSet(token);
  const submitResponse = useSubmitResponse();
  const { addToast } = useToast();
  const { t, locale, setLocale } = useLanguage();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm();

  // Watch attestation for validation if required
  const attestationChecked = watch("attestation");

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (error || !set) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
      Set not found or closed.
    </div>
  );

  const onSubmit = (data: any) => {
    const answers = set.questions.map((q: any) => ({
      questionId: q.id,
      value: data[`question_${q.id}`]
    }));

    submitResponse.mutate({
      token,
      data: {
        responderName: data.name || null,
        attestationAcceptedAt: data.attestation ? new Date() : null,
        localeUsed: locale,
        answers
      }
    }, {
      onSuccess: () => {
        addToast({
          type: "success",
          title: "JazakAllah Khair",
          description: "Your response has been submitted successfully",
          duration: 4000
        });
        setSuccess(true);
      },
      onError: (error: any) => {
        addToast({
          type: "error",
          title: "Submission Failed",
          description: error.message || "Failed to submit response",
          duration: 5000
        });
      }
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white/90 backdrop-blur-sm max-w-md w-full p-8 rounded-3xl shadow-2xl text-center space-y-6 border border-primary/20"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold font-serif text-primary">جزاك الله خيراً</h2>
            <p className="text-lg text-primary font-medium">JazakAllah Khair</p>
            <p className="text-muted-foreground leading-relaxed">
              Your thoughtful response has been submitted successfully. May Allah reward you abundantly.
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg rounded-full"
              size="lg"
            >
              <Heart className="w-4 h-4 mr-2" />
              Submit Another Response
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern pb-20">

      {/* Top Language Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocale(locale === 'en' ? 'bn' : 'en')}
          className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:bg-emerald-50"
        >
          <Languages className="w-4 h-4 mr-2" />
          {locale === 'en' ? 'বাংলা' : 'English'}
        </Button>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Bismillah className="mb-8 opacity-80" />

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border/50">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-4">{set.title}</h1>
            {set.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">{set.description}</p>
            )}

            {/* Stats */}
            <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">{set.questions.length} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">{set.requireAttestation ? 'Oath Required' : 'No Oath'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Responder Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-base font-semibold text-foreground/80">
                  {t("response.name")}
                  {!set.allowAnonymous && <span className="text-destructive ml-1">*</span>}
                  {set.allowAnonymous && <span className="text-muted-foreground ml-2">(Optional)</span>}
                </Label>
                <Input
                  id="name"
                  {...register("name", { required: !set.allowAnonymous })}
                  className="mt-1.5"
                  placeholder={set.allowAnonymous ? "Enter your name or leave blank" : "Enter your name"}
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">Name is required</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Attestation */}
          {set.requireAttestation && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
              <Checkbox
                id="attestation"
                {...register("attestation", { required: true })}
                className="mt-1 border-amber-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
              />
              <Label htmlFor="attestation" className="font-serif text-lg leading-relaxed text-amber-900 cursor-pointer">
                "{t("response.attestation")}"
              </Label>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {set.questions.map((question: any, idx: number) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="space-y-3">
                  <Label className="text-lg font-medium block">
                    <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                    {question.prompt}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Textarea
                    {...register(`question_${question.id}`, { required: question.required })}
                    className="min-h-[120px] resize-y bg-muted/20"
                    placeholder="Type your answer here..."
                  />
                  {errors[`question_${question.id}`] && (
                    <p className="text-xs text-destructive">This question is required</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 pb-12">
            <Button
              type="submit"
              size="lg"
              className="w-full text-lg h-14 rounded-xl shadow-xl shadow-primary/20"
              disabled={submitResponse.isPending || (set.requireAttestation && !attestationChecked)}
            >
              {submitResponse.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {t("response.submit")}
            </Button>
            {set.requireAttestation && !attestationChecked && (
              <p className="text-center text-sm text-amber-600 mt-3">
                Please accept the oath above to submit.
              </p>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
}

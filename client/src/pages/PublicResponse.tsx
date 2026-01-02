import { useRoute } from "wouter";
import { usePublicSet, useSubmitResponse } from "@/hooks/use-responses";
import { useLanguage } from "@/lib/i18n";
import { Bismillah } from "@/components/Bismillah";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicResponse() {
  const [, params] = useRoute("/s/:token");
  const token = params?.token || "";
  const { data: set, isLoading, error } = usePublicSet(token);
  const submitResponse = useSubmitResponse();
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
        attestationAcceptedAt: data.attestation ? new Date().toISOString() : null,
        localeUsed: locale,
        answers
      }
    }, {
      onSuccess: () => setSuccess(true)
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card max-w-md w-full p-8 rounded-2xl shadow-xl text-center space-y-6 border border-primary/20"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-primary">JazakAllah Khair</h2>
          <p className="text-muted-foreground">
            {t("response.success")}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Submit Another
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern pb-20">
      {/* Top Language Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" size="sm" onClick={() => setLocale(locale === 'en' ? 'bn' : 'en')}>
          {locale === 'en' ? 'বাংলা' : 'English'}
        </Button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-12">
        <Bismillah className="mb-8" />

        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary">{set.title}</h1>
          <p className="text-lg text-muted-foreground">{set.description}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Responder Info */}
          <Card className="border-none shadow-md">
            <CardContent className="p-6 space-y-4">
              {!set.allowAnonymous && (
                <div>
                  <Label htmlFor="name">{t("response.name")} <span className="text-destructive">*</span></Label>
                  <Input 
                    id="name" 
                    {...register("name", { required: true })} 
                    className="mt-1.5"
                    placeholder="Enter your name"
                  />
                </div>
              )}
              {set.allowAnonymous && (
                <div>
                  <Label htmlFor="name">{t("response.name")} (Optional)</Label>
                  <Input 
                    id="name" 
                    {...register("name")} 
                    className="mt-1.5"
                    placeholder="Enter your name or leave blank"
                  />
                </div>
              )}
            </CardContent>
          </Card>

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
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-3">
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
                  </CardContent>
                </Card>
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
              ) : t("response.submit")}
            </Button>
            {set.requireAttestation && !attestationChecked && (
              <p className="text-center text-sm text-amber-600 mt-3">
                Please accept the oath above to submit.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

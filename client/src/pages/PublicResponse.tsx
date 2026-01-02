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
import { Loader2, CheckCircle2, Languages, User, Send, Heart, ShieldCheck } from "lucide-react";
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
  
  const attestationChecked = watch("attestation");

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="text-primary"
      >
        <Loader2 className="w-12 h-12" />
      </motion.div>
    </div>
  );

  if (error || !set) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center space-y-4">
      <ShieldCheck className="w-16 h-16 text-muted-foreground/30" />
      <h2 className="text-2xl font-serif text-primary">Content Unavailable</h2>
      <p className="text-muted-foreground max-w-sm">
        This question set is either private, closed, or the link has expired.
      </p>
      <Button variant="outline" onClick={() => window.location.href = "/"}>Return Home</Button>
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
      onSuccess: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSuccess(true);
      }
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0l50 50-50 50L0 50z' fill='%230f766e'/%3E%3C/svg%3E")` }} />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-card max-w-lg w-full p-12 rounded-[3rem] shadow-2xl text-center space-y-8 border border-primary/10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-amber-400 to-teal-500" />
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-serif text-primary">JazakAllah Khair</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t("response.success")}
            </p>
          </div>
          <div className="pt-4">
            <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full px-10 h-12">
              Submit Another Response
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-primary/20">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l40 40-40 40L0 40z' fill='%230f766e' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/5 py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-serif text-primary tracking-tight">SabrSpace</div>
        <Button variant="ghost" size="sm" className="rounded-full gap-2" onClick={() => setLocale(locale === 'en' ? 'bn' : 'en')}>
          <Languages className="w-4 h-4" />
          {locale === 'en' ? 'বাংলা' : 'English'}
        </Button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Bismillah className="mb-12 opacity-80" />
        </motion.div>

        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary tracking-tight leading-tight">{set.title}</h1>
          <p className="text-xl text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">{set.description}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Responder Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-primary/60 font-serif text-sm tracking-widest uppercase">
              <User className="w-4 h-4" />
              <span>Personal Details</span>
            </div>
            <Card className="border-primary/10 shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lg font-medium">
                    {t("response.name")} 
                    {set.allowAnonymous ? <span className="text-muted-foreground text-sm font-normal ml-2">(Optional)</span> : <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Input 
                    id="name" 
                    {...register("name", { required: !set.allowAnonymous })} 
                    className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-lg px-6"
                    placeholder={set.allowAnonymous ? "Share your name or remain anonymous" : "Enter your full name"}
                  />
                  {errors.name && <p className="text-xs text-destructive ml-1 font-medium">Name is required</p>}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Attestation */}
          {set.requireAttestation && (
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-teal-50/50 border border-teal-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left transition-all duration-300"
            >
              <Checkbox 
                id="attestation" 
                {...register("attestation", { required: true })}
                className="w-8 h-8 rounded-xl border-teal-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 transition-transform duration-300"
              />
              <div className="space-y-3">
                <Label htmlFor="attestation" className="font-serif text-2xl leading-relaxed text-teal-900 cursor-pointer block">
                  "{t("response.attestation")}"
                </Label>
                <p className="text-sm text-teal-600/70 font-medium">By checking this, you solemnly pledge to provide only the truth.</p>
              </div>
            </motion.div>
          )}

          {/* Questions */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-primary/60 font-serif text-sm tracking-widest uppercase mb-4">
              <Heart className="w-4 h-4" />
              <span>Heart of the Conversation</span>
            </div>
            
            {set.questions.map((question: any, idx: number) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Card className="border-primary/5 shadow-lg shadow-primary/5 rounded-[2.5rem] hover:shadow-xl transition-all duration-500 overflow-hidden bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-10 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-accent font-serif font-bold text-lg mb-2">
                        <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm">{idx + 1}</span>
                      </div>
                      <Label className="text-2xl font-serif text-foreground leading-snug block">
                        {question.prompt}
                        {question.required && <span className="text-destructive ml-2 font-sans">*</span>}
                      </Label>
                    </div>
                    
                    <Textarea 
                      {...register(`question_${question.id}`, { required: question.required })}
                      className="min-h-[160px] resize-none bg-muted/20 border-none rounded-3xl p-8 text-xl leading-relaxed focus-visible:ring-2 focus-visible:ring-primary/10 transition-all placeholder:text-muted-foreground/40"
                      placeholder="Share your thoughts with sincerity..."
                    />
                    
                    {errors[`question_${question.id}`] && (
                      <p className="text-sm text-destructive font-medium mt-2 ml-2">Sincerity requires an answer here</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>

          <div className="pt-12 pb-20">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-2xl h-20 rounded-[2.5rem] shadow-2xl shadow-primary/20 group hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300 font-serif"
              disabled={submitResponse.isPending || (set.requireAttestation && !attestationChecked)}
            >
              {submitResponse.isPending ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <span className="flex items-center gap-3">
                  {t("response.submit")}
                  <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              )}
            </Button>
            {set.requireAttestation && !attestationChecked && (
              <p className="text-center text-base text-amber-600 mt-6 font-serif italic">
                Awaiting your pledge of truth before submission.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

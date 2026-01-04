import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertQuestionSetSchema, insertQuestionSchema } from "@shared/schema";
import { useCreateSet } from "@/hooks/use-sets";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
import { useToast, errorToast } from "@/components/ui/toast-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, ArrowRight, Save, GripVertical, AlertCircle, Mail, CheckCircle, Share2, Copy } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

// Combined schema for the form - updated for curator system
const formSchema = z.object({
  questionerName: z.string().min(1, "Questioner name is required"),
  curatorEmail: z.union([z.string().email(), z.literal("")]).optional(),
  isOpen: z.boolean(),
  requireAttestation: z.boolean(),
  allowAnonymous: z.boolean(),
  allowMultipleSubmissions: z.boolean(),
  defaultLocale: z.string(),
  questions: z.array(z.object({
    tempId: z.string().optional(),
    type: z.enum(['TEXT', 'CHOICE']),
    prompt: z.string().min(1, "Question prompt is required"),
    required: z.boolean(),
    order: z.number(),
    options: z.array(z.string()).optional()
  })).min(1, "At least one question is required")
});

type FormData = z.infer<typeof formSchema>;

export function CreateSetForm({ setCreatedSetUrl, createdSetUrl }: { setCreatedSetUrl?: (url: string | null) => void, createdSetUrl?: string | null }) {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const createSet = useCreateSet();
  const [, setLocation] = useLocation();
  const [showAnonymousPrompt, setShowAnonymousPrompt] = useState(false);
  const [anonymousEmail, setAnonymousEmail] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [lastSaveType, setLastSaveType] = useState<'regular' | 'anonymous' | null>(null);
  // If setCreatedSetUrl is not provided, fallback to local state for backward compatibility
  const [localCreatedSetUrl, localSetCreatedSetUrl] = useState<string | null>(null);
  const url = createdSetUrl !== undefined ? createdSetUrl : localCreatedSetUrl;

  useEffect(() => {
    console.log("CreateSetForm - Auth state changed:", { isAuthenticated, user });
  }, [isAuthenticated, user]);

  // Handle mutation success/error with toasts
  useEffect(() => {
    if (createSet.isSuccess && lastSaveType && createSet.data) {
      addToast({
        type: "success",
        title: "Success",
        description: "Question set saved successfully",
        duration: 4000
      });
      // Generate the share URL
      const shareUrl = `${window.location.origin}/s/${createSet.data.token}`;
      if (setCreatedSetUrl) {
        setCreatedSetUrl(shareUrl);
      } else {
        localSetCreatedSetUrl(shareUrl);
      }
      setLastSaveType(null);
    }
  }, [createSet.isSuccess, lastSaveType, createSet.data, addToast]);

  useEffect(() => {
    if (createSet.isError && createSet.error) {
      addToast({
        type: "error",
        title: "Save Failed",
        description: (createSet.error as Error).message || "Failed to save question set",
        duration: 5000
      });
      setLastSaveType(null);
    }
  }, [createSet.isError, createSet.error, addToast]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validate on change to show errors immediately
    defaultValues: {
      questionerName: "",
      curatorEmail: "",
      isOpen: true,
      requireAttestation: false,
      allowAnonymous: false,
      allowMultipleSubmissions: false,
      defaultLocale: "en",
      questions: [
        { type: "TEXT", prompt: "", required: true, order: 0 }
      ]
    }
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions"
  });

  const onSubmit = (data: FormData) => {
    console.log("=== FORM SUBMIT STARTED ===");
    console.log("Form submitted with data:", data);
    console.log("Form errors:", form.formState.errors);
    console.log("User authenticated:", isAuthenticated, "User:", user);

    // Check if user is anonymous
    if (!isAuthenticated || user?.email === "Anonymous") {
      console.log("User is anonymous, showing prompt");
      setShowAnonymousPrompt(true);
      return;
    }

    console.log("User is authenticated, proceeding with save");

    // Ensure order is correct and remove form-specific fields
    const formattedData = {
      ...data,
      questions: data.questions.map((q, idx) => ({
        type: q.type,
        prompt: q.prompt,
        options: q.options,
        required: q.required,
        order: idx
      }))
    };

    console.log("Submitting formatted data:", formattedData);

    console.log("Submitting formatted data:", formattedData);
    setLastSaveType('regular');
    createSet.mutate(formattedData);
  };

  const handleAnonymousSave = () => {
    console.log("Anonymous save clicked");
    if (!anonymousEmail.trim()) {
      errorToast(t("set.emailRequired"), t("set.emailRequired"));
      return;
    }

    console.log("Anonymous email provided:", anonymousEmail);

    const data = form.getValues();
    console.log("Form data:", data);

    const formattedData = {
      ...data,
      questions: data.questions.map((q, idx) => ({
        type: q.type,
        prompt: q.prompt,
        options: q.options,
        required: q.required,
        order: idx
      }))
    };

    console.log("Formatted data for anonymous save:", formattedData);

    console.log("Submitting anonymous formatted data:", formattedData);
    setLastSaveType('anonymous');
    createSet.mutate(formattedData);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    console.log("Moving from", draggedIndex, "to", dropIndex);

    // Get current questions
    const currentQuestions = form.getValues("questions");
    const newQuestions = [...currentQuestions];

    // Remove dragged item and insert at new position
    const [draggedItem] = newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(dropIndex, 0, draggedItem);

    // Update form with reordered questions
    form.setValue("questions", newQuestions);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (url) {
    return (
      <div className="max-w-lg w-full mx-auto px-2 sm:px-0">
        <Card className="shadow-xl border-border/50">
          <CardContent className="p-6 sm:p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-primary font-serif">{t("set.savePrompt")}</h3>
            <p className="text-muted-foreground mb-4 sm:mb-6 text-base sm:text-lg">
              {t("set.saveDesc")}
            </p>
            <div className="bg-primary/5 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 border border-primary/20 w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3">
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <span className="font-medium text-base sm:text-lg text-primary font-serif">Share Link</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                <Input
                  value={url}
                  readOnly
                  className="flex-1 font-mono text-sm sm:text-base bg-white/50 border-border/50"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    addToast({
                      type: "success",
                      title: "Copied!",
                      description: t("set.copied"),
                      duration: 2000
                    });
                  }}
                  className="rounded-full px-4 sm:px-6 shadow-lg shadow-primary/20 w-full sm:w-auto"
                  size="lg"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full justify-center">
              <Button
                onClick={() => setLocation("/dashboard")}
                variant="outline"
                className="rounded-full px-4 py-3 w-full sm:w-auto"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => setLocation("/create")}
                className="rounded-full px-4 py-3 shadow-lg shadow-primary/20 w-full sm:w-auto"
              >
                Create Another Set
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showAnonymousPrompt) {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-border/50">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary font-serif">{t("set.savePrompt")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("set.saveDesc")}
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                <Label htmlFor="anonymous-email" className="text-primary font-medium font-serif">Email Address</Label>
                <Input
                  id="anonymous-email"
                  type="email"
                  placeholder="your@email.com"
                  value={anonymousEmail}
                  onChange={(e) => setAnonymousEmail(e.target.value)}
                  className="mt-2 bg-white/50 border-border/50 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  📧 We'll send you a link to access your responses
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setShowAnonymousPrompt(false)}
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  {t("set.cancel")}
                </Button>
                <Button
                  onClick={handleAnonymousSave}
                  disabled={!anonymousEmail.trim() || createSet.isPending}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold rounded-full shadow-lg shadow-primary/20"
                >
                  {createSet.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-900 mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {t("set.saveWithEmail")}
                    </>
                  )}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/80 backdrop-blur-sm px-3 py-1 text-muted-foreground rounded-full border border-border/50 font-serif">Or</span>
                </div>
              </div>

              <Button
                onClick={() => setLocation("/login")}
                variant="outline"
                className="w-full rounded-full py-3"
              >
                <Mail className="w-4 h-4 mr-2" />
                Create Full Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto pb-20">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="questionerName" className="text-base font-semibold text-foreground/80">Questioner Name *</Label>
          <Input
            id="questionerName"
            {...form.register("questionerName")}
            className="mt-1 text-lg font-medium"
            placeholder="Enter your full name"
          />
          {form.formState.errors.questionerName && (
            <p className="text-destructive text-sm mt-1">{form.formState.errors.questionerName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="curatorEmail" className="text-base font-semibold text-foreground/80">Curator Email (Optional)</Label>
          <Input
            id="curatorEmail"
            type="email"
            {...form.register("curatorEmail")}
            className="mt-1"
            placeholder="trusted.person@email.com"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Add someone who can view responses and verify this question set
          </p>
          {form.formState.errors.curatorEmail && (
            <p className="text-destructive text-sm mt-1">{form.formState.errors.curatorEmail.message}</p>
          )}
        </div>
      </div>

      <div className="h-px bg-border my-6" />

      {/* Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between space-x-2 bg-card p-4 rounded-xl border shadow-sm">
          <Label htmlFor="allowAnonymous" className="flex flex-col space-y-1">
            <span className="font-medium">{t("set.allowAnonymous")}</span>
            <span className="font-normal text-xs text-muted-foreground">Responders won't need to provide a name</span>
          </Label>
          <Switch 
            id="allowAnonymous" 
            checked={form.watch("allowAnonymous")}
            onCheckedChange={(c) => form.setValue("allowAnonymous", c)}
          />
        </div>

        <div className="flex items-center justify-between space-x-2 bg-card p-4 rounded-xl border shadow-sm">
          <Label htmlFor="requireAttestation" className="flex flex-col space-y-1">
            <span className="font-medium">{t("set.requireAttestation")}</span>
            <span className="font-normal text-xs text-muted-foreground">Require religious oath before submitting</span>
          </Label>
          <Switch 
            id="requireAttestation" 
            checked={form.watch("requireAttestation")}
            onCheckedChange={(c) => form.setValue("requireAttestation", c)}
          />
        </div>
      </div>

      <div className="h-px bg-border my-6" />

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">{t("set.questions")}</h3>
          <span className="text-sm text-muted-foreground">{fields.length} questions</span>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card
              key={field.id}
              className={`relative group hover:border-primary/50 transition-colors ${draggedIndex === index ? 'opacity-50' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <CardContent className="p-4 flex gap-4">
                <div className="mt-3 text-muted-foreground cursor-move">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label className="sr-only">Question Prompt</Label>
                      <Input 
                        {...form.register(`questions.${index}.prompt`)}
                        placeholder={`Question ${index + 1}`}
                        className="font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary bg-transparent placeholder:text-muted-foreground/50"
                      />
                      {form.formState.errors.questions?.[index]?.prompt && (
                        <p className="text-destructive text-xs mt-1">Required</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        {...form.register(`questions.${index}.required`)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      Required
                    </label>
                    <div className="h-3 w-px bg-border" />
                    <span className="uppercase tracking-wider font-semibold text-[10px]">Text Answer</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive self-start"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ type: "TEXT", prompt: "", required: true, order: fields.length })}
          className="w-full py-6 border-dashed border-2 hover:border-primary hover:text-primary transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t z-10">
        <div className="container max-w-3xl mx-auto flex justify-end gap-4">
          <Button
            type="submit"
            size="lg"
            className="shadow-lg shadow-primary/20"
            disabled={createSet.isPending || !form.formState.isValid}
          >
            {createSet.isPending ? "Creating..." : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t("set.save")}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

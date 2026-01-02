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

// Combined schema for the form - temporarily simplified for debugging
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isOpen: z.boolean(),
  requireAttestation: z.boolean(),
  allowAnonymous: z.boolean(),
  allowMultipleSubmissions: z.boolean(),
  defaultLocale: z.string(),
  questions: z.array(z.object({
    tempId: z.string().optional(),
    type: z.string(),
    prompt: z.string().min(1, "Question prompt is required"),
    required: z.boolean(),
    order: z.number(),
    options: z.any().optional()
  })).min(1, "At least one question is required")
});

type FormData = z.infer<typeof formSchema>;

export function CreateSetForm() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const createSet = useCreateSet();
  const [, setLocation] = useLocation();
  const [showAnonymousPrompt, setShowAnonymousPrompt] = useState(false);
  const [anonymousEmail, setAnonymousEmail] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [lastSaveType, setLastSaveType] = useState<'regular' | 'anonymous' | null>(null);
  const [createdSetUrl, setCreatedSetUrl] = useState<string | null>(null);

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
      setCreatedSetUrl(shareUrl);
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
      title: "",
      description: "",
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
    if (!isAuthenticated || user?.firstName === "Anonymous") {
      console.log("User is anonymous, showing prompt");
      setShowAnonymousPrompt(true);
      return;
    }

    console.log("User is authenticated, proceeding with save");

    // Ensure order is correct
    const formattedData = {
      ...data,
      questions: data.questions.map((q, idx) => ({
        ...q,
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
      errorToast("Email Required", "Please enter an email address to save your question set");
      return;
    }

    console.log("Anonymous email provided:", anonymousEmail);

    const data = form.getValues();
    console.log("Form data:", data);

    const formattedData = {
      ...data,
      questions: data.questions.map((q, idx) => ({
        ...q,
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

  if (createdSetUrl) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-border/50">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>

            <h3 className="text-3xl font-bold mb-4 text-primary font-serif">Question Set Created!</h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Your question set has been saved successfully. Share this link with others to collect their responses.
            </p>

            <div className="bg-primary/5 p-6 rounded-xl mb-6 border border-primary/20">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Share2 className="w-6 h-6 text-primary" />
                <span className="font-medium text-lg text-primary font-serif">Share Link</span>
              </div>
              <div className="flex gap-3">
                <Input
                  value={createdSetUrl}
                  readOnly
                  className="flex-1 font-mono text-base bg-white/50 border-border/50"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(createdSetUrl);
                    addToast({
                      type: "success",
                      title: "Copied!",
                      description: "Link copied to clipboard",
                      duration: 2000
                    });
                  }}
                  className="rounded-full px-6 shadow-lg shadow-primary/20"
                  size="lg"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setLocation("/dashboard")}
                variant="outline"
                className="rounded-full px-6 py-3"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => setLocation("/create")}
                className="rounded-full px-6 py-3 shadow-lg shadow-primary/20"
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
              <h3 className="text-xl font-bold mb-3 text-primary font-serif">Save Your Question Set</h3>
              <p className="text-muted-foreground leading-relaxed">
                To save your question set and receive responses, please provide an email address or create an account.
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
                  Cancel
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
                      Save with Email
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
          <Label htmlFor="title" className="text-base font-semibold text-foreground/80">{t("set.title")}</Label>
          <Input 
            id="title" 
            {...form.register("title")} 
            className="mt-1 text-lg font-medium" 
            placeholder="e.g. Weekly Reflections"
          />
          {form.formState.errors.title && (
            <p className="text-destructive text-sm mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description" className="text-base font-semibold text-foreground/80">{t("set.desc")}</Label>
          <Textarea 
            id="description" 
            {...form.register("description")} 
            className="mt-1 resize-none h-24" 
            placeholder="Explain the purpose of these questions..."
          />
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
            disabled={createSet.isPending}
            onClick={(e) => {
              console.log("=== SAVE BUTTON CLICKED ===");
              const values = form.getValues();
              const errors = form.formState.errors;
              const isValid = form.formState.isValid;

              console.log("Form values:", values);
              console.log("Form errors:", errors);
              console.log("Form is valid:", isValid);
              console.log("Title value:", `"${values.title}"`, "Length:", values.title?.length);
              console.log("Questions:", values.questions?.map((q, i) => ({
                index: i,
                prompt: `"${q.prompt}"`,
                promptLength: q.prompt?.length,
                type: q.type
              })));

              // Manual validation check
              const titleValid = values.title && values.title.trim().length > 0;
              const questionsValid = values.questions && values.questions.length > 0 &&
                values.questions.every(q => q.prompt && q.prompt.trim().length > 0);

              console.log("Manual validation - Title valid:", titleValid, "Questions valid:", questionsValid);

              if (!titleValid || !questionsValid) {
                console.log("Manual validation failed, preventing submission");
                e.preventDefault();
                errorToast(
                  "Validation Failed",
                  `Please fill in all required fields:
• Title: ${titleValid ? '✓' : '✗'}
• Questions: ${questionsValid ? '✓' : '✗'}`
                );
                return;
              }
            }}
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

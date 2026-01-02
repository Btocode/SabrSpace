import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertQuestionSetSchema, insertQuestionSchema } from "@shared/schema";
import { useCreateSet } from "@/hooks/use-sets";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ArrowRight, Save, GripVertical } from "lucide-react";
import { useLocation } from "wouter";

// Combined schema for the form
const formSchema = insertQuestionSetSchema.extend({
  questions: z.array(insertQuestionSchema.extend({
    tempId: z.string().optional() // for UI keys
  }))
});

type FormData = z.infer<typeof formSchema>;

export function CreateSetForm() {
  const { t } = useLanguage();
  const createSet = useCreateSet();
  const [, setLocation] = useLocation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions"
  });

  const onSubmit = (data: FormData) => {
    // Ensure order is correct
    const formattedData = {
      ...data,
      questions: data.questions.map((q, idx) => ({
        ...q,
        order: idx
      }))
    };
    
    createSet.mutate(formattedData, {
      onSuccess: () => {
        setLocation("/dashboard");
      }
    });
  };

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
            <Card key={field.id} className="relative group hover:border-primary/50 transition-colors">
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

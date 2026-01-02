import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ArrowRight, ArrowLeft, Share2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type QuestionType = "TEXT" | "CHOICE";

interface Question {
  id: string;
  prompt: string;
  type: QuestionType;
  options: string[];
  required: boolean;
}

export default function DemoWizard() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: crypto.randomUUID(), prompt: "", type: "TEXT", options: [], required: true }
  ]);
  const [requireAttestation, setRequireAttestation] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const { toast } = useToast();

  const addQuestion = () => {
    setQuestions([...questions, { id: crypto.randomUUID(), prompt: "", type: "TEXT", options: [], required: true }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleCreate = () => {
    if (!title) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    const token = Math.random().toString(36).substring(2, 15);
    setShareToken(token);
    setStep(3);
    toast({ title: "Demo link created!" });
  };

  const copyLink = () => {
    const link = `${window.location.origin}/s/${shareToken}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%230f766e' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

      <Card className="w-full max-w-2xl border-primary/10 shadow-xl bg-card/50 backdrop-blur-sm">
        {step === 1 && (
          <>
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Plus className="text-primary w-6 h-6" />
              </div>
              <CardTitle className="text-3xl font-serif text-primary">Create Question Set</CardTitle>
              <CardDescription>Start your demo journey by setting a title and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., Marriage Compatibility Questions" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description (Optional)</Label>
                <Input id="desc" placeholder="Briefly explain the purpose of this set" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="attestation" checked={requireAttestation} onCheckedChange={(checked) => setRequireAttestation(!!checked)} />
                <Label htmlFor="attestation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Require respectful truth attestation
                </Label>
              </div>
              <Button className="w-full mt-4" size="lg" onClick={() => setStep(2)}>
                Next: Add Questions <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-serif text-primary flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="mr-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                Add Questions
              </CardTitle>
              <CardDescription>Add the questions you want to ask your responder</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {questions.map((q, index) => (
                  <Card key={q.id} className="p-4 border-primary/5 bg-background/50 space-y-4 relative group">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Question {index + 1}</Label>
                        <Input placeholder="Enter your question prompt..." value={q.prompt} onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })} />
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeQuestion(q.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-6">
                      <RadioGroup defaultValue={q.type} className="flex gap-4" onValueChange={(val) => updateQuestion(q.id, { type: val as QuestionType })}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="TEXT" id={`text-${q.id}`} />
                          <Label htmlFor={`text-${q.id}`}>Text</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="CHOICE" id={`choice-${q.id}`} />
                          <Label htmlFor={`choice-${q.id}`}>Choices</Label>
                        </div>
                      </RadioGroup>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id={`req-${q.id}`} checked={q.required} onCheckedChange={(val) => updateQuestion(q.id, { required: !!val })} />
                        <Label htmlFor={`req-${q.id}`} className="text-sm">Required</Label>
                      </div>
                    </div>

                    {q.type === "CHOICE" && (
                      <div className="space-y-2 pl-4 border-l-2 border-primary/10">
                        <Label className="text-xs">Options (comma separated)</Label>
                        <Input 
                          placeholder="Option 1, Option 2, Option 3" 
                          onChange={(e) => updateQuestion(q.id, { options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} 
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full border-dashed" onClick={addQuestion}>
                <Plus className="mr-2 w-4 h-4" /> Add Another Question
              </Button>

              <Button className="w-full mt-4 bg-teal-700 hover:bg-teal-800" size="lg" onClick={handleCreate}>
                Create Shareable Link <Share2 className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <CardContent className="py-10 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="text-green-600 w-8 h-8" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-serif text-primary">Your Link is Ready!</CardTitle>
              <CardDescription>Share this unique link with anyone to start receiving responses.</CardDescription>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
              <code className="flex-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                {window.location.origin}/s/{shareToken}
              </code>
              <Button size="icon" variant="ghost" onClick={copyLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button className="w-full" size="lg" onClick={() => window.open(`/s/${shareToken}`, '_blank')}>
                Test Response Page
              </Button>
              <Button variant="ghost" onClick={() => setStep(1)}>
                Create Another One
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
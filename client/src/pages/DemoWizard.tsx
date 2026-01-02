import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ArrowRight, ArrowLeft, Share2, Copy, Check, Sparkles, Wand2, Heart, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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
    if (questions.length === 1) return;
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleCreate = () => {
    if (!title) {
      toast({ title: "Title required", description: "Please give your question set a name.", variant: "destructive" });
      return;
    }
    const token = Math.random().toString(36).substring(2, 15);
    setShareToken(token);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({ title: "Demo link generated!" });
  };

  const copyLink = () => {
    const link = `${window.location.origin}/s/${shareToken}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4 selection:bg-primary/20">
      {/* Premium Geometric Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none -z-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0l60 60-60 60L0 60z' fill='%230f766e' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

      <div className="w-full max-w-3xl space-y-8 relative z-10">
        <div className="text-center space-y-2 mb-4">
          <div className="text-primary font-serif italic text-xl">SabrSpace Wizard</div>
          <div className="h-0.5 w-16 bg-accent/40 mx-auto rounded-full" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="border-primary/10 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-xl rounded-[3rem] overflow-hidden">
                <CardHeader className="text-center p-12 space-y-4">
                  <div className="mx-auto w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-4 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <Sparkles className="text-primary w-10 h-10" />
                  </div>
                  <CardTitle className="text-4xl font-serif text-primary tracking-tight">Naming your Journey</CardTitle>
                  <CardDescription className="text-lg font-light text-muted-foreground">Every great connection starts with a clear intention.</CardDescription>
                </CardHeader>
                <CardContent className="p-12 pt-0 space-y-10">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-lg font-medium ml-2">Set Title</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g., Marriage Compatibility, Family Legacy, Heart Conversations" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-16 rounded-3xl bg-muted/30 border-none text-xl px-8 focus-visible:ring-2 focus-visible:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desc" className="text-lg font-medium ml-2">Context <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                      <Input 
                        id="desc" 
                        placeholder="Briefly set the mood for your responder" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        className="h-16 rounded-3xl bg-muted/30 border-none text-xl px-8 focus-visible:ring-2 focus-visible:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100 flex items-center gap-6 group cursor-pointer" onClick={() => setRequireAttestation(!requireAttestation)}>
                    <Checkbox 
                      id="attestation" 
                      checked={requireAttestation} 
                      onCheckedChange={(checked) => setRequireAttestation(!!checked)}
                      className="w-7 h-7 rounded-lg border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 transition-all"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="attestation" className="text-xl font-serif text-amber-900 cursor-pointer">Require Oath of Truth</Label>
                      <p className="text-sm text-amber-600/70 font-medium">Asks responders to testify in the name of Allah before answering.</p>
                    </div>
                  </div>

                  <Button className="w-full h-20 text-2xl rounded-3xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all" onClick={() => setStep(2)}>
                    Begin Designing <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" size="lg" onClick={() => setStep(1)} className="rounded-full gap-2 px-6">
                  <ArrowLeft className="w-5 h-5" /> Back
                </Button>
                <div className="bg-primary/5 px-6 py-2 rounded-full border border-primary/10 text-primary font-serif italic">
                  Drafting {questions.length} Question{questions.length > 1 ? 's' : ''}
                </div>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {questions.map((q, index) => (
                  <motion.div
                    key={q.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="border-primary/5 shadow-xl shadow-primary/5 rounded-[2.5rem] bg-card/90 overflow-hidden relative group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="p-10 space-y-8">
                        <div className="flex justify-between items-start gap-6">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="text-accent font-serif font-bold text-lg">Question {index + 1}</span>
                              <div className="h-px flex-1 bg-border/40" />
                            </div>
                            <Input 
                              placeholder="Type your question prompt here..." 
                              value={q.prompt} 
                              onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })} 
                              className="h-16 rounded-2xl bg-muted/20 border-none text-xl px-6 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all placeholder:text-muted-foreground/30"
                            />
                          </div>
                          {questions.length > 1 && (
                            <Button variant="ghost" size="icon" className="h-12 w-12 text-destructive/40 hover:text-destructive hover:bg-destructive/5 rounded-2xl mt-8" onClick={() => removeQuestion(q.id)}>
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          )}
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-10">
                          <RadioGroup 
                            defaultValue={q.type} 
                            className="flex items-center gap-8" 
                            onValueChange={(val) => updateQuestion(q.id, { type: val as QuestionType })}
                          >
                            <div className="flex items-center space-x-3 cursor-pointer group/radio">
                              <RadioGroupItem value="TEXT" id={`text-${q.id}`} className="w-5 h-5" />
                              <Label htmlFor={`text-${q.id}`} className="text-lg cursor-pointer">Text Response</Label>
                            </div>
                            <div className="flex items-center space-x-3 cursor-pointer group/radio">
                              <RadioGroupItem value="CHOICE" id={`choice-${q.id}`} className="w-5 h-5" />
                              <Label htmlFor={`choice-${q.id}`} className="text-lg cursor-pointer">Multiple Choice</Label>
                            </div>
                          </RadioGroup>
                          
                          <div className="h-8 w-px bg-border/40 hidden md:block" />
                          
                          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => updateQuestion(q.id, { required: !q.required })}>
                            <Checkbox 
                              id={`req-${q.id}`} 
                              checked={q.required} 
                              onCheckedChange={(val) => updateQuestion(q.id, { required: !!val })} 
                              className="w-5 h-5 rounded-md"
                            />
                            <Label htmlFor={`req-${q.id}`} className="text-lg cursor-pointer">Mandatory</Label>
                          </div>
                        </div>

                        {q.type === "CHOICE" && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="space-y-4 pt-4 border-t border-border/40"
                          >
                            <Label className="text-sm font-medium text-muted-foreground ml-2 uppercase tracking-widest">Available Options</Label>
                            <Input 
                              placeholder="Option A, Option B, Option C (separate with commas)" 
                              onChange={(e) => updateQuestion(q.id, { options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} 
                              className="h-14 rounded-2xl bg-muted/20 border-none px-6 focus-visible:ring-1 focus-visible:ring-primary/10"
                            />
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="pt-6 space-y-6">
                <Button variant="outline" className="w-full h-16 rounded-[2rem] border-dashed border-2 border-primary/20 text-lg hover:bg-primary/5 hover:border-primary/40 transition-all duration-300" onClick={addQuestion}>
                  <Plus className="mr-3 w-5 h-5" /> Add New Question
                </Button>

                <Button className="w-full h-20 text-2xl rounded-[2.5rem] bg-teal-800 hover:bg-teal-900 shadow-2xl shadow-teal-900/10 group" onClick={handleCreate}>
                  Seal & Create Sharing Link
                  <Wand2 className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-none shadow-2xl rounded-[4rem] overflow-hidden bg-gradient-to-br from-teal-900 to-teal-950 text-white relative">
                <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l40 40-40 40L0 40z' fill='%23ffffff'/%3E%3C/svg%3E")` }} />
                
                <CardContent className="p-16 text-center space-y-10 relative z-10">
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
                    className="mx-auto w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center mb-6 shadow-inner"
                  >
                    <Check className="text-accent w-16 h-16 stroke-[3]" />
                  </motion.div>
                  
                  <div className="space-y-4">
                    <h2 className="text-5xl font-serif tracking-tight">Success! Link Created</h2>
                    <p className="text-xl text-teal-100/70 font-light max-w-sm mx-auto leading-relaxed">Your sacred space for conversation is ready to be shared with the world.</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-4 border border-white/10 flex items-center gap-4 group">
                    <div className="flex-1 text-xl px-6 font-mono overflow-hidden text-ellipsis whitespace-nowrap opacity-80 select-all">
                      {window.location.origin}/s/{shareToken}
                    </div>
                    <Button size="icon" variant="ghost" onClick={copyLink} className="h-16 w-16 rounded-[1.5rem] hover:bg-white/10 text-accent transition-all active:scale-90">
                      <Copy className="w-8 h-8" />
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 pt-6">
                    <Button className="flex-1 h-20 text-xl rounded-3xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-2xl shadow-accent/20 font-bold group" onClick={() => window.open(`/s/${shareToken}`, '_blank')}>
                      <Share2 className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" /> Preview Answer Page
                    </Button>
                    <Button variant="ghost" className="flex-1 h-20 text-xl rounded-3xl text-white/60 hover:text-white hover:bg-white/5" onClick={() => { setStep(1); setShareToken(null); setTitle(""); setDescription(""); setQuestions([{ id: crypto.randomUUID(), prompt: "", type: "TEXT", options: [], required: true }]); }}>
                      Create Another
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 text-muted-foreground/40 font-serif italic text-sm">
        "Honesty is the shortest way to connection"
      </div>
    </div>
  );
}

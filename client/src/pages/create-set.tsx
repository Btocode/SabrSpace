import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IslamicCard } from "@/components/ui/geometric-pattern";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  QrCode,
  Loader2,
  GripVertical
} from "lucide-react";
import { buildUrl } from "@shared/routes";
import type { CreateSetRequest, InsertQuestion } from "@shared/schema";

type Step = 1 | 2 | 3;

interface QuestionForm {
  id?: number;
  tempId: string;
  setId?: number;
  order: number;
  type: string;
  prompt: string;
  options?: unknown;
  required?: boolean;
}

export default function CreateSetPage() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [defaultLocale, setDefaultLocale] = useState<"en" | "bn">("en");
  const [isOpen, setIsOpen] = useState(true);
  const [requireAttestation, setRequireAttestation] = useState(false);
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [allowMultipleSubmissions, setAllowMultipleSubmissions] = useState(false);

  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      tempId: "q1",
      prompt: "",
      type: "TEXT",
      required: true,
      order: 0,
    }
  ]);

  const [createdSet, setCreatedSet] = useState<any>(null);

  // Create set mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateSetRequest) => {
      const response = await fetch(buildUrl("/api/sets"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: (data) => {
      setCreatedSet(data);
      setCurrentStep(3);
    },
  });

  const addQuestion = () => {
    const newQuestion: QuestionForm = {
      tempId: `q${Date.now()}`,
      prompt: "",
      type: "TEXT",
      required: true,
      order: questions.length,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (tempId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.tempId !== tempId));
    }
  };

  const updateQuestion = (tempId: string, updates: Partial<QuestionForm>) => {
    setQuestions(questions.map(q =>
      q.tempId === tempId ? { ...q, ...updates } : q
    ));
  };

  const addChoiceOption = (tempId: string) => {
    const question = questions.find(q => q.tempId === tempId);
    if (question && question.type === "CHOICE") {
      const currentOptions = (question.options as string[]) || [];
      updateQuestion(tempId, {
        options: [...currentOptions, ""]
      });
    }
  };

  const updateChoiceOption = (tempId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.tempId === tempId);
    if (question && question.options) {
      const newOptions = [...(question.options as string[])];
      newOptions[optionIndex] = value;
      updateQuestion(tempId, { options: newOptions });
    }
  };

  const removeChoiceOption = (tempId: string, optionIndex: number) => {
    const question = questions.find(q => q.tempId === tempId);
    if (question && question.options && (question.options as string[]).length > 2) {
      const newOptions = (question.options as string[]).filter((_, i) => i !== optionIndex);
      updateQuestion(tempId, { options: newOptions });
    }
  };

  const handleSubmit = () => {
    const setData: CreateSetRequest = {
      title,
      description,
      defaultLocale,
      isOpen,
      requireAttestation,
      allowAnonymous,
      allowMultipleSubmissions,
      questions: questions.map((q, index) => ({
        prompt: q.prompt,
        type: q.type,
        required: q.required,
        order: index,
        options: q.type === "CHOICE" ? q.options : undefined,
      })),
    };
    createMutation.mutate(setData);
  };

  const copyShareLink = () => {
    if (createdSet) {
      const url = `${window.location.origin}/s/${createdSet.token}`;
      navigator.clipboard.writeText(url);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Set Details</h2>
        <p className="text-muted-foreground">Basic information about your question set</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Getting to Know You"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of what this question set is for"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="locale">Default Language</Label>
          <Select value={defaultLocale} onValueChange={(value: "en" | "bn") => setDefaultLocale(value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="bn">বাংলা (Bangla)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Open for Responses</Label>
              <p className="text-sm text-muted-foreground">Allow new responses to be submitted</p>
            </div>
            <Switch checked={isOpen} onCheckedChange={setIsOpen} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Require Attestation</Label>
              <p className="text-sm text-muted-foreground">Ask respondents to commit to truthful answers</p>
            </div>
            <Switch checked={requireAttestation} onCheckedChange={setRequireAttestation} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Anonymous Responses</Label>
              <p className="text-sm text-muted-foreground">Let people respond without providing their name</p>
            </div>
            <Switch checked={allowAnonymous} onCheckedChange={setAllowAnonymous} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Multiple Submissions</Label>
              <p className="text-sm text-muted-foreground">Let the same person respond multiple times</p>
            </div>
            <Switch checked={allowMultipleSubmissions} onCheckedChange={setAllowMultipleSubmissions} />
          </div>
        </div>
      </div>

      <Button
        onClick={() => setCurrentStep(2)}
        disabled={!title.trim()}
        className="w-full islamic-button"
      >
        Next: Add Questions
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Questions</h2>
        <p className="text-muted-foreground">Create the questions for your set</p>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <IslamicCard key={question.tempId} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Question {index + 1}</span>
              </div>
              {questions.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(question.tempId)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Question Prompt *</Label>
                <Input
                  placeholder="Enter your question"
                  value={question.prompt}
                  onChange={(e) => updateQuestion(question.tempId, { prompt: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={question.type}
                    onValueChange={(value: "TEXT" | "CHOICE") => updateQuestion(question.tempId, { type: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXT">Text Answer</SelectItem>
                      <SelectItem value="CHOICE">Multiple Choice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={question.required}
                    onCheckedChange={(checked) => updateQuestion(question.tempId, { required: checked })}
                  />
                  <Label>Required</Label>
                </div>
              </div>

              {question.type === "CHOICE" && (
                <div>
                  <Label className="flex items-center justify-between">
                    Choice Options
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addChoiceOption(question.tempId)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Option
                    </Button>
                  </Label>
                  <div className="space-y-2 mt-2">
                    {((question.options as string[]) || []).map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Input
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) => updateChoiceOption(question.tempId, optionIndex, e.target.value)}
                        />
                        {((question.options as string[])?.length || 0) > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChoiceOption(question.tempId, optionIndex)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </IslamicCard>
        ))}

        <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Another Question
        </Button>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep(3)}
          disabled={questions.some(q => !q.prompt.trim())}
          className="flex-1 islamic-button"
        >
          Next: Publish
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    if (createdSet) {
      const shareUrl = `${window.location.origin}/s/${createdSet.token}`;
      return (
        <div className="space-y-6 text-center">
          <div>
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Question Set Created!</h2>
            <p className="text-muted-foreground">
              Your question set is ready to share. Copy the link below to start collecting responses.
            </p>
          </div>

          <IslamicCard className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{createdSet.title}</h3>
                <p className="text-sm text-muted-foreground">{createdSet.description}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Share Link:</p>
                <p className="text-sm break-all font-mono bg-background p-2 rounded border">
                  {shareUrl}
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={copyShareLink} className="flex-1 islamic-button">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button variant="outline" className="flex-1">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
              </div>
            </div>
          </IslamicCard>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex-1">
              Back to Dashboard
            </Button>
            <Button onClick={() => window.open(shareUrl, '_blank')} className="flex-1 islamic-button">
              Test Your Set
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Ready to Publish</h2>
          <p className="text-muted-foreground">Review your settings and create the question set</p>
        </div>

        <IslamicCard className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{description || "No description"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Questions:</span>
                <span className="ml-2 font-medium">{questions.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Language:</span>
                <Badge variant="outline" className="ml-2">
                  {defaultLocale.toUpperCase()}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={isOpen ? "default" : "secondary"} className="ml-2">
                  {isOpen ? "Open" : "Closed"}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Attestation:</span>
                <span className="ml-2">{requireAttestation ? "Required" : "Optional"}</span>
              </div>
            </div>
          </div>
        </IslamicCard>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="flex-1 islamic-button"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Create Question Set
          </Button>
        </div>
      </div>
    );
  };

  const steps = [
    { number: 1, title: "Details", description: "Basic info & settings" },
    { number: 2, title: "Questions", description: "Add your questions" },
    { number: 3, title: "Publish", description: "Create & share" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex-1 text-center ${
                    step.number <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                    step.number < currentStep
                      ? "bg-primary text-primary-foreground"
                      : step.number === currentStep
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {step.number < currentStep ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs">{step.description}</div>
                </div>
              ))}
            </div>

            <Progress value={(currentStep / 3) * 100} className="mb-8" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <IslamicCard className="p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </IslamicCard>
        </div>
      </div>
    </div>
  );
}

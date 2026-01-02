import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GeometricPattern, IslamicCard } from "@/components/ui/geometric-pattern";
import { CheckCircle, User, MessageSquare, Send, AlertCircle, Loader2 } from "lucide-react";
import { buildUrl } from "@shared/routes";
import type { QuestionSetWithQuestions, SubmitResponseRequest } from "@shared/schema";
import type { CheckedState } from "@radix-ui/react-checkbox";

type Step = "name" | "attestation" | "questions" | "success";

export default function AnswerPage() {
  const [match, params] = useRoute("/s/:token");
  const token = params?.token;

  const [currentStep, setCurrentStep] = useState<Step>("name");
  const [responderName, setResponderName] = useState("");
  const [attestationAccepted, setAttestationAccepted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fetch question set
  const { data: questionSet, isLoading, error } = useQuery<QuestionSetWithQuestions>({
    queryKey: [`/api/public/sets/${token}`],
    enabled: !!token,
  });

  // Submit response mutation
  const submitMutation = useMutation({
    mutationFn: async (data: SubmitResponseRequest) => {
      if (!token) throw new Error("Token is required");
      const response = await fetch(buildUrl("/api/public/sets/:token/submit", { token }), {
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
    onSuccess: () => {
      setCurrentStep("success");
    },
  });

  // Auto-save to localStorage
  useEffect(() => {
    if (questionSet) {
      const draftKey = `sabrspace_draft_${token}`;
      const draft = {
        responderName,
        attestationAccepted,
        answers,
        step: currentStep,
        timestamp: Date.now(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));
    }
  }, [responderName, attestationAccepted, answers, currentStep, token, questionSet]);

  // Load draft from localStorage
  useEffect(() => {
    if (token && questionSet) {
      const draftKey = `sabrspace_draft_${token}`;
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          // Only load if draft is less than 24 hours old
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            setResponderName(parsed.responderName || "");
            setAttestationAccepted(parsed.attestationAccepted || false);
            setAnswers(parsed.answers || {});
            if (parsed.step && parsed.step !== "success") {
              setCurrentStep(parsed.step);
            }
          } else {
            localStorage.removeItem(draftKey);
          }
        } catch (e) {
          localStorage.removeItem(draftKey);
        }
      }
    }
  }, [token, questionSet]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !questionSet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <IslamicCard className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Question Set Not Found</h2>
          <p className="text-muted-foreground">
            The link you followed may be invalid or expired.
          </p>
        </IslamicCard>
      </div>
    );
  }

  const currentQuestion = questionSet.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionSet.questions.length) * 100;

  const handleNameSubmit = () => {
    if (!questionSet.allowAnonymous && !responderName.trim()) return;
    setCurrentStep(questionSet.requireAttestation ? "attestation" : "questions");
  };

  const handleAttestationSubmit = () => {
    if (questionSet.requireAttestation && !attestationAccepted) return;
    setCurrentStep("questions");
  };

  const handleAnswerSubmit = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.required && !answer?.trim()) return;

    if (currentQuestionIndex < questionSet.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit the response
      const responseData: SubmitResponseRequest = {
        responderName: responderName.trim() || null,
        attestationAcceptedAt: attestationAccepted ? new Date() : null,
        localeUsed: questionSet.defaultLocale,
        answers: questionSet.questions.map(q => ({
          questionId: q.id,
          value: answers[q.id] || "",
        })),
      };
      submitMutation.mutate(responseData);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "name":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                {questionSet.allowAnonymous ? "Welcome" : "Introduce Yourself"}
              </h2>
              <p className="text-muted-foreground">
                {questionSet.allowAnonymous
                  ? "You can provide your name or remain anonymous"
                  : "Please provide your name to continue"
                }
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name {!questionSet.allowAnonymous && "(Required)"}</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={responderName}
                  onChange={(e) => setResponderName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              onClick={handleNameSubmit}
              className="w-full islamic-button"
              disabled={!questionSet.allowAnonymous && !responderName.trim()}
            >
              Continue
            </Button>
          </div>
        );

      case "attestation":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Commitment to Sincerity</h2>
              <p className="text-muted-foreground mb-6">
                Before proceeding, please confirm your intention to answer thoughtfully
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {questionSet.defaultLocale === "bn"
                  ? "আমি আল্লাহর নামে সাক্ষ্য দিচ্ছি যে আমি সত্যভাবে উত্তর দেব।"
                  : "I testify in the name of Allah that I will answer truthfully."
                }
              </AlertDescription>
            </Alert>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="attestation"
                checked={attestationAccepted}
                onCheckedChange={(checked: CheckedState) => setAttestationAccepted(checked === true)}
              />
              <Label htmlFor="attestation" className="text-sm">
                I accept this commitment
              </Label>
            </div>

            <Button
              onClick={handleAttestationSubmit}
              className="w-full islamic-button"
              disabled={!attestationAccepted}
            >
              Continue
            </Button>
          </div>
        );

      case "questions":
        if (!currentQuestion) return null;

        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-full mb-6">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Question {currentQuestionIndex + 1} of {questionSet.questions.length}
                </p>
              </div>

              <h2 className="text-xl font-semibold mb-4">{questionSet.title}</h2>
            </div>

            <IslamicCard className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">
                    {currentQuestion.prompt}
                    {currentQuestion.required && <span className="text-destructive ml-1">*</span>}
                  </h3>

                  {currentQuestion.type === "TEXT" ? (
                    <Textarea
                      placeholder="Your answer..."
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                      className="min-h-[120px]"
                    />
                  ) : (
                    <RadioGroup
                      value={answers[currentQuestion.id] || ""}
                      onValueChange={(value) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))}
                    >
                      {(currentQuestion.options as string[])?.map((option: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              </div>
            </IslamicCard>

            <div className="flex gap-3">
              {currentQuestionIndex > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              <Button
                onClick={handleAnswerSubmit}
                className="flex-1 islamic-button"
                disabled={currentQuestion.required && !answers[currentQuestion.id]?.trim()}
              >
                {currentQuestionIndex < questionSet.questions.length - 1 ? "Next" : "Submit"}
                {currentQuestionIndex === questionSet.questions.length - 1 && (
                  <Send className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="space-y-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-semibold">Thank You!</h2>
            <p className="text-muted-foreground">
              Your response has been submitted successfully.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Submit Another Response
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GeometricPattern className="fixed inset-0" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <IslamicCard className="p-8">
            {renderStep()}
          </IslamicCard>

          {submitMutation.isPending && (
            <div className="mt-4 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Submitting your response...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { IslamicCard } from "@/components/ui/geometric-pattern";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { buildUrl } from "@shared/routes";
import type { QuestionSetWithQuestions, UpdateSetRequest } from "@shared/schema";

export default function EditSetPage() {
  const [match, params] = useRoute("/dashboard/sets/:setId/edit");
  const setId = params?.setId;
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  // Fetch question set
  const { data: questionSet, isLoading } = useQuery<QuestionSetWithQuestions>({
    queryKey: [`/api/sets/${setId}`],
    enabled: !!setId && !!user,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateSetRequest) => {
      if (!setId) throw new Error("Set ID is required");
      const response = await fetch(buildUrl("/api/sets/:id", { id: setId }), {
        method: "PATCH",
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
      navigate("/dashboard");
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (questionSet) {
      setTitle(questionSet.title);
      setDescription(questionSet.description || "");
      setIsOpen(questionSet.isOpen);
    }
  }, [questionSet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updateData: UpdateSetRequest = {
      title,
      description,
      isOpen,
      questions: undefined, // Not updating questions in this form
    };

    updateMutation.mutate(updateData);
  };

  if (!user) {
    window.location.href = "/api/login";
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!questionSet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Question Set Not Found</h2>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">Edit Question Set</h1>
            <p className="text-muted-foreground">Modify your question set details</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <IslamicCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Question set title"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description (optional)"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="isOpen" className="text-base">Accepting Responses</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new responses to be submitted to this question set
                  </p>
                </div>
                <Switch
                  id="isOpen"
                  checked={isOpen}
                  onCheckedChange={setIsOpen}
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Question Set Info</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Questions:</span>
                    <span className="ml-2 font-medium">{questionSet.questions.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Views:</span>
                    <span className="ml-2 font-medium">{questionSet.views}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Language:</span>
                    <span className="ml-2 font-medium">{questionSet.defaultLocale.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-2 font-medium">
                      {questionSet.createdAt ? new Date(questionSet.createdAt).toLocaleDateString() : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || !title.trim()}
                  className="flex-1 islamic-button"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </IslamicCard>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Need to modify questions? This feature is coming soon.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/sets/${setId}/responses`}>
                View Responses Instead
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

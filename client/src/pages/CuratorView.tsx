import { useRoute } from "wouter";
import { usePublicSet, useCuratorResponses } from "@/hooks/use-responses";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MessageSquareQuote, Calendar, Globe, Shield, User } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast-custom";

export default function CuratorView() {
  const [, params] = useRoute("/sets/curator/:token");
  const token = params?.token || "";
  const { t } = useLanguage();
  const { addToast } = useToast();

  // Get curator email from query params or prompt
  const searchParams = new URLSearchParams(window.location.search);
  const [curatorEmail, setCuratorEmail] = useState<string>(
    searchParams.get("email") || ""
  );
  const [emailSubmitted, setEmailSubmitted] = useState(!!searchParams.get("email"));

  const { data: set, isLoading: setLoading, error: setError } = usePublicSet(token);
  const { data: responses, isLoading: responsesLoading, error: responsesError } = 
    useCuratorResponses(token, emailSubmitted ? curatorEmail : null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!curatorEmail || !curatorEmail.includes("@")) {
      addToast({
        type: "error",
        title: "Invalid Email",
        description: "Please enter a valid email address",
        duration: 4000,
      });
      return;
    }
    setEmailSubmitted(true);
    // Update URL with email query param
    window.history.pushState({}, "", `/sets/curator/${token}?email=${encodeURIComponent(curatorEmail)}`);
  };

  if (setLoading) {
    return (
      <div className="min-h-screen bg-pattern">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (setError || !set) {
    return (
      <div className="min-h-screen bg-pattern">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Set not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If email not submitted, show email input form
  if (!emailSubmitted) {
    return (
      <div className="min-h-screen bg-pattern">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Curator Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="curator-email">Curator Email</Label>
                  <Input
                    id="curator-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={curatorEmail}
                    onChange={(e) => setCuratorEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the email address that was granted curator access for this question set.
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  Access Responses
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Verify curator email matches
  if (set.answererCuratorEmail !== curatorEmail) {
    return (
      <div className="min-h-screen bg-pattern">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-md">
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                The email address you provided does not match the curator email for this question set.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (responsesLoading) {
    return (
      <div className="min-h-screen bg-pattern">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (responsesError) {
    return (
      <div className="min-h-screen bg-pattern">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-destructive">
                {(responsesError as Error).message || "Failed to load responses"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Question Set Responses</h1>
              <p className="text-muted-foreground">
                Curating responses as: <span className="font-medium">{curatorEmail}</span>
              </p>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Curator View
            </Badge>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{set.questionerName}</h2>
                  <p className="text-sm text-muted-foreground">
                    Questions by: {set.questionerName || "Family Member"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <MessageSquareQuote className="w-3 h-3 mr-1" />
                    {set.questions.length} Questions
                  </Badge>
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(set.createdAt), "MMM d, yyyy")}
                  </Badge>
                  {set.defaultLocale && (
                    <Badge variant="secondary">
                      <Globe className="w-3 h-3 mr-1" />
                      {set.defaultLocale.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Responses ({responses?.length || 0})
            </h2>
          </div>

          {!responses || responses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquareQuote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No responses yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {responses.map((response: any) => (
                <Card key={response.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {response.responderName || "Anonymous"}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {response.submittedAt
                          ? format(new Date(response.submittedAt), "MMM d, yyyy 'at' h:mm a")
                          : "Unknown date"}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {set.questions.map((question: any) => {
                        const answer = response.answers?.find(
                          (a: any) => a.questionId === question.id
                        );
                        return (
                          <div key={question.id} className="border-l-2 border-primary/20 pl-4">
                            <h3 className="font-medium mb-2">{question.prompt}</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                              {answer?.value || "No answer provided"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


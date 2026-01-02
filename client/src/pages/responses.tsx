import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IslamicCard } from "@/components/ui/geometric-pattern";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Eye,
  Download,
  User,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { buildUrl } from "@shared/routes";
import type { ResponseWithDetails, QuestionSetWithQuestions } from "@shared/schema";

export default function ResponsesPage() {
  const [match, params] = useRoute("/dashboard/sets/:setId/responses");
  const setId = params?.setId;
  const { user } = useAuth();
  const [selectedResponse, setSelectedResponse] = useState<ResponseWithDetails | null>(null);

  // Fetch question set details
  const { data: questionSet } = useQuery<QuestionSetWithQuestions>({
    queryKey: [`/api/sets/${setId}`],
    enabled: !!setId && !!user,
  });

  // Fetch responses
  const { data: responses, isLoading } = useQuery<ResponseWithDetails[]>({
    queryKey: [`/api/sets/${setId}/responses`],
    enabled: !!setId && !!user,
  });

  if (!user) {
    window.location.href = "/api/login";
    return null;
  }

  if (!setId || !questionSet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Question Set Not Found</h2>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const exportToCSV = () => {
    if (!responses || !questionSet) return;

    const headers = [
      "Response ID",
      "Responder Name",
      "Submitted At",
      "Attestation Accepted",
      "Locale Used",
      ...questionSet.questions.map(q => q.prompt)
    ];

    const rows = responses.map(response => [
      response.id.toString(),
      response.responderName || "Anonymous",
      response.submittedAt ? new Date(response.submittedAt).toLocaleDateString() : "Unknown",
      response.attestationAcceptedAt ? "Yes" : "No",
      response.localeUsed,
      ...questionSet.questions.map(q => {
        const answer = response.answers.find(a => a.questionId === q.id);
        return answer?.value || "";
      })
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${questionSet.title.replace(/[^a-z0-9]/gi, '_')}_responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold">{questionSet.title}</h1>
                <p className="text-sm text-muted-foreground">Responses</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant={questionSet.isOpen ? "default" : "secondary"}>
                {questionSet.isOpen ? "Open" : "Closed"}
              </Badge>
              <Button onClick={exportToCSV} disabled={!responses?.length}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Responses List */}
          <div className="lg:col-span-1">
            <IslamicCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Responses</h2>
                <Badge variant="outline">{responses?.length || 0} total</Badge>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading responses...</p>
                </div>
              ) : !responses?.length ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No responses yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your question set to start collecting responses.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {responses.map((response) => (
                    <Card
                      key={response.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedResponse?.id === response.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedResponse(response)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm">
                              {response.responderName || "Anonymous"}
                            </span>
                          </div>
                          {response.attestationAcceptedAt && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{response.submittedAt ? formatDate(response.submittedAt.toString()) : "Unknown"}</span>
                          <Badge variant="outline" className="text-xs">
                            {response.localeUsed.toUpperCase()}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </IslamicCard>
          </div>

          {/* Response Details */}
          <div className="lg:col-span-2">
            {selectedResponse ? (
              <IslamicCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Response Details
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Submitted {selectedResponse.submittedAt ? formatDate(selectedResponse.submittedAt.toString()) : "Unknown"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {selectedResponse.localeUsed.toUpperCase()}
                    </Badge>
                    {selectedResponse.attestationAcceptedAt && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Attested
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Responder</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedResponse.responderName || "Anonymous"}
                      </p>
                    </div>
                  </div>

                  {selectedResponse.attestationAcceptedAt && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Attestation Accepted</p>
                        <p className="text-xs text-green-600">
                          Accepted at {new Date(selectedResponse.attestationAcceptedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="mb-6" />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Answers
                  </h3>

                  {questionSet.questions.map((question) => {
                    const answer = selectedResponse.answers.find(a => a.questionId === question.id);
                    return (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{question.prompt}</h4>
                          {question.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {question.type === "CHOICE" ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span>{answer?.value || "No answer provided"}</span>
                            </div>
                          ) : (
                            <div className="bg-background p-3 rounded border min-h-[2.5rem]">
                              {answer?.value || (
                                <span className="text-muted-foreground italic">No answer provided</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </IslamicCard>
            ) : (
              <IslamicCard className="p-12 text-center">
                <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Response</h3>
                <p className="text-muted-foreground">
                  Click on a response from the list to view its details and answers.
                </p>
              </IslamicCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

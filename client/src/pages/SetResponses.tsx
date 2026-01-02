import { useRoute } from "wouter";
import { useSet, useSetResponses } from "@/hooks/use-responses"; // Wait, need correct imports
import { useSet as useSetDetails } from "@/hooks/use-sets";
import { useSetResponses as useResponsesList } from "@/hooks/use-responses";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquareQuote, Calendar, Globe } from "lucide-react";

export default function SetResponses() {
  const [, params] = useRoute("/sets/:id");
  const id = parseInt(params?.id || "0");
  
  const { data: set, isLoading: setLoading } = useSetDetails(id);
  const { data: responses, isLoading: responsesLoading } = useResponsesList(id);

  if (setLoading) return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  if (!set) return <div>Not found</div>;

  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-primary mb-2">{set.title}</h1>
          <p className="text-muted-foreground max-w-2xl">{set.description}</p>
        </header>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Stats/Filter Sidebar (could be expanded) */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Total Responses</div>
                <div className="text-2xl font-bold text-foreground">{responses?.length || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Responses List */}
          <div className="lg:col-span-3 space-y-4">
            {responsesLoading ? (
              [1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)
            ) : responses?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No responses yet.</div>
            ) : (
              responses?.map((response: any) => (
                <Card key={response.id} className="overflow-hidden border-l-4 border-l-primary/40">
                  <CardHeader className="bg-muted/30 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">
                          {response.responderName || "Anonymous"}
                        </span>
                        {response.attestationAcceptedAt && (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                            Attested
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" /> {response.localeUsed === 'en' ? 'English' : 'Bangla'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {format(new Date(response.submittedAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {response.answers.map((answer: any, idx: number) => (
                        <div key={answer.id} className="border-b last:border-0 px-6 py-4 hover:bg-muted/10 transition-colors">
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            {answer.question.prompt}
                          </p>
                          <div className="flex gap-3">
                            <MessageSquareQuote className="w-5 h-5 text-primary/40 shrink-0 mt-0.5" />
                            <p className="text-foreground whitespace-pre-wrap">{answer.value}</p>
                          </div>
                        </div>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

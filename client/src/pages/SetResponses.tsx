import { useRoute } from "wouter";
import { useSetResponses } from "@/hooks/use-responses";
import { useSet } from "@/hooks/use-sets";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquareQuote, Calendar, Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function SetResponses() {
  const [, params] = useRoute("/sets/:id");
  const id = parseInt(params?.id || "0");
  const { t } = useLanguage();

  const { data: set, isLoading: setLoading } = useSet(id);
  const { data: responses, isLoading: responsesLoading } = useSetResponses(id);

  if (setLoading) return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  if (!set) return <div>Not found</div>;

  // If set is single-response and user has already submitted, show the dua/success UI
  if (set && !set.allowMultipleSubmissions && responses?.length === 1) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm max-w-2xl w-full rounded-3xl shadow-xl border border-primary/20 overflow-hidden">
          <div className="flex">
            {/* Left Section - Islamic Greeting */}
            <div className="flex-1 bg-gradient-to-br from-primary/5 via-primary/3 to-accent/5 p-8 text-center flex flex-col justify-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold font-serif text-primary mb-2">
                  جزاك الله خيراً
                </h2>
                <p className="text-xl text-primary font-medium">
                  JazakAllah Khair
                </p>
                <p className="text-muted-foreground leading-relaxed text-base mt-4">
                  {t("response.success")}
                </p>
                <p className="text-base text-muted-foreground mt-2">
                  You have already submitted a response for this set. Only one response is allowed.
                </p>
              </div>
            </div>
            {/* Right Section - Islamic Blessings */}
            <div className="flex-1 bg-gradient-to-br from-emerald-50 via-primary/5 to-amber-50 p-8 flex flex-col justify-center">
              <div className="space-y-4">
                <p className="text-sm text-emerald-800 leading-relaxed italic text-center">
                  "May Allah bless you with the best partner and fill your life with barakah and happiness. 🤲"
                </p>
                <p className="text-xs text-emerald-700 font-medium text-center mt-4">
                  May your sincere responses bring you closer to finding your ideal Islamic marriage partner through divine guidance.
                </p>
              </div>
            </div>
          </div>
          {/* Powered by SabrSpace Banner */}
          <div className="bg-gradient-to-r from-primary/8 via-primary/4 to-accent/8 border-t border-primary/15 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Powered by</span>
                <span className="font-bold text-primary">SabrSpace</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ...existing code...
  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* ...existing code... */}
      </main>
    </div>
  );
}

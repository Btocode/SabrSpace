import { Navbar } from "@/components/Navbar";
import { CreateSetForm } from "@/components/CreateSetForm";
import { useLanguage } from "@/lib/i18n";
import { useState } from "react";

export default function CreateSet() {
  const { t } = useLanguage();
  const [createdSetUrl, setCreatedSetUrl] = useState<string | null>(null);

  // Pass setCreatedSetUrl to CreateSetForm so it can update the parent state
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {!createdSetUrl && (
          <>
            <h1 className="text-3xl font-bold font-serif mb-2 text-center text-primary">{t("set.create")}</h1>
            <p className="text-center text-muted-foreground mb-2">Design questions that matter.</p>
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg px-4 py-3 text-sm text-center">
                Please ensure your questions are <span className="font-semibold">polite, appropriate, and based on Islamic guidelines</span>. No question should go against our <a href="/terms" className="underline hover:text-primary">Terms and Service</a>.
              </div>
            </div>
          </>
        )}
        <CreateSetForm setCreatedSetUrl={setCreatedSetUrl} createdSetUrl={createdSetUrl} />
      </div>
    </div>
  );
}

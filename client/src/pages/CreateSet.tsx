import { Navbar } from "@/components/Navbar";
import { CreateSetForm } from "@/components/CreateSetForm";
import { useLanguage } from "@/lib/i18n";

export default function CreateSet() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-serif mb-2 text-center text-primary">{t("set.create")}</h1>
        <p className="text-center text-muted-foreground mb-12">Design questions that matter.</p>
        <CreateSetForm />
      </div>
    </div>
  );
}

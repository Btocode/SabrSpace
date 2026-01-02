import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

export function Bismillah({ className }: { className?: string }) {
  const { locale } = useLanguage();
  
  return (
    <div className={cn("text-center py-6 select-none opacity-80", className)}>
      <div className="font-serif text-3xl md:text-4xl text-primary/80" dir="rtl">
        بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </div>
      <p className="text-xs text-muted-foreground mt-2 font-medium tracking-widest uppercase opacity-60">
        {locale === 'en' ? 'In the name of Allah, the Beneficent, the Merciful' : 'পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে'}
      </p>
    </div>
  );
}

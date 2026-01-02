import React, { createContext, useContext, useState, ReactNode } from "react";

type Locale = "en" | "bn";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    "app.name": "SabrSpace",
    "app.tagline": "Share questions, receive honest answers.",
    "nav.login": "Login",
    "nav.dashboard": "Dashboard",
    "nav.create": "Create Set",
    "nav.logout": "Logout",
    "hero.title": "Meaningful Conversations, Simplified.",
    "hero.subtitle": "Create secure, anonymous (optional) question sets for your community, students, or team. Foster honesty and reflection.",
    "hero.cta": "Get Started",
    "hero.secondary": "Learn More",
    "features.title": "Why SabrSpace?",
    "footer.rights": "All rights reserved.",
    "dashboard.welcome": "Welcome back",
    "dashboard.stats": "Overview",
    "dashboard.sets": "My Question Sets",
    "dashboard.noSets": "You haven't created any sets yet.",
    "set.create": "Create New Set",
    "set.title": "Title",
    "set.desc": "Description",
    "set.questions": "Questions",
    "set.settings": "Settings",
    "set.allowAnonymous": "Allow Anonymous Responses",
    "set.requireAttestation": "Require Religious Attestation",
    "set.save": "Save Set",
    "set.share": "Share Link",
    "set.viewResponses": "View Responses",
    "response.name": "Your Name",
    "response.anonymous": "Anonymous",
    "response.submit": "Submit Response",
    "response.attestation": "I testify in the name of Allah that my answers are truthful and sincere.",
    "response.success": "JazakAllah Khair! Your response has been submitted.",
    "bismillah": "In the name of Allah, the Most Gracious, the Most Merciful"
  },
  bn: {
    "app.name": "সবরস্পেস",
    "app.tagline": "প্রশ্ন শেয়ার করুন, সৎ উত্তর পান।",
    "nav.login": "লগইন",
    "nav.dashboard": "ড্যাশবোর্ড",
    "nav.create": "তৈরি করুন",
    "nav.logout": "লগআউট",
    "hero.title": "অর্থপূর্ণ কথোপকথন, সহজ করা হয়েছে।",
    "hero.subtitle": "আপনার কমিউনিটি, ছাত্র বা দলের জন্য নিরাপদ, বেনামী (ঐচ্ছিক) প্রশ্ন সেট তৈরি করুন। সততা এবং চিন্তাভাবনাকে উৎসাহিত করুন।",
    "hero.cta": "শুরু করুন",
    "hero.secondary": "আরও জানুন",
    "features.title": "কেন সবরস্পেস?",
    "footer.rights": "সর্বস্বত্ব সংরক্ষিত।",
    "dashboard.welcome": "স্বাগতম",
    "dashboard.stats": "একনজরে",
    "dashboard.sets": "আমার প্রশ্ন সেট",
    "dashboard.noSets": "আপনি এখনও কোনো সেট তৈরি করেননি।",
    "set.create": "নতুন সেট তৈরি করুন",
    "set.title": "শিরোনাম",
    "set.desc": "বিবরণ",
    "set.questions": "প্রশ্নাবলী",
    "set.settings": "সেটিংস",
    "set.allowAnonymous": "বেনামী উত্তর অনুমোদন করুন",
    "set.requireAttestation": "ধর্মীয় শপথ আবশ্যক",
    "set.save": "সংরক্ষণ করুন",
    "set.share": "লিঙ্ক শেয়ার করুন",
    "set.viewResponses": "উত্তর দেখুন",
    "response.name": "আপনার নাম",
    "response.anonymous": "বেনামী",
    "response.submit": "জমা দিন",
    "response.attestation": "আমি আল্লাহর নামে সাক্ষ্য দিচ্ছি যে আমার উত্তরগুলো সত্য এবং আন্তরিক।",
    "response.success": "জাযাকআল্লাহ খায়ের! আপনার উত্তর জমা দেওয়া হয়েছে।",
    "bismillah": "বিসমিল্লাহির রাহমানির রাহিম"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = (key: string) => {
    return (translations[locale] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRTL: false }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

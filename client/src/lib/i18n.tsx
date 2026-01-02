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
    "hero.badge": "Built for Ihsan",
    "nav.login": "Login",
    "nav.dashboard": "Dashboard",
    "nav.create": "Create Set",
    "nav.logout": "Logout",
    "hero.title": "Meaningful Conversations, Simplified.",
    "hero.subtitle": "Create secure, anonymous (optional) question sets for your community, students, or team. Foster honesty and reflection.",
    "hero.cta": "Get Started",
    "hero.secondary": "Learn More",
    "features.title": "Why SabrSpace?",
    "features.private.title": "Private & Secure",
    "features.private.desc": "Your data is handled with Amanah (trust). Encrypted and secure by default.",
    "features.honest.title": "Honest Feedback",
    "features.honest.desc": "Optional anonymity encourages truthful, sincere answers from your community.",
    "features.clean.title": "Clean Experience",
    "features.clean.desc": "No ads, no tracking, no distractions. Just pure conversation.",
    "footer.rights": "All rights reserved.",
    "dashboard.welcome": "Welcome back",
    "dashboard.stats": "Overview",
    "dashboard.sets": "My Question Sets",
    "dashboard.noSets": "You haven't created any sets yet.",
    "dashboard.totalSets": "Total Sets",
    "dashboard.totalResponses": "Total Responses",
    "dashboard.totalViews": "Total Views",
    "dashboard.closed": "Closed",
    "dashboard.share": "Share",
    "dashboard.viewResponses": "View Responses",
    "dashboard.viewPublicPage": "View Public Page",
    "dashboard.delete": "Delete",
    "responses.total": "Total Responses",
    "responses.noResponses": "No responses yet.",
    "responses.anonymous": "Anonymous",
    "responses.attested": "Attested",
    "responses.english": "English",
    "responses.bangla": "Bangla",
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
    "response.notFound": "Set not found or closed.",
    "response.submitAnother": "Submit Another Response",
    "login.welcome": "Welcome to SabrSpace",
    "login.choose": "Choose how you'd like to continue",
    "login.quickStart": "Quick Start",
    "login.continueAnonymously": "Continue anonymously to explore and create question sets without signing up.",
    "set.savePrompt": "Save Your Question Set",
    "set.saveDesc": "To save your question set and receive responses, please provide an email address or create an account.",
    "set.emailRequired": "Please enter an email address to save your set.",
    "set.cancel": "Cancel",
    "set.saveWithEmail": "Save with Email",
    "set.copied": "Link copied to clipboard",
    "set.validationError": "Please fill all required fields.",
    "bismillah": "In the name of Allah, the Most Gracious, the Most Merciful"
  },
  bn: {
    "app.name": "সবরস্পেস",
    "app.tagline": "প্রশ্ন শেয়ার করুন, সৎ উত্তর পান।",
    "hero.badge": "ইহসানের জন্য তৈরি",
    "nav.login": "লগইন",
    "nav.dashboard": "ড্যাশবোর্ড",
    "nav.create": "তৈরি করুন",
    "nav.logout": "লগআউট",
    "hero.title": "অর্থপূর্ণ কথোপকথন, সহজ করা হয়েছে।",
    "hero.subtitle": "আপনার কমিউনিটি, ছাত্র বা দলের জন্য নিরাপদ, বেনামী (ঐচ্ছিক) প্রশ্ন সেট তৈরি করুন। সততা এবং চিন্তাভাবনাকে উৎসাহিত করুন।",
    "hero.cta": "শুরু করুন",
    "hero.secondary": "আরও জানুন",
    "features.title": "কেন সবরস্পেস?",
    "features.private.title": "ব্যক্তিগত এবং নিরাপদ",
    "features.private.desc": "আপনার ডেটা আমানাহ (বিশ্বাস) দিয়ে পরিচালিত হয়। ডিফল্টভাবে এনক্রিপ্টেড এবং নিরাপদ।",
    "features.honest.title": "সৎ প্রতিক্রিয়া",
    "features.honest.desc": "ঐচ্ছিক বেনামীত্ব আপনার সম্প্রদায় থেকে সত্যবাদী এবং আন্তরিক উত্তর উৎসাহিত করে।",
    "features.clean.title": "পরিষ্কার অভিজ্ঞতা",
    "features.clean.desc": "কোনো বিজ্ঞাপন নেই, কোনো ট্র্যাকিং নেই, কোনো বিভ্রান্তি নেই। শুধুমাত্র বিশুদ্ধ কথোপকথন।",
    "footer.rights": "সর্বস্বত্ব সংরক্ষিত।",
    "dashboard.welcome": "স্বাগতম",
    "dashboard.stats": "একনজরে",
    "dashboard.sets": "আমার প্রশ্ন সেট",
    "dashboard.noSets": "আপনি এখনও কোনো সেট তৈরি করেননি।",
    "dashboard.totalSets": "মোট সেট",
    "dashboard.totalResponses": "মোট উত্তর",
    "dashboard.totalViews": "মোট দেখা",
    "dashboard.closed": "বন্ধ",
    "dashboard.share": "শেয়ার",
    "dashboard.viewResponses": "উত্তর দেখুন",
    "dashboard.viewPublicPage": "পাবলিক পেজ দেখুন",
    "dashboard.delete": "মুছুন",
    "responses.total": "মোট উত্তর",
    "responses.noResponses": "এখনও কোনো উত্তর নেই।",
    "responses.anonymous": "বেনামী",
    "responses.attested": "শপথ করা",
    "responses.english": "ইংরেজি",
    "responses.bangla": "বাংলা",
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
    "response.notFound": "সেট পাওয়া যায়নি বা বন্ধ করা হয়েছে।",
    "response.submitAnother": "আরেকটি উত্তর জমা দিন",
    "login.welcome": "সবরস্পেসে স্বাগতম",
    "login.choose": "আপনি কীভাবে চালিয়ে যেতে চান তা চয়ন করুন",
    "login.quickStart": "দ্রুত শুরু",
    "login.continueAnonymously": "সাইন আপ না করে প্রশ্ন সেট তৈরি এবং অন্বেষণ করতে বেনামীভাবে চালিয়ে যান।",
    "set.savePrompt": "আপনার প্রশ্ন সেট সংরক্ষণ করুন",
    "set.saveDesc": "আপনার প্রশ্ন সেট সংরক্ষণ করতে এবং উত্তর পেতে, একটি ইমেল ঠিকানা প্রদান করুন বা একটি অ্যাকাউন্ট তৈরি করুন।",
    "set.emailRequired": "আপনার সেট সংরক্ষণ করতে একটি ইমেল ঠিকানা লিখুন।",
    "set.cancel": "বাতিল করুন",
    "set.saveWithEmail": "ইমেল দিয়ে সংরক্ষণ করুন",
    "set.copied": "লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে",
    "set.validationError": "সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন।",
    "bismillah": "বিসমিল্লাহির রাহমানির রাহিম"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize language from localStorage or default to "en"
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sabrspace-language');
      return (saved === 'en' || saved === 'bn') ? saved : 'en';
    }
    return 'en';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sabrspace-language', newLocale);
    }
  };

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

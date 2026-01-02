import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GeometricPattern } from "@/components/ui/geometric-pattern";
import {
  Shield,
  Globe,
  Lock,
  Heart,
  ArrowRight,
  Sparkles,
  Languages
} from "lucide-react";
import { Link } from "wouter";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const content = {
    en: {
      title: "SabrSpace",
      subtitle: "A sanctuary for meaningful conversations",
      description: "Create thoughtful question sets, share with intention, and receive responses in a safe, Islamic-inspired environment.",
      cta: "Create Your First Set",
      features: {
        title: "Why Choose SabrSpace?",
        items: [
          {
            icon: Shield,
            title: "Respectful Environment",
            description: "Optional Islamic attestation ensures sincerity and thoughtfulness in every response."
          },
          {
            icon: Globe,
            title: "Universal Language",
            description: "Full English and Bangla support with beautiful typography for authentic expression."
          },
          {
            icon: Lock,
            title: "Divine Privacy",
            description: "Cryptographically secure sharing with anonymous options and complete data protection."
          },
          {
            icon: Heart,
            title: "Islamic Essence",
            description: "Peaceful design with sacred geometric patterns and calming color palette."
          }
        ]
      },
      footer: "Built with intention for meaningful dialogue"
    },
    bn: {
      title: "সাবরস্পেস",
      subtitle: "অর্থপূর্ণ কথোপকথনের জন্য একটি পবিত্র স্থান",
      description: "চিন্তাশীল প্রশ্ন সেট তৈরি করুন, উদ্দেশ্য নিয়ে শেয়ার করুন, এবং একটি নিরাপদ, ইসলামিক-অনুপ্রাণিত পরিবেশে উত্তর পান।",
      cta: "আপনার প্রথম সেট তৈরি করুন",
      features: {
        title: "কেন সাবরস্পেস বেছে নেবেন?",
        items: [
          {
            icon: Shield,
            title: "সম্মানজনক পরিবেশ",
            description: "ঐচ্ছিক ইসলামিক সাক্ষ্য প্রতিটি উত্তরে আন্তরিকতা এবং চিন্তাশীলতা নিশ্চিত করে।"
          },
          {
            icon: Globe,
            title: "সর্বজনীন ভাষা",
            description: "প্রামাণিক অভিব্যক্তির জন্য সুন্দর টাইপোগ্রাফি সহ সম্পূর্ণ ইংরেজি এবং বাংলা সমর্থন।"
          },
          {
            icon: Lock,
            title: "ঐশ্বরিক গোপনীয়তা",
            description: "গোপন বিকল্প এবং সম্পূর্ণ ডেটা সুরক্ষা সহ ক্রিপ্টোগ্রাফিকভাবে সুরক্ষিত ভাগ করে নেওয়া।"
          },
          {
            icon: Heart,
            title: "ইসলামিক সারাংশ",
            description: "পবিত্র জ্যামিতিক নিদর্শন এবং শান্ত রঙের প্যালেট সহ শান্তিপূর্ণ ডিজাইন।"
          }
        ]
      },
      footer: "অর্থপূর্ণ সংলাপের জন্য উদ্দেশ্য নিয়ে তৈরি"
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dark Sanctuary Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800" />

      {/* Deep Mystical Layers */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 via-transparent to-purple-800/25" />
      <div className="absolute inset-0 bg-gradient-to-bl from-slate-800/20 via-violet-900/15 to-indigo-900/20" />

      {/* Islamic Geometric Artworks */}
      <div className="absolute inset-0">
        {/* Large Central Motif */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10">
          <div className="w-full h-full border-4 border-amber-200 rounded-full animate-spin-slow"></div>
          <div className="absolute inset-8 border-2 border-emerald-300 rounded-full animate-spin-slow-reverse"></div>
          <div className="absolute inset-16 border border-teal-200 rounded-full"></div>
        </div>

        {/* Corner Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-amber-300/30 rotate-45">
          <div className="absolute inset-2 border border-emerald-400/40 rotate-12"></div>
          <div className="absolute inset-4 border border-teal-300/50 -rotate-12"></div>
        </div>

        <div className="absolute top-32 right-16 w-24 h-24 border border-purple-400/30 rounded-full">
          <div className="absolute inset-3 border border-rose-400/40 rounded-full"></div>
          <div className="absolute inset-6 border border-gold-400/50 rounded-full"></div>
        </div>

        <div className="absolute bottom-24 left-16 w-28 h-28 border-2 border-emerald-300/30 -rotate-30">
          <div className="absolute inset-3 border border-teal-400/40 rotate-45"></div>
        </div>

        <div className="absolute bottom-32 right-24 w-20 h-20 border border-amber-300/30 rounded-full">
          <div className="absolute inset-2 border border-purple-400/40 rounded-full animate-pulse"></div>
        </div>

        {/* Floating Islamic Stars */}
        <div className="absolute top-1/4 left-1/4 text-4xl text-amber-200/40 animate-float">٭</div>
        <div className="absolute top-1/3 right-1/3 text-3xl text-emerald-300/50 animate-float delay-1000">✦</div>
        <div className="absolute bottom-1/4 left-1/3 text-5xl text-teal-200/30 animate-float delay-500">٭</div>
        <div className="absolute bottom-1/3 right-1/4 text-4xl text-purple-300/40 animate-float delay-1500">✧</div>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-amber-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-l from-purple-500/15 to-teal-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-rose-400/20 to-gold-400/10 rounded-full blur-2xl animate-pulse delay-2000" />

      {/* Minimal Artistic Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        {/* Dark Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-purple-900/90 to-slate-800/95 backdrop-blur-2xl border-b border-indigo-400/20"></div>

        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-2 left-10 w-16 h-16 border border-amber-400/20 rotate-45"></div>
          <div className="absolute top-3 right-16 w-12 h-12 border border-emerald-400/20 rounded-full"></div>
        </div>

        <div className="relative container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Minimal Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shadow-lg group-hover:shadow-indigo-400/30 transition-all duration-300 group-hover:scale-110">
                <Sparkles className="w-5 h-5 text-slate-900" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                {currentContent.title}
              </h1>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="group relative p-2 rounded-lg hover:bg-indigo-400/10 transition-all duration-300"
            >
              <Languages className="w-4 h-4 text-indigo-200 group-hover:text-indigo-100 transition-colors" />
              <div className="absolute inset-0 rounded-lg border border-indigo-400/20 group-hover:border-indigo-400/40 transition-colors"></div>
            </button>

            {/* Dashboard Link */}
            <Link href="/dashboard" className="group relative">
              <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-400/10 to-purple-400/10 hover:from-indigo-400/20 hover:to-purple-400/20 border border-indigo-400/20 hover:border-indigo-400/40 transition-all duration-300 backdrop-blur-sm">
                <span className="text-sm font-medium text-indigo-200 group-hover:text-indigo-100 transition-colors">
                  Dashboard
                </span>
              </div>
            </Link>

            {/* Decorative Element */}
            <div className="hidden md:block w-px h-6 bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent"></div>

            {/* Islamic Star */}
            <div className="hidden md:block text-indigo-300/40 text-lg animate-pulse">
              ✦
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"></div>
      </nav>

      {/* Compact Hero Section */}
      <section className={`relative z-10 pt-32 pb-20 px-4 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="container mx-auto text-center max-w-6xl">
          {/* Mystical Logo */}
          <div className="mb-8 relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-400 via-purple-400 to-violet-400 rounded-2xl shadow-2xl mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-900"></div>
              <Sparkles className="w-10 h-10 text-indigo-300 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 animate-pulse"></div>
            </div>
            {/* Mystical decorative elements */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-indigo-400/60 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -right-3 w-3 h-3 bg-purple-400/60 rounded-full animate-pulse delay-500"></div>
          </div>

          {/* Ethereal Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-violet-300 bg-clip-text text-transparent drop-shadow-2xl">
            {currentContent.title}
          </h1>

          {/* Mystical Subtitle */}
          <p className="text-xl md:text-2xl text-indigo-100 mb-4 font-medium leading-relaxed">
            {currentContent.subtitle}
          </p>

          {/* Deep Description */}
          <p className="text-lg md:text-xl text-purple-100/90 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            {currentContent.description}
          </p>

          {/* Enchanted CTA */}
          <div className="mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 hover:from-indigo-500 hover:via-purple-500 hover:to-violet-500 text-slate-900 px-10 py-4 text-lg font-bold shadow-2xl hover:shadow-indigo-400/25 transition-all duration-500 transform hover:scale-105 border-0 rounded-xl"
              asChild
            >
              <Link href="/dashboard">
                {currentContent.cta}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Mystical Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-400/20 to-purple-400/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-400/30">
              <div className="text-2xl font-black text-indigo-300 mb-1">1000+</div>
              <div className="text-xs text-purple-200 font-medium">Question Sets</div>
            </div>
            <div className="bg-gradient-to-br from-purple-400/20 to-violet-400/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <div className="text-2xl font-black text-purple-300 mb-1">5000+</div>
              <div className="text-xs text-violet-200 font-medium">Responses</div>
            </div>
            <div className="bg-gradient-to-br from-violet-400/20 to-indigo-400/20 backdrop-blur-sm rounded-xl p-4 border border-violet-400/30">
              <div className="text-2xl font-black text-violet-300 mb-1">50+</div>
              <div className="text-xs text-indigo-200 font-medium">Creators</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Mystical Features Section */}
      <section className="relative z-10 py-16 px-4 bg-gradient-to-b from-slate-900/30 via-purple-900/40 to-slate-800/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-indigo-200 mb-6 leading-tight drop-shadow-lg">
              {currentContent.features.title}
            </h2>
            <p className="text-lg md:text-xl text-purple-100/80 max-w-2xl mx-auto leading-relaxed">
              Experience the perfect blend of technology and spirituality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentContent.features.items.map((feature, index) => {
              const IconComponent = feature.icon;
              const colors = [
                { bg: 'from-indigo-400/20 to-purple-400/20', border: 'border-indigo-400/30', icon: 'text-indigo-300' },
                { bg: 'from-purple-400/20 to-violet-400/20', border: 'border-purple-400/30', icon: 'text-purple-300' },
                { bg: 'from-violet-400/20 to-indigo-400/20', border: 'border-violet-400/30', icon: 'text-violet-300' },
                { bg: 'from-slate-400/20 to-indigo-400/20', border: 'border-slate-400/30', icon: 'text-slate-300' }
              ];
              const colorScheme = colors[index % colors.length];

              return (
                <div key={index} className={`group relative bg-gradient-to-br ${colorScheme.bg} backdrop-blur-xl rounded-2xl p-8 border ${colorScheme.border} hover:border-indigo-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-400/20`}>
                  <div className="relative z-10">
                    <div className={`w-14 h-14 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-indigo-400/50 transition-all duration-300 group-hover:scale-110`}>
                      <IconComponent className={`w-7 h-7 ${colorScheme.icon}`} />
                    </div>
                    <h3 className="text-xl font-bold text-indigo-100 mb-4 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-purple-100/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Mystical corner elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-400/30 rounded-tr-lg"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-purple-400/30 rounded-bl-lg"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dark Mystical Footer */}
      <footer className="relative z-10 bg-gradient-to-t from-slate-900/80 via-purple-900/60 to-slate-800/40 backdrop-blur-xl py-16 px-4 border-t border-indigo-400/20">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-violet-400 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-300" />
                </div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur opacity-40"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-violet-300 bg-clip-text text-transparent drop-shadow-lg">
              {currentContent.title}
            </span>
          </div>

          <p className="text-purple-100/70 mb-8 text-lg">
            {currentContent.footer}
          </p>

          {/* Mystical Islamic Pattern */}
          <div className="flex justify-center items-center space-x-6 text-indigo-300/60 mb-6">
            <div className="w-8 h-8 border-2 border-indigo-400/40 rounded-full flex items-center justify-center">
              <span className="text-sm">٭</span>
            </div>
            <div className="w-6 h-6 border border-purple-400/40 rotate-45"></div>
            <div className="w-8 h-8 border-2 border-violet-400/40 rounded-full"></div>
            <div className="w-6 h-6 border border-slate-400/40 -rotate-45"></div>
            <div className="w-8 h-8 border-2 border-indigo-400/40 rounded-full flex items-center justify-center">
              <span className="text-sm">٭</span>
            </div>
          </div>

          {/* Mystical gradient line */}
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent mx-auto"></div>
        </div>
      </footer>
    </div>
  );
}

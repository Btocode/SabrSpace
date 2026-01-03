import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, MessageSquare, Heart } from "lucide-react";

export default function Home() {
  const { t, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-pattern flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground font-medium text-sm mb-8 border border-accent/20">
                <Heart className="w-4 h-4 fill-accent text-accent" />
                <span className="text-foreground font-serif tracking-wide">{t("hero.badge")}</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
                {t("hero.title")}
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed font-light">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/biodata/create">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    Create Biodata
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/create">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-primary/20 hover:bg-primary/5">
                    Ask Questions
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="ghost" size="lg" className="h-14 px-8 text-lg rounded-full">
                    Join Community
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative Gradient Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white/50 border-t border-border/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
                Everything you need for a blessed journey
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover tools designed for the modern Muslim, blending tradition with elegant technology.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: <ShieldCheck className="w-8 h-8 text-teal-600" />,
                  title: "Premium Biodata Builder",
                  desc: "Create a detailed 8-step marriage biodata with religious markers, family details, and lifestyle preferences. Save drafts and edit anytime."
                },
                {
                  icon: <MessageSquare className="w-8 h-8 text-amber-600" />,
                  title: "Anonymous Question Sets",
                  desc: "Ask the questions that matter most. Collect responses anonymously or named, with optional religious attestation for total honesty."
                },
                {
                  icon: <Heart className="w-8 h-8 text-rose-500" />,
                  title: "Sabr Community Feed",
                  desc: "Engage with a respectful community. View biodata summaries, participate in discussions, and vote on community questions."
                },
                {
                  icon: <MessageSquare className="w-8 h-8 text-primary" />,
                  title: "Islamic Wisdom",
                  desc: "Experience the feed enriched with AI-curated Quranic verses, Hadiths, and timeless Islamic quotes for daily inspiration."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center mb-6 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-serif">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p>&copy; {new Date().getFullYear()} {t("app.name")}. {t("footer.rights")}</p>
      </footer>
    </div>
  );
}

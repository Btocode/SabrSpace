import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, MessageSquare, Heart, Sparkles, Moon, Sun } from "lucide-react";

export default function Home() {
  const { t, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-pattern flex flex-col selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 relative">
        {/* Background Geometric Pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none -z-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l40 40-40 40L0 40z' fill='%230f766e' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-40">
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 text-accent-foreground font-medium text-sm mb-10 border border-accent/20 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-accent-foreground/90 font-serif tracking-widest uppercase text-xs">A Space for Sincere Connection</span>
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl font-bold text-primary mb-8 leading-[1.1] font-serif tracking-tight">
                {t("hero.title")}
              </h1>
              
              <p className="text-xl md:text-3xl text-muted-foreground mb-12 leading-relaxed font-light max-w-2xl mx-auto">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/demo">
                  <Button size="lg" className="h-16 px-10 text-xl rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 bg-primary hover:bg-primary/90">
                    {t("hero.cta")}
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="h-16 px-10 text-xl rounded-full border-primary/20 hover:bg-primary/5">
                    {t("hero.secondary")}
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -z-10 animate-pulse" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif tracking-tight">
                Built with <span className="text-primary italic">Amanah</span>
              </h2>
              <div className="w-24 h-1 bg-accent/30 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {[
                {
                  icon: <ShieldCheck className="w-10 h-10" />,
                  title: "Private & Secure",
                  desc: "Your data is handled with Amanah (trust). Privacy-focused and secure by default.",
                  color: "bg-teal-50 text-teal-700 border-teal-100"
                },
                {
                  icon: <MessageSquare className="w-10 h-10" />,
                  title: "Honest Feedback",
                  desc: "Optional anonymity encourages truthful, sincere answers within your circle.",
                  color: "bg-amber-50 text-amber-700 border-amber-100"
                },
                {
                  icon: <Sparkles className="w-10 h-10" />,
                  title: "Premium Experience",
                  desc: "A calm, minimalist aesthetic designed to foster meaningful Islamic values.",
                  color: "bg-rose-50 text-rose-700 border-rose-100"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group bg-card p-10 rounded-[2.5rem] shadow-sm border border-border/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className={`w-20 h-20 rounded-3xl ${feature.color} border flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-serif text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-20 bg-primary/5 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6 italic text-primary/80 text-xl font-serif">
               "Say the truth, even if it is bitter."
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-sm text-muted-foreground border-t border-border bg-card/30 backdrop-blur-md">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-lg font-serif text-primary">SabrSpace</div>
          <p className="opacity-70">&copy; {new Date().getFullYear()} SabrSpace. {t("footer.rights")}</p>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">Privacy</Button>
            <Button variant="ghost" size="sm">Terms</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

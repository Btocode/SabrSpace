import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Heart,
  Users,
  FileText,
  Sparkles,
  Crown,
  BookOpen,
  Star,
  Quote
} from "lucide-react";

export default function Home() {
  const { t, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-pattern flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        {/* Hero Section */}
<section className="relative overflow-hidden min-h-[calc(100vh-64px)] flex items-center">
  {/* Background layers */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-amber-500/10" />
    <div className="absolute -top-32 -left-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
    <div className="absolute -bottom-40 -right-48 h-[560px] w-[560px] rounded-full bg-amber-500/10 blur-3xl" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.12),transparent_55%)]" />
  </div>

  <div className="container mx-auto px-4 relative z-10 py-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
      className=" mx-auto"
    >
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* Left content */}
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
            <Heart className="w-4 h-4 fill-primary text-primary" />
            <span className="text-foreground font-serif tracking-wide">
              Guiding Hearts Together
            </span>
              </div>
              
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-5 leading-tight font-serif">
            Reduce the{" "}
            <span className="text-primary">complexity</span> of marriage—
            <br className="hidden md:block" />
            <span className="text-amber-700"> learn</span>,{" "}
            <span className="text-emerald-700">connect</span>, and{" "}
            <span className="text-primary">move forward</span>.
              </h1>
              
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
            SabrSpace helps you share Islamic marriage knowledge, build a supportive community,
            and make searching + communication easier with structured biodata and meaningful questions.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-xl">
            <Link href="/biodata/create">
              <Button size="lg" className="rounded-full gap-2 shadow-lg shadow-primary/20 w-full sm:w-auto">
                Create your biodata <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/community">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-primary/20 hover:bg-primary/5 w-full sm:w-auto"
              >
                Join the community
              </Button>
            </Link>

            <Link href="/marriage-guide">
              <Button size="lg" variant="ghost" className="rounded-full w-full sm:w-auto">
                Read the marriage guide
              </Button>
            </Link>
          </div>

          {/* Trust / intent row */}
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/60 border border-border px-3 py-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Faith-first & respectful
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/60 border border-border px-3 py-1">
              <Sparkles className="w-4 h-4 text-primary" />
              Clear, guided steps
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/60 border border-border px-3 py-1">
              <Users className="w-4 h-4 text-amber-700" />
              Community wisdom
            </span>
          </div>
        </div>

        {/* Right content: feature cards + verse */}
        <div className="space-y-4">
          <div className="grid gap-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:bg-white/80 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-foreground">Marriage Biodata</h3>
                    <Badge className="rounded-full bg-primary/10 text-primary border border-primary/20">
                      8 steps
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    A structured Islamic biodata with deen markers, family, education, and preferences—easy to share.
                  </p>
                  <div className="mt-4">
                <Link href="/biodata/create">
                      <Button size="sm" className="rounded-full">
                        Create yours
                  </Button>
                </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.20 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/10 hover:bg-white/80 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-amber-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-foreground">Question Sets</h3>
                    <Badge className="rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20">
                      Clarity
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ask meaningful questions that reduce confusion and help families communicate with confidence.
                  </p>
                  <div className="mt-4">
                <Link href="/create">
                      <Button size="sm" className="rounded-full bg-amber-600 hover:bg-amber-700">
                        Start creating
                  </Button>
                </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/10 hover:bg-white/80 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-foreground">Community</h3>
                    <Badge className="rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                      Support
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Share knowledge, learn from experiences, and make better decisions—together.
                  </p>
                  <div className="mt-4">
                <Link href="/community">
                      <Button size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-700">
                        Join now
                  </Button>
                </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Quran quote (keeps Islamic vibe + fits intention) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Quote className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  “And among His signs is that He created for you mates… and placed between you affection and mercy.”
                </p>
                <p className="mt-2 text-xs text-muted-foreground font-medium">— Qur’an 30:21</p>
              </div>
            </div>
          </motion.div>

          {/* Small footer note (optional, still within hero) */}
          <div className="text-xs text-muted-foreground px-1">
            Tip: Use the guide + question sets before sharing biodata—clarity early reduces misunderstandings later.
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</section>


        {/* Marriage Section */}
        <section id="marriage" className="py-24 bg-gradient-to-br from-primary/5 via-background to-amber-500/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
                <Heart className="w-4 h-4" />
                <span>Islamic Marriage</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-serif">
                Find Your Blessed Match
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Create a comprehensive marriage biodata that honors Islamic values while connecting you with compatible partners through meaningful, faith-centered relationships.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <Card className="overflow-hidden border-primary/20 rounded-2xl shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-amber-500/10" />
                      <div className="relative p-8">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <FileText className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-foreground">8-Step Biodata Builder</h3>
                                <p className="text-sm text-muted-foreground">Comprehensive Islamic profile creation</p>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                              Build your marriage biodata with Islamic principles at the core. Include religious practices, family values, education, career details, and marriage preferences in a structured, respectful format that reflects your true self.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm">Religious markers</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="text-sm">Family details</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-amber-600" />
                                <span className="text-sm">Education & career</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-rose-500" />
                                <span className="text-sm">Marriage preferences</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                              <Badge className="rounded-full bg-primary/10 text-primary border border-primary/20">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium Feature
                              </Badge>
                              <Badge className="rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI Matching
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button className="rounded-full flex-1" asChild>
                            <Link href="/biodata/create">
                              Create Your Biodata
                            </Link>
                          </Button>
                          <Button variant="outline" className="rounded-full" asChild>
                            <Link href="/biodata">
                              View Examples
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-primary/10">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-600" />
                    Why Choose Islamic Marriage Biodata?
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Structured format that respects Islamic principles and cultural values</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Focus on character, deen, and family compatibility over superficial traits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Professional PDF generation for sharing with families and matchmakers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>Privacy controls and selective sharing options</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-primary/10 to-amber-500/10 rounded-2xl p-8 border border-primary/20">
                  <h4 className="text-xl font-bold text-foreground mb-4">What Makes It Special?</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-foreground">Islamic-Centered Approach</h5>
                        <p className="text-sm text-muted-foreground">Every field is designed with Islamic marriage principles in mind, ensuring compatibility in faith and values.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-foreground">Comprehensive Coverage</h5>
                        <p className="text-sm text-muted-foreground">From basic profile to detailed preferences, capture everything that matters for a blessed union.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-foreground">Community Integration</h5>
                        <p className="text-sm text-muted-foreground">Share your biodata with the Sabr community and discover matches through our respectful platform.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="glass-panel border-primary/20 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Ready to Start Your Journey?</h4>
                        <p className="text-sm text-muted-foreground">Join thousands finding meaningful connections</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <Button size="lg" className="rounded-full w-full" asChild>
                        <Link href="/biodata/create">
                          Begin Creating
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quote Section 1 */}
        <section className="py-16 bg-white/50 border-y border-border/50">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 text-amber-700 mb-6">
                <Quote className="w-6 h-6" />
              </div>
              <blockquote className="text-xl md:text-2xl font-serif text-foreground italic leading-relaxed mb-4">
                "And among His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy."
              </blockquote>
              <cite className="text-muted-foreground font-medium">— Qur'an 30:21</cite>
            </motion.div>
          </div>
        </section>

        {/* Question Sets Section */}
        <section id="questions" className="py-24 bg-gradient-to-br from-amber-500/5 via-background to-emerald-500/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/10 text-amber-700 font-medium text-sm mb-6 border border-amber-600/20">
                <MessageSquare className="w-4 h-4" />
                <span>Question Sets</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-serif">
                Ask the Questions That Matter
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Create custom question sets to gather honest insights from potential partners, friends, or community members. Build trust through meaningful conversations and authentic connections.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <Card className="overflow-hidden border-amber-500/20 rounded-2xl shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-background to-primary/10" />
                      <div className="relative p-8">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700">
                                <MessageSquare className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-foreground">Custom Question Builder</h3>
                                <p className="text-sm text-muted-foreground">Create meaningful conversations</p>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                              Design question sets that help you understand character, values, and compatibility. From relationship preferences to daily habits, ask what truly matters for building lasting connections.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm">Anonymous responses</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="text-sm">Community sharing</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-amber-600" />
                                <span className="text-sm">Rich text answers</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-rose-500" />
                                <span className="text-sm">Personal insights</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                              <Badge className="rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Easy Creation
                              </Badge>
                              <Badge className="rounded-full bg-primary/10 text-primary border border-primary/20">
                                <Users className="w-3 h-3 mr-1" />
                                Share Anywhere
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button className="rounded-full flex-1 bg-amber-600 hover:bg-amber-700" asChild>
                            <Link href="/create">
                              Create Question Set
                            </Link>
                          </Button>
                          <Button variant="outline" className="rounded-full border-amber-500/20 hover:bg-amber-50" asChild>
                            <Link href="/sets">
                              Browse Examples
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/10">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-600" />
                    Perfect For:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                      <span>Getting to know potential marriage partners beyond surface level</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                      <span>Understanding family dynamics and relationship expectations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                      <span>Exploring compatibility in faith practices and life goals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                      <span>Building trust through honest, thoughtful conversations</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-amber-500/10 to-primary/10 rounded-2xl p-8 border border-amber-500/20">
                  <h4 className="text-xl font-bold text-foreground mb-4">Why Question Sets Work</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-foreground">Authentic Responses</h5>
                        <p className="text-sm text-muted-foreground">Anonymous options encourage honest answers about sensitive topics like past relationships, family expectations, and personal boundaries.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-foreground">Structured Discovery</h5>
                        <p className="text-sm text-muted-foreground">Move beyond small talk to meaningful conversations that reveal character, values, and long-term compatibility.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-foreground">Community Wisdom</h5>
                        <p className="text-sm text-muted-foreground">Share question sets with the community and benefit from collective insights and diverse perspectives.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="glass-panel border-amber-500/20 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Start a Meaningful Conversation</h4>
                        <p className="text-sm text-muted-foreground">Ask the right questions, get real answers</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <Button size="lg" className="rounded-full w-full bg-amber-600 hover:bg-amber-700" asChild>
                        <Link href="/create">
                          Create Questions
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quote Section 2 */}
        <section className="py-16 bg-white/50 border-y border-border/50">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-700 mb-6">
                <Quote className="w-6 h-6" />
              </div>
              <blockquote className="text-xl md:text-2xl font-serif text-foreground italic leading-relaxed mb-4">
                "The believers are but a single brotherhood, so make peace between your brothers and fear Allah that you may receive mercy."
              </blockquote>
              <cite className="text-muted-foreground font-medium">— Qur'an 49:10</cite>
            </motion.div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="py-24 bg-gradient-to-br from-emerald-500/5 via-background to-primary/5">
          <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-700 font-medium text-sm mb-6 border border-emerald-500/20">
                <Users className="w-4 h-4" />
                <span>Community</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-serif">
                Grow Together in Faith
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Join a supportive community of Muslims seeking meaningful connections. Share experiences, seek advice, and find inspiration through respectful discussions and Islamic wisdom.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <Card className="overflow-hidden border-emerald-500/20 rounded-2xl shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-background to-primary/10" />
                      <div className="relative p-8">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
                                <Users className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-foreground">Sabr Community Feed</h3>
                                <p className="text-sm text-muted-foreground">Connect, learn, and grow together</p>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                              Engage with a community that shares your values. Ask questions, share stories, vote on discussions, and discover biodata matches. Find support and wisdom from fellow Muslims on their faith journey.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                <span className="text-sm">Questions & answers</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-amber-600" />
                                <span className="text-sm">Islamic wisdom</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-rose-500" />
                                <span className="text-sm">Support & advice</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm">Respectful environment</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                              <Badge className="rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                                <Heart className="w-3 h-3 mr-1" />
                                Safe Space
                              </Badge>
                              <Badge className="rounded-full bg-primary/10 text-primary border border-primary/20">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI Curated
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button className="rounded-full flex-1 bg-emerald-600 hover:bg-emerald-700" asChild>
                            <Link href="/community">
                              Join Community
                            </Link>
                          </Button>
                          <Button variant="outline" className="rounded-full border-emerald-500/20 hover:bg-emerald-50" asChild>
                            <Link href="/community">
                              Explore Feed
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/10">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-emerald-600" />
                    Community Features:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <span>Daily Islamic wisdom with Quranic verses, Hadiths, and inspirational quotes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <span>AI-curated biodata matches based on your preferences and activity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <span>Anonymous posting and commenting with respectful moderation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <span>Topic-based filtering and community-driven content discovery</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-emerald-500/10 to-primary/10 rounded-2xl p-8 border border-emerald-500/20">
                  <h4 className="text-xl font-bold text-foreground mb-4">What Makes Our Community Special?</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-foreground">Faith-Centered Environment</h5>
                        <p className="text-sm text-muted-foreground">Every interaction is guided by Islamic principles, creating a safe space for genuine connections and spiritual growth.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-foreground">Integrated Experience</h5>
                        <p className="text-sm text-muted-foreground">Seamlessly connect your biodata and question sets with community discussions and matches.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-foreground">Daily Inspiration</h5>
                        <p className="text-sm text-muted-foreground">Start each day with curated Islamic wisdom and community insights that nourish your faith journey.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="glass-panel border-emerald-500/20 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Join the Conversation</h4>
                        <p className="text-sm text-muted-foreground">Be part of something meaningful</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <Button size="lg" className="rounded-full w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                        <Link href="/community">
                          Join Community
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <p>&copy; {new Date().getFullYear()} {t("app.name")}. {t("footer.rights")}</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/60 max-w-2xl mx-auto">
            Built with Islamic principles of Amanah (trust), Akhlaq (good character), and Ihsan (excellence in service).
          </p>
        </div>
      </footer>
    </div>
  );
}

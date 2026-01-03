import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Heart,
  BookOpen,
  Users,
  Shield,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Star,
  Quote,
  Target,
  Calendar,
  Home,
  DollarSign,
  UserCheck,
  Clock,
  FileText,
  MessageSquare
} from "lucide-react";

export default function MarriageGuide() {
  const { t } = useLanguage();

  const phases = [
    {
      title: "Self-Reflection & Preparation",
      icon: <UserCheck className="w-6 h-6" />,
      color: "primary",
      items: [
        "Know your values and priorities",
        "Assess your emotional readiness",
        "Understand your financial situation",
        "Reflect on your spiritual journey",
        "Identify areas for personal growth"
      ]
    },
    {
      title: "Family & Community Involvement",
      icon: <Users className="w-6 h-6" />,
      color: "emerald",
      items: [
        "Discuss expectations with family",
        "Seek guidance from elders",
        "Consider cultural considerations",
        "Build supportive relationships",
        "Learn about extended family dynamics"
      ]
    },
    {
      title: "Partner Selection & Compatibility",
      icon: <Heart className="w-6 h-6" />,
      color: "rose",
      items: [
        "Understand Islamic criteria for marriage",
        "Assess religious compatibility",
        "Evaluate character and values",
        "Consider life goals alignment",
        "Discuss expectations openly"
      ]
    },
    {
      title: "Practical Preparations",
      icon: <Target className="w-6 h-6" />,
      color: "amber",
      items: [
        "Financial planning and stability",
        "Housing and living arrangements",
        "Career and education goals",
        "Health and wellness planning",
        "Legal and documentation requirements"
      ]
    }
  ];

  const rightsAndResponsibilities = [
    {
      category: "Husband's Rights",
      rights: [
        "Obedience and respect",
        "Intimate companionship",
        "Household management",
        "Care during illness",
        "Proper hijab and modesty"
      ]
    },
    {
      category: "Wife's Rights",
      rights: [
        "Mahar (dowry) as agreed",
        "Financial maintenance",
        "Kind and compassionate treatment",
        "Education and personal development",
        "Respect and dignity"
      ]
    },
    {
      category: "Mutual Responsibilities",
      rights: [
        "Love and mercy between spouses",
        "Honesty and trust",
        "Patience and forgiveness",
        "Communication and understanding",
        "Spiritual support and growth"
      ]
    }
  ];

  const commonTopics = [
    {
      title: "Understanding Mahr",
      icon: <DollarSign className="w-5 h-5" />,
      content: "Mahr is a mandatory gift from the groom to the bride, symbolizing commitment and financial security. It can be money, property, or valuable items agreed upon by both parties."
    },
    {
      title: "The Marriage Contract (Nikah)",
      icon: <FileText className="w-5 h-5" />,
      content: "The Nikah is the Islamic marriage contract that outlines rights, responsibilities, and conditions. It requires two witnesses and can include specific terms agreed by both parties."
    },
    {
      title: "Walima Celebration",
      icon: <Users className="w-5 h-5" />,
      content: "Walima is the wedding feast hosted by the groom's family to celebrate the marriage. It's a sunnah practice that brings families and communities together."
    },
    {
      title: "Honeymoon & Adjustment Period",
      icon: <Heart className="w-5 h-5" />,
      content: "The initial months of marriage are crucial for building understanding and intimacy. Focus on communication, patience, and gradually getting to know each other."
    }
  ];

  const misconceptions = [
    {
      myth: "Love comes after marriage",
      truth: "While love can grow, it's important to have genuine affection and compatibility before marriage. Islamic marriage is built on mutual respect and understanding."
    },
    {
      myth: "Marriage is just a contract",
      icon: <AlertTriangle className="w-4 h-4" />,
      truth: "Marriage is both a legal contract and a spiritual bond. It involves emotional, physical, and spiritual commitments between spouses."
    },
    {
      myth: "Only religious compatibility matters",
      icon: <Shield className="w-4 h-4" />,
      truth: "While religious compatibility is essential, character, values, life goals, and practical considerations are equally important for a successful marriage."
    }
  ];

  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              <BookOpen className="w-4 h-4" />
              <span>Islamic Marriage Guide</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight font-serif">
              Your Journey to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-600 to-emerald-600">
                Blessed Marriage
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Embark on the beautiful path of Islamic marriage with wisdom, preparation, and faith.
              This comprehensive guide will help you understand and prepare for one of life's most sacred journeys.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/biodata/create">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-primary/90">
                  Start Your Biodata
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#preparation">
                <Button variant="outline" size="lg" className="rounded-full border-primary/20 hover:bg-primary/5">
                  Continue Reading
                  <BookOpen className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Islamic Foundation */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">The Islamic Foundation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Marriage in Islam is a sacred bond built on faith, love, mercy, and mutual responsibility.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-primary/5 via-background to-amber-500/5 border-primary/20 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Quote className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground font-serif">Divine Wisdom</h3>
                    <p className="text-sm text-muted-foreground">Qur'an 30:21</p>
                  </div>
                </div>
                <blockquote className="text-2xl font-serif text-foreground italic leading-relaxed mb-6">
                  "And among His signs is that He created for you from yourselves mates that you may find tranquility in them;
                  and He placed between you affection and mercy. Indeed in that are signs for a people who give thought."
                </blockquote>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Affection</h4>
                    <p className="text-sm text-muted-foreground">Love and compassion between spouses</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Mercy</h4>
                    <p className="text-sm text-muted-foreground">Kindness, forgiveness, and patience</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                      <Star className="w-5 h-5 text-amber-600" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Tranquility</h4>
                    <p className="text-sm text-muted-foreground">Peace and contentment in marriage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Preparation Phases */}
        <section id="preparation" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Preparation Phases</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Marriage preparation is a journey that begins long before the wedding day.
              Here's how to prepare comprehensively.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`border-${phase.color}/20 shadow-lg hover:shadow-xl transition-shadow`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-${phase.color}/10 flex items-center justify-center`}>
                        {phase.icon}
                      </div>
                      <CardTitle className="text-xl font-serif">{phase.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Rights and Responsibilities */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Rights & Responsibilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Islamic marriage establishes clear rights and responsibilities for both spouses,
              creating a framework for a balanced and harmonious relationship.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {rightsAndResponsibilities.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-serif text-center">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.rights.map((right, rightIndex) => (
                        <li key={rightIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{right}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Key Topics */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Essential Knowledge</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding these fundamental aspects will help you navigate marriage with confidence and wisdom.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {commonTopics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-amber-500/20 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        {topic.icon}
                      </div>
                      <CardTitle className="text-lg font-serif">{topic.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{topic.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Common Misconceptions */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Addressing Misconceptions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Let's clarify some common misunderstandings about Islamic marriage.
            </p>
          </motion.div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {misconceptions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="border-red-500/20 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">Myth: {item.myth}</h4>
                        <p className="text-muted-foreground leading-relaxed">{item.truth}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Practical Advice */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Practical Advice</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real wisdom for building a strong Islamic marriage foundation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Communication is Key",
                content: "Regular, honest communication about feelings, needs, and concerns strengthens your bond.",
                icon: <MessageSquare className="w-5 h-5" />
              },
              {
                title: "Patience & Forgiveness",
                content: "Marriage involves two imperfect people. Practice sabr and forgive as Allah forgives you.",
                icon: <Clock className="w-5 h-5" />
              },
              {
                title: "Spiritual Growth Together",
                content: "Support each other's journey in faith. Pray together and encourage good deeds.",
                icon: <Sparkles className="w-5 h-5" />
              },
              {
                title: "Financial Transparency",
                content: "Discuss financial expectations, responsibilities, and goals openly from the beginning.",
                icon: <DollarSign className="w-5 h-5" />
              },
              {
                title: "Family Balance",
                content: "Maintain healthy relationships with both families while prioritizing your marriage.",
                icon: <Users className="w-5 h-5" />
              },
              {
                title: "Continuous Learning",
                content: "Marriage is a lifelong journey. Keep learning about Islam and each other.",
                icon: <BookOpen className="w-5 h-5" />
              }
            ].map((advice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-emerald-500/20 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        {advice.icon}
                      </div>
                      <h4 className="font-semibold text-foreground">{advice.title}</h4>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{advice.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-primary/5 via-amber-500/5 to-emerald-500/5 border-primary/20 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4 font-serif">Ready to Begin Your Journey?</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Knowledge is the foundation of wisdom. Now that you understand Islamic marriage better,
                  take the next step in creating meaningful connections.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/biodata/create">
                    <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-primary/90">
                      Create Your Biodata
                      <Heart className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button variant="outline" size="lg" className="rounded-full border-primary/20 hover:bg-primary/5">
                      Ask Important Questions
                      <MessageSquare className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/community">
                    <Button variant="outline" size="lg" className="rounded-full border-emerald-500/20 hover:bg-emerald-50">
                      Join the Community
                      <Users className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

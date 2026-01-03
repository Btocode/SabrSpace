import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import {
  GraduationCap,
  BookOpen,
  Heart,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  Quote
} from "lucide-react";

export default function SabrAcademy() {
  const courses = [
    {
      icon: Heart,
      title: "Islamic Marriage Fundamentals",
      description: "Learn the spiritual foundation of marriage in Islam - rights, responsibilities, and blessings.",
      duration: "4 weeks",
      level: "Beginner",
      color: "text-red-600"
    },
    {
      icon: Users,
      title: "Building Strong Relationships",
      description: "Master communication skills, conflict resolution, and emotional intelligence for healthy marriages.",
      duration: "6 weeks",
      level: "Intermediate",
      color: "text-blue-600"
    },
    {
      icon: Shield,
      title: "Marriage Preparation & Planning",
      description: "Practical guidance on engagement, wedding planning, and preparing for married life.",
      duration: "8 weeks",
      level: "Intermediate",
      color: "text-green-600"
    },
    {
      icon: Sparkles,
      title: "Islamic Parenting Essentials",
      description: "Learn Islamic principles of raising children and creating a loving family environment.",
      duration: "10 weeks",
      level: "Advanced",
      color: "text-purple-600"
    }
  ];

  const resources = [
    {
      title: "Marriage Q&A Sessions",
      description: "Live sessions with Islamic scholars to answer your marriage questions",
      type: "Live Sessions"
    },
    {
      title: "Islamic Marriage Articles",
      description: "In-depth articles on various aspects of Islamic marriage and relationships",
      type: "Reading Materials"
    },
    {
      title: "Marriage Success Stories",
      description: "Real stories from Muslim couples who found success through faith",
      type: "Inspirational Content"
    },
    {
      title: "Islamic Counseling",
      description: "Professional counseling services aligned with Islamic principles",
      type: "Support Services"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-amber-500/5 to-emerald-500/5 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              <GraduationCap className="w-4 h-4 fill-primary text-primary" />
              <span className="font-serif tracking-wide">SabrAcademy</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight font-serif">
              Learn, Grow, and Prepare for
              <span className="text-primary block">Islamic Marriage</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Comprehensive Islamic marriage education to help you understand, prepare for, and succeed in your journey toward building a blessed family.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <BookOpen className="w-5 h-5" />
                Start Learning
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Users className="w-5 h-5" />
                Join Community
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
              Featured Courses
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Structured learning paths designed by Islamic scholars and marriage counselors to guide you through every aspect of Islamic marriage.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {courses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 ${course.color}`}>
                      <course.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="flex items-center justify-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {course.level}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {course.description}
                    </p>
                    <Button className="w-full" variant="outline">
                      Enroll Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Islamic Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-2xl p-8 text-center max-w-3xl mx-auto border border-primary/20"
          >
            <Quote className="w-8 h-8 text-primary mx-auto mb-4" />
            <p className="text-lg md:text-xl text-foreground font-medium mb-4">
              "And of His signs is that He created for you from yourselves mates that you may find tranquility in them;
              and He placed between you affection and mercy."
            </p>
            <p className="text-sm text-muted-foreground">
              — Quran 30:21
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
              Learning Resources
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access a wealth of Islamic marriage knowledge through various formats designed to support your learning journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{resource.title}</CardTitle>
                        <CardDescription className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full w-fit">
                          {resource.type}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {resource.description}
                    </p>
                    <Button variant="outline" className="w-full">
                      Access Resource
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-amber-500/5 to-emerald-500/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-serif">
              Begin Your Islamic Marriage Journey
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Whether you're just starting to think about marriage or preparing for your wedding day,
              SabrAcademy provides the knowledge and guidance you need to build a blessed Islamic marriage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="gap-2">
                <GraduationCap className="w-5 h-5" />
                Explore Courses
              </Button>
              <Link href="/marriage-guide">
                <Button variant="outline" size="lg" className="gap-2">
                  <BookOpen className="w-5 h-5" />
                  Marriage Guide
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              "Marriage is half of faith, and the other half is seeking knowledge" — Islamic Wisdom
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

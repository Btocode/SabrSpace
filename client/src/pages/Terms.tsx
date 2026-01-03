import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Heart, Book, Users, Shield } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              <Book className="w-4 h-4 fill-primary text-primary" />
              <span className="font-serif tracking-wide">Terms of Service</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
              Terms of Service
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These terms govern your use of SabrSpace, reflecting Islamic principles of honesty, respect, and community.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="bg-card rounded-lg p-6 border border-border mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Our Commitment to Islamic Values
              </h2>
              <p className="text-muted-foreground mb-4">
                SabrSpace is built upon Islamic principles of <strong>Akhlaq (good character)</strong>,
                <strong>Amanah (trustworthiness)</strong>, and <strong>Ihsan (excellence in service)</strong>.
                Our platform serves the Muslim community seeking meaningful relationships guided by faith.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using SabrSpace, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our platform.
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Islamic Perspective:</strong> In Islam, agreements and contracts are sacred (Aqd).
                  We honor this by ensuring transparency in our terms and commitment to ethical service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Islamic Marriage Principles</h2>
              <p className="text-muted-foreground mb-4">
                SabrSpace is designed to facilitate Islamic marriages based on:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                <li><strong>Taqwa (God-consciousness)</strong> - Profiles should reflect Islamic values</li>
                <li><strong>Akhlaq (good character)</strong> - Honest representation and respectful communication</li>
                <li><strong>Family involvement</strong> - Respect for family opinions and Islamic traditions</li>
                <li><strong>Halal relationships</strong> - Commitment to Islamic marriage guidelines</li>
              </ul>
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Quranic Guidance:</strong> "And marry the unmarried among you and the righteous among
                  your male slaves and female slaves..." (Surah An-Nur 24:32)
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Honesty & Truthfulness
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Provide accurate information in your profiles. Deception (Kadhib) is prohibited in Islam.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Respectful Communication
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Maintain Islamic etiquette (Adab) in all interactions. Respect privacy and boundaries.
                  </p>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Warning:</strong> Violation of Islamic principles may result in account suspension.
                  We are committed to maintaining a pure environment for halal relationships.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Content Guidelines</h2>
              <p className="text-muted-foreground mb-4">
                All content on SabrSpace must align with Islamic values:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>No inappropriate images or content that violates Islamic modesty (Haya)</li>
                <li>Respectful language free from vulgarity or offensive content</li>
                <li>Questions and profiles should promote positive Islamic values</li>
                <li>Educational content about marriage from Islamic perspective</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Privacy & Trust</h2>
              <p className="text-muted-foreground mb-4">
                We treat user privacy as Amanah (trust). Your personal information is protected
                and only shared with your explicit consent for marriage-related purposes.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Hadith Reference:</strong> "The Muslim is the brother of another Muslim.
                  He does not oppress him, nor does he hand him over to an oppressor." (Sahih Muslim)
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Community Guidelines</h2>
              <p className="text-muted-foreground mb-4">
                SabrSpace fosters a supportive Muslim community based on:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Tawakul</strong> - Trust in Allah's plan for marriage</li>
                <li><strong>Sabr</strong> - Patience in the search process</li>
                <li><strong>Rahma</strong> - Mercy and compassion towards others</li>
                <li><strong>Ta'awun</strong> - Mutual support and cooperation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Account Termination</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to terminate accounts that violate Islamic principles or these terms.
                Users may also request account deletion at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                For questions about these terms or Islamic guidance related to marriage,
                please contact us. We are here to support your journey with wisdom and compassion.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-sm text-primary">
                  <strong>Remember:</strong> Marriage is half of faith (Iman), and seeking it through
                  halal means is an act of worship. May Allah guide you to the best in this life and the next.
                </p>
              </div>
            </section>

            <div className="text-center mt-12 pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

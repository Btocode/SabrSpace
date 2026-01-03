import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Shield, Lock, Eye, Users, Heart } from "lucide-react";

export default function Privacy() {
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
              <Shield className="w-4 h-4 fill-primary text-primary" />
              <span className="font-serif tracking-wide">Privacy Policy</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your privacy is our Amanah (trust). We handle your information with the care and respect it deserves in Islam.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="bg-card rounded-lg p-6 border border-border mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Islamic Principles of Privacy
              </h2>
              <p className="text-muted-foreground mb-4">
                In Islam, privacy is sacred. The Prophet Muhammad (ﷺ) said:
                "Part of the perfection of one's Islam is to leave that which does not concern him."
                We uphold this principle by protecting your personal information as Amanah.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground mb-4">
                We only collect information necessary for facilitating Islamic marriages:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                <li><strong>Biodata Information:</strong> Religious background, family details, preferences</li>
                <li><strong>Contact Information:</strong> Email and basic contact details for communication</li>
                <li><strong>Usage Data:</strong> How you interact with our platform to improve service</li>
                <li><strong>Community Content:</strong> Posts and discussions (with your consent)</li>
              </ul>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Islamic Perspective:</strong> We collect only what is necessary (Adl)
                  and avoid excess (Israf) in data collection.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                Your information is used solely for halal purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                <li><strong>Matchmaking:</strong> Connecting you with potential spouses based on Islamic criteria</li>
                <li><strong>Communication:</strong> Facilitating respectful dialogue between interested parties</li>
                <li><strong>Community Building:</strong> Creating safe spaces for Muslim discussions</li>
                <li><strong>Education:</strong> Sharing Islamic marriage knowledge and guidance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                3. Information Sharing
              </h2>
              <p className="text-muted-foreground mb-4">
                We treat your privacy as sacred trust (Amanah):
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ We Share With Consent</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Your biodata with potential matches</li>
                    <li>• Contact info when both parties agree</li>
                    <li>• Community posts you choose to share</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ We Never Share</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Personal data with third parties</li>
                    <li>• Information without your permission</li>
                    <li>• Sensitive details for commercial use</li>
                  </ul>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Hadith:</strong> "The Muslim is the brother of another Muslim. He does not betray him,
                  nor does he lie to him, nor does he forsake him in difficulty." (Sahih Muslim)
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement Islamic principles of protection and responsibility:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                <li><strong>Encryption:</strong> Your data is encrypted and secure</li>
                <li><strong>Access Control:</strong> Only authorized personnel can access data</li>
                <li><strong>Regular Audits:</strong> We regularly review our security practices</li>
                <li><strong>Incident Response:</strong> We have plans to handle any security breaches</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                As a Muslim using our service, you have rights based on Islamic principles:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                <li><strong>Access:</strong> View your personal information anytime</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request complete removal of your data</li>
                <li><strong>Portability:</strong> Export your data in a usable format</li>
                <li><strong>Objection:</strong> Opt-out of certain data processing</li>
              </ul>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-sm text-primary">
                  <strong>Islamic Justice:</strong> We believe in Qist (justice) - your rights are protected
                  equally for all users, regardless of background or status.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Children's Privacy</h2>
              <p className="text-muted-foreground mb-4">
                SabrSpace is designed for mature adults seeking marriage. We do not knowingly collect
                information from individuals under 18 years of age. Marriage is a serious commitment
                that requires maturity and responsibility.
              </p>
              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  <strong>Islamic Guidance:</strong> Islam emphasizes responsibility and maturity in marriage.
                  Our platform reflects this by serving those ready for this sacred commitment.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Cookies & Tracking</h2>
              <p className="text-muted-foreground mb-4">
                We use minimal cookies and tracking to improve your experience:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                <li><strong>Analytics:</strong> Anonymous usage data to improve service</li>
                <li><strong>Preferences:</strong> Remember your language and settings</li>
              </ul>
              <p className="text-muted-foreground text-sm">
                You can control cookie preferences in your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Changes to Privacy Policy</h2>
              <p className="text-muted-foreground mb-4">
                We will notify you of any significant changes to this privacy policy.
                Changes will always align with Islamic principles of transparency and trust.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                Your privacy concerns are important to us. Contact us with any questions about how we handle your information.
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-amber-500/10 p-6 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-primary mb-2">Privacy Contact</h3>
                <p className="text-sm text-muted-foreground">
                  For privacy-related inquiries, please reach out to us. We treat your concerns with the seriousness they deserve.
                </p>
                <p className="text-sm text-primary mt-2">
                  Remember: "Whoever believes in Allah and the Last Day, let him speak good or remain silent." (Sahih Muslim)
                </p>
              </div>
            </section>

            <div className="text-center mt-12 pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                This privacy policy reflects Islamic principles of Amanah (trust) and Adl (justice).
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  ArrowLeft, 
  User, 
  Info, 
  Users, 
  ShieldCheck,
  BookOpen,
  Church,
  Scroll
} from "lucide-react";
import { motion } from "framer-motion";

// Shared dummy data
const DUMMY_BIODATA = [
  { 
    id: 1001, gender: "male", dateOfBirth: "1995-05-15", profession: "Software Engineer", 
    educationLevel: "Bachelors", city: "Dhaka", maritalStatus: "never_married", sect: "Sunni",
    height: "5'10\"", weight: "75kg", complexion: "Fair", bloodGroup: "O+",
    religion: "Islam", prayerFrequency: "5_times", fasting: "Regular", quranReading: "Daily",
    aboutMe: "I am a practicing Muslim who values character and faith. I enjoy reading and spending time with family.",
    expectations: "I am looking for someone who is practicing, family-oriented, and has a good heart.",
    familyDetails: "Father is a retired government officer, mother is a homemaker. Two siblings.",
    hobbies: "Reading, traveling, Islamic history",
    occupation: "Senior Backend Developer"
  },
  { 
    id: 1002, gender: "female", dateOfBirth: "1998-08-22", profession: "Doctor", 
    educationLevel: "MBBS", city: "Chittagong", maritalStatus: "never_married", sect: "Sunni",
    height: "5'4\"", weight: "55kg", complexion: "Very Fair", bloodGroup: "B+",
    religion: "Islam", prayerFrequency: "5_times", fasting: "Regular", quranReading: "Daily",
    aboutMe: "A medical professional dedicated to my work and faith. I strive for balance in all aspects of life.",
    expectations: "Looking for a supportive partner who understands the demands of a medical career and shares my religious values.",
    familyDetails: "Respectable family from Chittagong. Father is a businessman, mother is a teacher.",
    hobbies: "Gardening, baking, volunteering",
    occupation: "Resident Doctor"
  }
];

export default function PublicBiodataView() {
  const { id } = useParams();
  const biodata = DUMMY_BIODATA.find(b => b.id === Number(id)) || DUMMY_BIODATA[0];

  const calcAge = (dobString: string | null) => {
    if (!dobString) return "N/A";
    const dob = new Date(dobString);
    return new Date().getFullYear() - dob.getFullYear();
  };

  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/public-biodata">
            <Button variant="ghost" className="mb-6 gap-2 rounded-full hover:bg-primary/5">
              <ArrowLeft className="w-4 h-4" />
              Back to Portal
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Profile Header */}
            <Card className="border-primary/20 overflow-hidden shadow-xl shadow-primary/5">
              <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-amber-500/10" />
              <CardContent className="relative pt-0 px-6 pb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 md:px-4">
                  <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
                    <User className="w-12 h-12 text-primary/40" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20">Member #{biodata.id}</Badge>
                      <Badge variant="outline" className="capitalize">{biodata.gender}</Badge>
                      <Badge className="bg-emerald-600">{biodata.maritalStatus.replace('_', ' ')}</Badge>
                    </div>
                    <h1 className="text-3xl font-bold font-serif text-primary">Public Profile</h1>
                  </div>
                  <div className="pb-2">
                    <Button className="rounded-full shadow-lg shadow-primary/20">
                      Express Interest
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Column: Quick Stats */}
              <div className="space-y-6">
                <Card className="border-primary/10">
                  <CardHeader className="pb-3 border-b bg-muted/30">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Info className="w-4 h-4" /> Quick Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Age</span>
                      <span className="font-medium">{calcAge(biodata.dateOfBirth)} Years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Height</span>
                      <span className="font-medium">{biodata.height}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Complexion</span>
                      <span className="font-medium">{biodata.complexion}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Blood Group</span>
                      <span className="font-medium">{biodata.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">{biodata.city}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/10">
                  <CardHeader className="pb-3 border-b bg-muted/30">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Religious Practice
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sect</span>
                      <span className="font-medium">{biodata.sect}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Prayers</span>
                      <span className="font-medium">{biodata.prayerFrequency.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fasting</span>
                      <span className="font-medium">{biodata.fasting}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quran Reading</span>
                      <span className="font-medium">{biodata.quranReading}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Detailed Info */}
              <div className="md:col-span-2 space-y-6">
                <Card className="border-primary/10">
                  <CardContent className="p-6 space-y-8">
                    {/* About Section */}
                    <section>
                      <h3 className="text-lg font-bold font-serif text-primary mb-3 flex items-center gap-2">
                        <User className="w-5 h-5" /> About Me
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {biodata.aboutMe}
                      </p>
                    </section>

                    {/* Education & Career */}
                    <section>
                      <h3 className="text-lg font-bold font-serif text-primary mb-3 flex items-center gap-2">
                        <Briefcase className="w-5 h-5" /> Education & Career
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Education Level</p>
                          <p className="font-medium flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            {biodata.educationLevel}
                          </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Profession</p>
                          <p className="font-medium flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" />
                            {biodata.profession}
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Family */}
                    <section>
                      <h3 className="text-lg font-bold font-serif text-primary mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5" /> Family Information
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {biodata.familyDetails}
                      </p>
                    </section>

                    {/* Expectations */}
                    <section>
                      <h3 className="text-lg font-bold font-serif text-primary mb-3 flex items-center gap-2">
                        <Heart className="w-5 h-5" /> Expectations
                      </h3>
                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 italic text-muted-foreground">
                        "{biodata.expectations}"
                      </div>
                    </section>
                  </CardContent>
                </Card>

                {/* Privacy Notice */}
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">Privacy Protected</h4>
                    <p className="text-sm text-amber-800">
                      Full name and contact information are hidden for privacy. They will be shared only when interest is mutual and communication is established.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

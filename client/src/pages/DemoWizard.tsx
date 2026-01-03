import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowRight, ArrowLeft, Share2, Copy, Check, Sparkles, Wand2, Heart, Shield, FileText, MessageSquare, User, Calendar, MapPin, BookOpen, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";

type QuestionType = "TEXT" | "CHOICE";
type DemoType = "biodata" | "questions" | null;

interface Question {
  id: string;
  prompt: string;
  type: QuestionType;
  options: string[];
  required: boolean;
}

export default function DemoWizard() {
  const [demoType, setDemoType] = useState<DemoType>(null);
  const [step, setStep] = useState(0); // Start with choice screen
  // Question set state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: crypto.randomUUID(), prompt: "", type: "TEXT", options: [], required: true }
  ]);
  const [requireAttestation, setRequireAttestation] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  // Biodata state
  const [biodataStep, setBiodataStep] = useState(1);
  const [biodataData, setBiodataData] = useState({
    fullName: "",
    biodataType: "",
    maritalStatus: "",
    birthMonth: "",
    birthYear: "",
    height: "",
    nationality: "Bangladeshi",
    country: "",
    division: "",
    district: "",
    education: "",
    occupation: "",
    monthlyIncome: "",
    marriageTimeline: "",
    desiredQualities: ""
  });
  const { toast } = useToast();

  const addQuestion = () => {
    setQuestions([...questions, { id: crypto.randomUUID(), prompt: "", type: "TEXT", options: [], required: true }]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleCreate = () => {
    if (!title) {
      toast({ title: "Title required", description: "Please give your question set a name.", variant: "destructive" });
      return;
    }
    const token = Math.random().toString(36).substring(2, 15);
    setShareToken(token);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({ title: "Demo link generated!" });
  };

  const copyLink = () => {
    const link = `${window.location.origin}/s/${shareToken}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied to clipboard" });
  };

  const handleBiodataComplete = () => {
    const token = Math.random().toString(36).substring(2, 15);
    setShareToken(token);
    setStep(99); // Special step for biodata completion
    toast({ title: "Demo biodata created!" });
  };

  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Choose Your Demo Experience</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Select which feature you'd like to explore. Both demos are fully interactive and showcase the real experience.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Biodata Demo */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-primary/20 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300 hover:shadow-lg cursor-pointer bg-gradient-to-br from-primary/5 to-primary/10"
                  onClick={() => { setDemoType('biodata'); setStep(1); }}
                >
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground">Marriage Biodata Creator</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Experience creating a comprehensive Islamic marriage profile with religious markers and family details
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">8-Step Process</span>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 text-xs rounded-full">Islamic Focus</span>
                    </div>
                    <Button className="w-full rounded-full">
                      Try Biodata Demo
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>

                {/* Question Set Demo */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-amber-500/20 rounded-2xl p-8 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg cursor-pointer bg-gradient-to-br from-amber-500/5 to-amber-500/10"
                  onClick={() => { setDemoType('questions'); setStep(1); }}
                >
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto border border-amber-500/20">
                      <MessageSquare className="w-8 h-8 text-amber-700" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground">Question Set Builder</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Create meaningful question sets for compatibility assessment with Islamic attestation
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-700 text-xs rounded-full">Custom Questions</span>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">Anonymous Responses</span>
                    </div>
                    <Button className="w-full rounded-full bg-amber-600 hover:bg-amber-700">
                      Try Question Demo
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              </div>

              <div className="text-center pt-8 border-t border-border/50">
                <Link href="/marriage-guide">
                  <Button variant="ghost" className="rounded-full text-primary hover:bg-primary/5">
                    Learn About Islamic Marriage →
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Biodata Demo Steps */}
          {demoType === 'biodata' && biodataStep >= 1 && (
            <motion.div
              key={`biodata-step${biodataStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-4xl mx-auto">
                {/* Header - Matching real wizard */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold font-serif text-primary mb-2">
                    Create Marriage Biodata (Demo)
                  </h1>
                  <p className="text-muted-foreground">
                    Step {biodataStep} of 3: {
                      biodataStep === 1 ? 'Basic Profile' :
                      biodataStep === 2 ? 'Address & Location' :
                      'Education & Career'
                    }
                  </p>
                </div>

                {/* Step Content - Matching real wizard layout */}
                <div className="mb-8">
                  {biodataStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-serif text-primary">Basic Profile</h3>
                      <p className="text-muted-foreground">Let's start with your fundamental information</p>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            placeholder="Enter your full name"
                            value={biodataData.fullName}
                            onChange={(e) => setBiodataData(prev => ({ ...prev, fullName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Looking for</Label>
                          <Select value={biodataData.biodataType} onValueChange={(value) => setBiodataData(prev => ({ ...prev, biodataType: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="groom">Groom</SelectItem>
                              <SelectItem value="bride">Bride</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Marital Status</Label>
                          <Select value={biodataData.maritalStatus} onValueChange={(value) => setBiodataData(prev => ({ ...prev, maritalStatus: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unmarried">Unmarried</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Height</Label>
                          <Select value={biodataData.height} onValueChange={(value) => setBiodataData(prev => ({ ...prev, height: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select height" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={'5\'0"'}>{'5\'0"'}</SelectItem>
                              <SelectItem value={'5\'2"'}>{'5\'2"'}</SelectItem>
                              <SelectItem value={'5\'4"'}>{'5\'4"'}</SelectItem>
                              <SelectItem value={'5\'6"'}>{'5\'6"'}</SelectItem>
                              <SelectItem value={'5\'8"'}>{'5\'8"'}</SelectItem>
                              <SelectItem value={'5\'10"'}>{'5\'10"'}</SelectItem>
                              <SelectItem value={'6\'0"'}>{'6\'0"'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {biodataStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-serif text-primary">Address & Location</h3>
                      <p className="text-muted-foreground">Where your roots and future lie</p>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Country</Label>
                          <Select value={biodataData.country} onValueChange={(value) => setBiodataData(prev => ({ ...prev, country: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                              <SelectItem value="Pakistan">Pakistan</SelectItem>
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Division/State</Label>
                          <Input
                            placeholder="e.g., Dhaka, Punjab, Maharashtra"
                            value={biodataData.division}
                            onChange={(e) => setBiodataData(prev => ({ ...prev, division: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>District/City</Label>
                          <Input
                            placeholder="e.g., Dhaka, Lahore, Mumbai"
                            value={biodataData.district}
                            onChange={(e) => setBiodataData(prev => ({ ...prev, district: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Nationality</Label>
                          <Input
                            placeholder="e.g., Bangladeshi, Pakistani"
                            value={biodataData.nationality}
                            onChange={(e) => setBiodataData(prev => ({ ...prev, nationality: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {biodataStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-serif text-primary">Education & Career</h3>
                      <p className="text-muted-foreground">Your foundation for the future</p>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Education Level</Label>
                          <Select value={biodataData.education} onValueChange={(value) => setBiodataData(prev => ({ ...prev, education: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select education" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bachelors">Bachelor's Degree</SelectItem>
                              <SelectItem value="Masters">Master's Degree</SelectItem>
                              <SelectItem value="PhD">PhD</SelectItem>
                              <SelectItem value="Diploma">Diploma</SelectItem>
                              <SelectItem value="High School">High School</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Occupation</Label>
                          <Input
                            placeholder="e.g., Software Engineer, Teacher, Doctor"
                            value={biodataData.occupation}
                            onChange={(e) => setBiodataData(prev => ({ ...prev, occupation: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Monthly Income</Label>
                          <Select value={biodataData.monthlyIncome} onValueChange={(value) => setBiodataData(prev => ({ ...prev, monthlyIncome: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select income range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Under 25k">Under 25,000</SelectItem>
                              <SelectItem value="25k-50k">25,000 - 50,000</SelectItem>
                              <SelectItem value="50k-100k">50,000 - 100,000</SelectItem>
                              <SelectItem value="Above 100k">Above 100,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Marriage Timeline</Label>
                          <Select value={biodataData.marriageTimeline} onValueChange={(value) => setBiodataData(prev => ({ ...prev, marriageTimeline: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Immediately">Immediately</SelectItem>
                              <SelectItem value="3-6 months">3-6 months</SelectItem>
                              <SelectItem value="6-12 months">6-12 months</SelectItem>
                              <SelectItem value="1-2 years">1-2 years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Desired Qualities in Partner</Label>
                        <Input
                          placeholder="e.g., Religious, family-oriented, honest, educated"
                          value={biodataData.desiredQualities}
                          onChange={(e) => setBiodataData(prev => ({ ...prev, desiredQualities: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation - Matching real wizard */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t z-10">
                  <div className="container max-w-4xl mx-auto">
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={biodataStep === 1 ? () => { setDemoType(null); setStep(0); } : () => setBiodataStep(biodataStep - 1)}
                        variant="outline"
                        className="gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        {biodataStep === 1 ? 'Back to Choice' : 'Previous'}
                      </Button>

                      <div className="flex-1 max-w-md mx-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{Math.round((biodataStep / 3) * 100)}% Complete</span>
                          <span>Step {biodataStep} of 3</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(biodataStep / 3) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <Button
                        onClick={biodataStep === 3 ? handleBiodataComplete : () => setBiodataStep(biodataStep + 1)}
                        className="gap-2"
                      >
                        {biodataStep === 3 ? (
                          <>
                            <Check className="w-4 h-4" />
                            Complete Demo
                          </>
                        ) : (
                          <>
                            Next
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {demoType === 'biodata' && biodataStep === 2 && (
            <motion.div
              key="biodata-step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-primary/10 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-xl rounded-[3rem] overflow-hidden">
                <CardHeader className="text-center p-12 space-y-4">
                  <div className="mx-auto w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-4">
                    <MapPin className="text-primary w-10 h-10" />
                  </div>
                  <CardTitle className="text-4xl font-serif text-primary tracking-tight">Address & Location</CardTitle>
                  <CardDescription className="text-lg font-light text-muted-foreground">Where your roots and future lie</CardDescription>
                </CardHeader>
                <CardContent className="p-12 pt-0 space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="text-lg font-medium">Country</Label>
                      <Select value={biodataData.country} onValueChange={(value) => setBiodataData(prev => ({ ...prev, country: value }))}>
                        <SelectTrigger className="h-14 rounded-2xl">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                          <SelectItem value="Pakistan">Pakistan</SelectItem>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  <div className="space-y-4">
                      <Label className="text-lg font-medium">Division/State</Label>
                      <Input 
                        placeholder="e.g., Dhaka, Punjab, Maharashtra"
                        value={biodataData.division}
                        onChange={(e) => setBiodataData(prev => ({ ...prev, division: e.target.value }))}
                        className="h-14 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-lg font-medium">District/City</Label>
                      <Input 
                        placeholder="e.g., Dhaka, Lahore, Mumbai"
                        value={biodataData.district}
                        onChange={(e) => setBiodataData(prev => ({ ...prev, district: e.target.value }))}
                        className="h-14 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-lg font-medium">Nationality</Label>
                      <Input
                        placeholder="e.g., Bangladeshi, Pakistani"
                        value={biodataData.nationality}
                        onChange={(e) => setBiodataData(prev => ({ ...prev, nationality: e.target.value }))}
                        className="h-14 rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button variant="outline" className="flex-1 h-14 rounded-2xl" onClick={() => setBiodataStep(1)}>
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back to Profile
                    </Button>
                    <Button className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90" onClick={() => setBiodataStep(3)}>
                      Continue to Education
                      <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {demoType === 'biodata' && biodataStep === 3 && (
            <motion.div
              key="biodata-step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-primary/10 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-xl rounded-[3rem] overflow-hidden">
                <CardHeader className="text-center p-12 space-y-4">
                  <div className="mx-auto w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-4">
                    <BookOpen className="text-primary w-10 h-10" />
                  </div>
                  <CardTitle className="text-4xl font-serif text-primary tracking-tight">Education & Career</CardTitle>
                  <CardDescription className="text-lg font-light text-muted-foreground">Your foundation for the future</CardDescription>
                </CardHeader>
                <CardContent className="p-12 pt-0 space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="text-lg font-medium">Education Level</Label>
                      <Select value={biodataData.education} onValueChange={(value) => setBiodataData(prev => ({ ...prev, education: value }))}>
                        <SelectTrigger className="h-14 rounded-2xl">
                          <SelectValue placeholder="Select education" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="Masters">Master's Degree</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                          <SelectItem value="Diploma">Diploma</SelectItem>
                          <SelectItem value="High School">High School</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-lg font-medium">Occupation</Label>
                      <Input
                        placeholder="e.g., Software Engineer, Teacher, Doctor"
                        value={biodataData.occupation}
                        onChange={(e) => setBiodataData(prev => ({ ...prev, occupation: e.target.value }))}
                        className="h-14 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-lg font-medium">Monthly Income</Label>
                      <Select value={biodataData.monthlyIncome} onValueChange={(value) => setBiodataData(prev => ({ ...prev, monthlyIncome: value }))}>
                        <SelectTrigger className="h-14 rounded-2xl">
                          <SelectValue placeholder="Select income range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under 25k">Under 25,000</SelectItem>
                          <SelectItem value="25k-50k">25,000 - 50,000</SelectItem>
                          <SelectItem value="50k-100k">50,000 - 100,000</SelectItem>
                          <SelectItem value="Above 100k">Above 100,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-lg font-medium">Marriage Timeline</Label>
                      <Select value={biodataData.marriageTimeline} onValueChange={(value) => setBiodataData(prev => ({ ...prev, marriageTimeline: value }))}>
                        <SelectTrigger className="h-14 rounded-2xl">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Immediately">Immediately</SelectItem>
                          <SelectItem value="3-6 months">3-6 months</SelectItem>
                          <SelectItem value="6-12 months">6-12 months</SelectItem>
                          <SelectItem value="1-2 years">1-2 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg font-medium">Desired Qualities in Partner</Label>
                    <Input
                      placeholder="e.g., Religious, family-oriented, honest, educated"
                      value={biodataData.desiredQualities}
                      onChange={(e) => setBiodataData(prev => ({ ...prev, desiredQualities: e.target.value }))}
                      className="h-14 rounded-2xl"
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button variant="outline" className="flex-1 h-14 rounded-2xl" onClick={() => setBiodataStep(2)}>
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back to Address
                    </Button>
                    <Button className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90" onClick={handleBiodataComplete}>
                      Complete Biodata Demo
                      <Check className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Biodata Completion Screen */}
          {step === 99 && demoType === 'biodata' && (
            <motion.div
              key="biodata-complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
                  className="mx-auto w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center shadow-inner"
                >
                  <Heart className="text-primary w-12 h-12 stroke-[3]" />
                </motion.div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-serif tracking-tight text-primary">Biodata Demo Complete!</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">You've experienced the Islamic marriage biodata creation process. Ready to create your real profile?</p>
                </div>

                <div className="bg-muted/30 rounded-2xl p-6 border border-primary/10 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">Demo Summary</h3>
                  <div className="space-y-3 text-sm text-left">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{biodataData.fullName || "Demo User"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{biodataData.biodataType || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Education:</span>
                      <span className="font-medium">{biodataData.education || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timeline:</span>
                      <span className="font-medium">{biodataData.marriageTimeline || "Not specified"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button className="flex-1 h-16 text-lg rounded-xl bg-primary hover:bg-primary/90 shadow-lg" onClick={() => window.open('/biodata/create', '_blank')}>
                    <FileText className="mr-2 w-5 h-5" />
                    Create Real Biodata
                  </Button>
                  <Button variant="outline" className="flex-1 h-16 text-lg rounded-xl" onClick={() => { setDemoType(null); setStep(0); setBiodataStep(1); setBiodataData({ fullName: "", biodataType: "", maritalStatus: "", birthMonth: "", birthYear: "", height: "", nationality: "Bangladeshi", country: "", division: "", district: "", education: "", occupation: "", monthlyIncome: "", marriageTimeline: "", desiredQualities: "" }); }}>
                    Try Another Demo
                </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Question Set Demo - Matching Real CreateSet Page */}
          {demoType === 'questions' && step === 1 && (
                  <motion.div
              key="questions-demo"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
                  >
              <div className="max-w-4xl mx-auto">
                {/* Header - Matching real page */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold font-serif mb-2 text-primary">
                    Create Question Set (Demo)
                  </h1>
                  <p className="text-muted-foreground">Design questions that matter.</p>
                </div>

                {/* Form Content - Matching CreateSetForm layout */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-serif text-primary">Basic Information</h3>
                    <p className="text-muted-foreground">Give your question set a clear purpose</p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="demo-title">Set Title</Label>
                        <Input
                          id="demo-title"
                          placeholder="e.g., Marriage Compatibility, Family Legacy"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="demo-desc">Description <span className="text-muted-foreground">(Optional)</span></Label>
                        <Input
                          id="demo-desc"
                          placeholder="Briefly set the mood for your responder"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="demo-attestation"
                          checked={requireAttestation}
                          onCheckedChange={(checked) => setRequireAttestation(!!checked)}
                        />
                        <Label htmlFor="demo-attestation">Require Islamic Attestation</Label>
                      </div>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-serif text-primary">Questions</h3>
                    <p className="text-muted-foreground">Customize your questions and settings</p>

                    <div className="space-y-6">
                      {questions.map((q, index) => (
                        <div key={q.id} className="border rounded-lg p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-lg">Question {index + 1}</h4>
                            {questions.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeQuestion(q.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                            </div>

                          <div className="space-y-2">
                            <Label>Question Prompt</Label>
                            <Input 
                              placeholder="Type your question prompt here..." 
                              value={q.prompt} 
                              onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })} 
                            />
                        </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Response Type</Label>
                              <Select value={q.type} onValueChange={(value) => updateQuestion(q.id, { type: value as QuestionType })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="TEXT">Text Response</SelectItem>
                                  <SelectItem value="CHOICE">Multiple Choice</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center space-x-2 pt-8">
                              <Checkbox
                                id={`required-${q.id}`}
                              checked={q.required} 
                                onCheckedChange={(checked) => updateQuestion(q.id, { required: !!checked })}
                            />
                              <Label htmlFor={`required-${q.id}`}>Required Question</Label>
                          </div>
                        </div>

                        {q.type === "CHOICE" && (
                            <div className="space-y-2">
                              <Label>Answer Options (comma-separated)</Label>
                            <Input 
                                placeholder="Option A, Option B, Option C"
                              onChange={(e) => updateQuestion(q.id, { options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} 
                              />
                            </div>
                          )}
                        </div>
                      ))}

                      <Button variant="outline" className="w-full" onClick={addQuestion}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Question
                      </Button>
                    </div>
              </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button variant="outline" className="flex-1" onClick={() => { setDemoType(null); setStep(0); }}>
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back to Choice
                </Button>
                    <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleCreate}>
                      Create Demo Set
                      <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}


          {step === 3 && (
            <motion.div
              key="questions-complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="max-w-4xl mx-auto text-center space-y-8">
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
                  className="mx-auto w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center shadow-inner"
                  >
                  <Check className="text-amber-600 w-12 h-12 stroke-[3]" />
                  </motion.div>
                  
                  <div className="space-y-4">
                  <h2 className="text-4xl font-serif tracking-tight text-primary">Question Set Created!</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">Your question set is ready to share. Preview it and see how others will experience it.</p>
                  </div>
                  
                <div className="bg-muted/30 rounded-2xl p-6 border border-amber-500/10 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">Share Link</h3>
                  <div className="bg-white rounded-xl p-4 border flex items-center gap-3">
                    <div className="flex-1 text-sm font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                      {window.location.origin}/s/{shareToken}
                    </div>
                    <Button size="sm" variant="ghost" onClick={copyLink} className="shrink-0">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button className="flex-1 h-16 text-lg rounded-xl bg-amber-600 hover:bg-amber-700 shadow-lg" onClick={() => window.open(`/s/${shareToken}`, '_blank')}>
                    <Share2 className="mr-2 w-5 h-5" />
                    Preview Question Set
                    </Button>
                  <Button variant="outline" className="flex-1 h-16 text-lg rounded-xl" onClick={() => { setDemoType(null); setStep(0); setShareToken(null); setTitle(""); setDescription(""); setQuestions([{ id: crypto.randomUUID(), prompt: "", type: "TEXT", options: [], required: true }]); }}>
                    Try Another Demo
                    </Button>
                  </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}

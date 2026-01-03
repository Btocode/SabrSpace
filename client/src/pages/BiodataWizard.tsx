import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Navbar } from "@/components/Navbar";
import { api } from "@shared/routes";
import { useToast } from "@/components/ui/toast-custom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BasicProfileStep,
  AddressStep,
  EducationStep,
  FamilyInfoStep,
  PersonalReligiousStep,
  CareerIncomeStep,
  MarriagePreferencesStep,
  DeclarationsStep,
  BasicProfileData,
  AddressData,
  EducationData,
  FamilyInfoData,
  PersonalReligiousData,
  CareerIncomeData,
  MarriagePreferencesData,
  DeclarationsData
} from "@/components/biodata";
import { useBiodataWizardStore } from "@/stores/biodataWizardStore";

import { Save, CheckCircle, Share2, Copy, ChevronLeft, ChevronRight } from "lucide-react";

// Step schemas with improved validation
const basicProfileSchema = z.object({
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  biodata_type: z.enum(["groom", "bride"], { required_error: "Please select if you are looking for a groom or bride" }),
  marital_status: z.enum(["unmarried", "married", "divorced", "widowed"], { required_error: "Marital status is required" }),
  birth_month_year: z.string()
    .min(3, "Birth month and year is required")
    .max(50, "Invalid birth date format"),
  height: z.string()
    .min(1, "Height is required")
    .regex(/^\d+'\d+"?$/, "Height must be in format like 5'6\""),
  weight: z.string()
    .optional()
    .refine((val) => !val || /^\d+\s*(kg|lbs)?$/.test(val), "Weight must be a number with optional unit (kg/lbs)"),
  complexion: z.enum(["fair", "wheatish", "dusky"]).optional(),
  blood_group: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    errorMap: () => ({ message: "Please select a valid blood group" })
  }).optional(),
  nationality: z.string().max(50, "Nationality must be less than 50 characters").default("Bangladeshi"),
});

const addressSchema = z.object({
  permanent_address: z.object({
    country: z.string().min(2, "Country is required").max(50, "Country name too long"),
    division: z.string().min(2, "Division is required").max(50, "Division name too long"),
    district: z.string().min(2, "District is required").max(50, "District name too long"),
    upazila_thana: z.string().min(2, "Upazila/Thana is required").max(50, "Upazila/Thana name too long"),
    city_corp: z.string().max(50, "City Corporation name too long").optional(),
    area_name: z.string().max(100, "Area name too long").optional(),
  }),
  current_address: z.object({
    country: z.string().min(2, "Country is required").max(50, "Country name too long"),
    division: z.string().min(2, "Division is required").max(50, "Division name too long"),
    district: z.string().min(2, "District is required").max(50, "District name too long"),
    upazila_thana: z.string().min(2, "Upazila/Thana is required").max(50, "Upazila/Thana name too long"),
    city_corp: z.string().max(50, "City Corporation name too long").optional(),
    area_name: z.string().max(100, "Area name too long").optional(),
  }),
  where_grew_up: z.string().max(500, "Description too long").optional(),
});

const educationSchema = z.object({
  education_medium: z.enum(["general", "madrasa", "english_medium"]).optional(),
  ssc_year: z.string()
    .optional()
    .refine((val) => !val || /^\d{4}$/.test(val), "SSC year must be a valid 4-digit year"),
  ssc_group: z.string().max(50, "SSC group name too long").optional(),
  ssc_result: z.string()
    .max(20, "SSC result too long")
    .refine((val) => !val || /^(\d+\.?\d*|\d*\.?\d+)$/.test(val), "SSC result must be a valid number")
    .optional(),
  hsc_year: z.string()
    .optional()
    .refine((val) => !val || /^\d{4}$/.test(val), "HSC year must be a valid 4-digit year"),
  hsc_group: z.string().max(50, "HSC group name too long").optional(),
  hsc_result: z.string()
    .max(20, "HSC result too long")
    .refine((val) => !val || /^(\d+\.?\d*|\d*\.?\d+)$/.test(val), "HSC result must be a valid number")
    .optional(),
  higher_education: z.array(z.object({
    level: z.enum(["bachelor", "master", "phd"]).optional(),
    subject: z.string().max(100, "Subject name too long").optional(),
    institution: z.string().max(200, "Institution name too long").optional(),
    passing_year: z.string()
      .refine((val) => !val || /^\d{4}$/.test(val), "Passing year must be a valid 4-digit year")
      .optional(),
    result: z.string().max(50, "Result description too long").optional(),
  })).default([]),
});

const familySchema = z.object({
  father: z.object({
    alive: z.boolean().default(true),
    occupation: z.string().max(100, "Father's occupation description too long").optional(),
  }),
  mother: z.object({
    alive: z.boolean().default(true),
    occupation: z.string().max(100, "Mother's occupation description too long").optional(),
  }),
  siblings: z.object({
    brothers_count: z.number().min(0).max(20, "Invalid number of brothers").default(0),
    sisters_count: z.number().min(0).max(20, "Invalid number of sisters").default(0),
    details: z.string().max(500, "Siblings details too long").optional(),
  }),
  extended_family_summary: z.string().max(500, "Extended family summary too long").optional(),
  economic_status: z.enum(["lower", "lower_middle", "middle", "upper_middle"]).optional(),
  economic_description: z.string().max(300, "Economic description too long").optional(),
  family_religious_environment: z.string().max(500, "Religious environment description too long").optional(),
});

const personalReligiousSchema = z.object({
  clothing_style: z.string().max(300, "Clothing style description too long").optional(),
  sunnati_beard_or_hijab: z.string().max(300, "Beard/Hijab description too long").optional(),
  clothes_above_ankle: z.boolean().default(false),
  five_times_prayer: z.enum(["yes", "trying", "no"]).optional(),
  qaza_frequency: z.string().max(100, "Qaza frequency description too long").optional(),
  mahram_non_mahram: z.enum(["strict", "trying", "casual"]).optional(),
  quran_tilawat: z.boolean().default(false),
  fiqh: z.enum(["hanafi", "shafi", "maliki", "hanbali", "other"]).optional(),
  entertainment_habit: z.string().max(300, "Entertainment habit description too long").optional(),
  health_notes: z.string().max(500, "Health notes too long").optional(),
  islamic_books: z.string().max(300, "Islamic books description too long").optional(),
  favorite_scholars: z.string().max(300, "Favorite scholars description too long").optional(),
  hobbies: z.string().max(500, "Hobbies description too long").optional(),
});

const careerSchema = z.object({
  occupation_title: z.string().max(100, "Occupation title too long").optional(),
  occupation_details: z.string().max(500, "Occupation details too long").optional(),
  monthly_income: z.number().min(0).max(10000000, "Income amount too high").optional(),
  workplace_city: z.string().max(100, "Workplace city name too long").optional(),
  experience_years: z.number().min(0).max(70, "Invalid experience years").optional(),
});

const marriageSchema = z.object({
  marriage_related: z.object({
    guardian_agrees: z.boolean().default(false),
    can_support_purdah: z.boolean().default(false),
    allow_study: z.string().max(300, "Study allowance explanation too long").optional(),
    allow_work: z.string().max(300, "Work allowance explanation too long").optional(),
    after_marriage_location: z.string().max(300, "Marriage location description too long").optional(),
    gifts_expectation: z.boolean().default(false),
    why_marriage_view: z.string().max(500, "Marriage view description too long").optional(),
  }),
  desired_spouse: z.object({
    age_range: z.string()
      .max(20, "Age range too long")
      .refine((val) => !val || /^\d{1,2}-\d{1,2}$/.test(val), "Age range must be in format like 22-28")
      .optional(),
    height_range: z.string().max(20, "Height range too long").optional(),
    complexion: z.string().max(50, "Complexion description too long").optional(),
    education: z.string().max(100, "Education preference too long").optional(),
    district_preference: z.string().max(300, "District preference too long").optional(),
    marital_status: z.string().max(50, "Marital status preference too long").optional(),
    occupation: z.string().max(100, "Occupation preference too long").optional(),
    economic_status: z.string().max(50, "Economic status preference too long").optional(),
    desired_qualities: z.string().max(1000, "Desired qualities description too long").optional(),
  }),
});

const declarationSchema = z.object({
  guardian_knows_submission: z.boolean().default(false),
  swear_true: z.boolean().default(false),
  agree_disclaimer: z.boolean().default(false),
  verification_status: z.enum(["pending", "approved", "not_approved"]).default("pending"),
});

// Steps configuration
const steps = [
  { id: "basic_profile", title: "Basic Profile", schema: basicProfileSchema },
  { id: "address", title: "Address & Location", schema: addressSchema },
  { id: "education", title: "Education", schema: educationSchema },
  { id: "family", title: "Family Info", schema: familySchema },
  { id: "personal_religious", title: "Personal & Religious Practice", schema: personalReligiousSchema },
  { id: "career", title: "Career & Income", schema: careerSchema },
  { id: "marriage", title: "Marriage Plan & Preferences", schema: marriageSchema },
  { id: "declaration", title: "Declarations & Verification", schema: declarationSchema },
];

type StepFormData = BasicProfileData | AddressData | EducationData | FamilyInfoData | PersonalReligiousData | CareerIncomeData | MarriagePreferencesData | DeclarationsData;

export default function BiodataWizard() {
  const [, navigate] = useLocation();
  const { addToast } = useToast();

  // Zustand store
  const {
    formData,
    currentStep,
    biodataId,
    createdBiodataUrl,
    isLoading,
    setCurrentStep,
    setBiodataId,
    setCreatedBiodataUrl,
    setIsLoading,
    updateStepData,
    loadExistingBiodata,
  } = useBiodataWizardStore();

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Initialize form for current step with store data
  const form = useForm({
    resolver: zodResolver(currentStepData.schema),
    defaultValues: {},
  });

  // Reset form when step changes or formData updates
  useEffect(() => {
    const stepData = (formData as any)[currentStepData.id];
    if (stepData) {
      form.reset(stepData);
    } else {
      // Reset to empty for new step
      form.reset({});
    }
  }, [currentStepData.id, formData, form]);

  // Load existing biodata if editing
  useEffect(() => {
    const loadExistingData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const editId = urlParams.get('edit');

      if (editId) {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(api.biodata.get.path.replace(':id', editId), {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });

          if (response.ok) {
            const biodata = await response.json();
            loadExistingBiodata(biodata);
          }
        } catch (error) {
          console.error('Failed to load biodata:', error);
        }
      }
    };

    loadExistingData();
  }, [loadExistingBiodata]);

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const data = form.getValues();
    // Update step data in store
    updateStepData(currentStepData.id, data);

    // Get updated form data from store (after update)
    const updatedFormData = { ...formData, [currentStepData.id]: data };

    // Save current step data immediately (draft state)
    await saveStepData(updatedFormData);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step completed - mark as complete and show success
      await markBiodataComplete(updatedFormData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Map frontend 8-step data to backend schema
  const mapToBackendSchema = (allData: any) => {
    const basic = allData.basic_profile;
    const address = allData.address;
    const education = allData.education;
    const family = allData.family;
    const personal = allData.personal_religious;
    const career = allData.career;
    const marriage = allData.marriage;
    const declaration = allData.declaration;

    // Map biodata_type to gender
    const gender = basic?.biodata_type === 'groom' ? 'male' : basic?.biodata_type === 'bride' ? 'female' : 'male';

    return {
      // Basic Info (required by backend)
      fullName: basic?.fullName || "",
      gender: gender || "male",

      // Basic Profile
      dateOfBirth: null, // Could parse from birth_month_year
      height: basic?.height,
      weight: basic?.weight,
      complexion: basic?.complexion,
      bloodGroup: basic?.blood_group,

      // Contact Info (from address step)
      phone: null,
      email: null,
      address: address ? `${address.permanent_address.area_name || ''}, ${address.permanent_address.district}, ${address.permanent_address.division}, ${address.permanent_address.country}`.replace(/^, /, '') : undefined,
      city: address?.permanent_address.district,
      state: address?.permanent_address.division,
      country: address?.permanent_address.country,

      // Education (from education step)
      educationLevel: education?.education_medium,
      educationDetails: education?.ssc_year ? `SSC: ${education.ssc_year}, ${education.ssc_group}, ${education.ssc_result}` +
        (education.hsc_year ? ` | HSC: ${education.hsc_year}, ${education.hsc_group}, ${education.hsc_result}` : '') +
        (education.higher_education?.length ? ` | Higher: ${education.higher_education.map((h: any) => `${h.level} in ${h.subject}`).join(', ')}` : '') : undefined,
      profession: career?.occupation_title,
      occupation: career?.occupation_details,
      annualIncome: career?.monthly_income ? (career.monthly_income * 12).toString() : undefined,
      workLocation: career?.workplace_city,

      // Family Info
      fatherName: family?.father.occupation ? `Father - ${family.father.occupation}` : undefined,
      fatherOccupation: family?.father.occupation,
      motherName: family?.mother.occupation ? `Mother - ${family.mother.occupation}` : undefined,
      motherOccupation: family?.mother.occupation,
      siblingsCount: (family?.siblings.brothers_count || 0) + (family?.siblings.sisters_count || 0),
      siblingsDetails: family?.siblings.details,

      // Religious Info
      religion: "islam",
      sect: null,
      religiousPractice: personal?.five_times_prayer === 'yes' ? 'regular' :
                        personal?.five_times_prayer === 'trying' ? 'regular' : 'occasional',
      prayerFrequency: personal?.five_times_prayer === 'yes' ? '5_times' :
                      personal?.five_times_prayer === 'trying' ? '3_times' : 'occasional',
      fasting: "ramadan_only", // Default
      quranReading: personal?.quran_tilawat ? 'daily' : 'occasional',

      // Marriage Preferences
      maritalStatus: basic?.marital_status === 'unmarried' ? 'never_married' :
                    basic?.marital_status === 'married' ? 'never_married' :
                    basic?.marital_status === 'divorced' ? 'divorced' :
                    basic?.marital_status === 'widowed' ? 'widowed' : 'never_married' as const,
      willingToRelocate: marriage?.marriage_related.after_marriage_location ? true : false,
      preferredAgeMin: marriage?.desired_spouse.age_range ? parseInt(marriage.desired_spouse.age_range.split('-')[0]) : undefined,
      preferredAgeMax: marriage?.desired_spouse.age_range ? parseInt(marriage.desired_spouse.age_range.split('-')[1]) : undefined,
      preferredEducation: marriage?.desired_spouse.education,
      preferredProfession: marriage?.desired_spouse.occupation,
      preferredLocation: marriage?.desired_spouse.district_preference,
      otherPreferences: marriage?.desired_spouse.desired_qualities,

      // Additional Info
      hobbies: personal?.hobbies,
      languages: null,
      aboutMe: personal?.health_notes,
      expectations: marriage?.marriage_related.why_marriage_view,
    };
  };

  const saveStepData = async (allData: any) => {
    try {
      const payload = mapToBackendSchema(allData);

      const token = localStorage.getItem('auth_token');

      let response;
      if (biodataId) {
        // Update existing biodata
        response = await fetch(api.biodata.update.path.replace(':id', biodataId), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new biodata
        response = await fetch(api.biodata.create.path, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error("Failed to save biodata");

      const savedBiodata = await response.json();
      setBiodataId(savedBiodata.id);

      // Show success toast only for the first save or when completing
      if (!biodataId || currentStep === steps.length - 1) {
        addToast({
          type: "success",
          title: "Progress saved!",
          description: "Your biodata is saved as draft. You can continue anytime.",
          duration: 3000,
        });
      }

    } catch (error) {
      console.error('Save step error:', error);
      // Don't show error toast for step saves, only for final completion
      if (currentStep === steps.length - 1) {
        addToast({
          type: "error",
          title: "Failed to save biodata",
          description: error instanceof Error ? error.message : "Please try again",
          duration: 5000,
        });
      }
    }
  };

  const markBiodataComplete = async (allData: any) => {
    setIsLoading(true);
    try {
      const payload = mapToBackendSchema(allData);

      const token = localStorage.getItem('auth_token');

      const response = await fetch(api.biodata.update.path.replace(':id', biodataId!.toString()), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to complete biodata");

      const savedBiodata = await response.json();

      // Generate share URL for published biodata
      if (savedBiodata.status === 'published') {
        const shareUrl = `${window.location.origin}/b/${savedBiodata.token}`;
        setCreatedBiodataUrl(shareUrl);
      }

      addToast({
        type: "success",
        title: "Biodata completed successfully!",
        description: savedBiodata.status === 'published' ? "Your biodata is now live and shareable." : "Your biodata has been saved.",
        duration: 4000,
      });

    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to complete biodata",
        description: error instanceof Error ? error.message : "Please try again",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show success screen if biodata was created and we have a share URL
  if (createdBiodataUrl) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-border/50 rounded-xl p-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>

              <h3 className="text-3xl font-bold mb-4 text-primary font-serif">Biodata Created Successfully!</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Your marriage biodata has been created and is ready to share with potential matches.
              </p>

              <div className="bg-primary/5 p-6 rounded-xl mb-6 border border-primary/20">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Share2 className="w-6 h-6 text-primary" />
                  <span className="font-medium text-lg text-primary font-serif">Share Your Biodata</span>
                </div>
                <div className="flex gap-3">
                  <input
                    value={createdBiodataUrl}
                    readOnly
                    className="flex-1 font-mono text-base bg-white/50 border border-border/50 rounded-md px-3 py-2"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(createdBiodataUrl);
                      addToast({
                        type: "success",
                        title: "Copied!",
                        description: "Link copied to clipboard",
                        duration: 2000
                      });
                    }}
                    className="rounded-full px-6 shadow-lg shadow-primary/20"
                    size="lg"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => navigate("/biodata")}
                  variant="outline"
                  className="rounded-full px-6 py-3"
                >
                  View All Biodata
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="rounded-full px-6 py-3 shadow-lg shadow-primary/20"
                >
                  Find Matches
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case "basic_profile":
        return <BasicProfileStep form={form as any} />;
      case "address":
        return <AddressStep form={form as any} />;
      case "education":
        return <EducationStep form={form as any} />;
      case "family":
        return <FamilyInfoStep form={form as any} />;
      case "personal_religious":
        return <PersonalReligiousStep form={form as any} />;
      case "career":
        return <CareerIncomeStep form={form as any} />;
      case "marriage":
        return <MarriagePreferencesStep form={form as any} />;
      case "declaration":
        return <DeclarationsStep form={form as any} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-serif text-primary mb-2">Create Marriage Biodata</h1>
            <p className="text-muted-foreground">Step {currentStep + 1} of {steps.length}: {currentStepData.title}</p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Bottom Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t z-10">
            <div className="container max-w-4xl mx-auto">
              {/* Navigation Buttons with Progress Bar */}
              <div className="flex justify-between items-center">
                <Button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {/* Progress Bar in the center */}
                <div className="flex-1 max-w-md mx-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{Math.round(progress)}% Complete</span>
                    <span>Step {currentStep + 1} of {steps.length}</span>
                  </div>
                  <Progress value={progress} className="h-2 [&>[role=progressbar]]:bg-gray-300 dark:[&>[role=progressbar]]:bg-gray-600" />
                </div>

                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-900 mr-2"></div>
                      Saving...
                    </>
                  ) : currentStep === steps.length - 1 ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Complete
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
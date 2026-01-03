import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/lib/i18n";
import { api } from "@shared/routes";
import { useToast } from "@/components/ui/toast-custom";

// Step schemas
const basicInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  gender: z.enum(["male", "female"]),
  dateOfBirth: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  complexion: z.enum(["fair", "wheatish", "dark"]).optional(),
  bloodGroup: z.string().optional(),
});

const educationSchema = z.object({
  educationLevel: z.string().optional(),
  educationDetails: z.string().optional(),
  profession: z.string().optional(),
  occupation: z.string().optional(),
  annualIncome: z.string().optional(),
  workLocation: z.string().optional(),
});

const familySchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  siblingsCount: z.number().optional(),
  siblingsDetails: z.string().optional(),
});

const religiousSchema = z.object({
  religion: z.string().default("islam"),
  sect: z.string().optional(),
  religiousPractice: z.enum(["regular", "occasional", "minimal"]).optional(),
  prayerFrequency: z.enum(["5_times", "3_times", "occasional"]).optional(),
  fasting: z.enum(["ramadan_only", "regular", "occasional"]).optional(),
  quranReading: z.enum(["daily", "weekly", "occasional", "rarely"]).optional(),
});

const preferencesSchema = z.object({
  maritalStatus: z.enum(["never_married", "divorced", "widowed"]).default("never_married"),
  willingToRelocate: z.boolean().default(false),
  preferredAgeMin: z.number().optional(),
  preferredAgeMax: z.number().optional(),
  preferredEducation: z.string().optional(),
  preferredProfession: z.string().optional(),
  preferredLocation: z.string().optional(),
  otherPreferences: z.string().optional(),
});

const additionalSchema = z.object({
  hobbies: z.string().optional(),
  languages: z.string().optional(),
  aboutMe: z.string().optional(),
  expectations: z.string().optional(),
});

const steps = [
  { id: "basic", title: "Basic Information", schema: basicInfoSchema },
  { id: "education", title: "Education & Career", schema: educationSchema },
  { id: "family", title: "Family Details", schema: familySchema },
  { id: "religious", title: "Religious Information", schema: religiousSchema },
  { id: "preferences", title: "Marriage Preferences", schema: preferencesSchema },
  { id: "additional", title: "Additional Information", schema: additionalSchema },
];

type StepData = {
  basic: z.infer<typeof basicInfoSchema>;
  education: z.infer<typeof educationSchema>;
  family: z.infer<typeof familySchema>;
  religious: z.infer<typeof religiousSchema>;
  preferences: z.infer<typeof preferencesSchema>;
  additional: z.infer<typeof additionalSchema>;
};

type AllStepSchemas = typeof basicInfoSchema | typeof educationSchema | typeof familySchema | typeof religiousSchema | typeof preferencesSchema | typeof additionalSchema;

export default function BiodataWizard() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [biodataId, setBiodataId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedData, setSavedData] = useState<Partial<StepData>>({});

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Initialize form for current step
  const form = useForm<z.infer<AllStepSchemas>>({
    resolver: zodResolver(currentStepData.schema as AllStepSchemas),
    defaultValues: savedData[currentStepData.id as keyof StepData] || {},
  });

  // Reset form when step changes or data is loaded
  useEffect(() => {
    const stepDefaultValues = savedData[currentStepData.id as keyof StepData] || {};
    form.reset(stepDefaultValues);
  }, [currentStep, savedData, currentStepData.id]);

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
            setBiodataId(biodata.id);
            // Split biodata into steps
            const stepData: Partial<StepData> = {
              basic: {
                fullName: biodata.fullName,
                gender: biodata.gender,
                dateOfBirth: biodata.dateOfBirth,
                height: biodata.height,
                weight: biodata.weight,
                complexion: biodata.complexion,
                bloodGroup: biodata.bloodGroup,
              },
              education: {
                educationLevel: biodata.educationLevel,
                educationDetails: biodata.educationDetails,
                profession: biodata.profession,
                occupation: biodata.occupation,
                annualIncome: biodata.annualIncome,
                workLocation: biodata.workLocation,
              },
              family: {
                fatherName: biodata.fatherName,
                fatherOccupation: biodata.fatherOccupation,
                motherName: biodata.motherName,
                motherOccupation: biodata.motherOccupation,
                siblingsCount: biodata.siblingsCount,
                siblingsDetails: biodata.siblingsDetails,
              },
              religious: {
                religion: biodata.religion,
                sect: biodata.sect,
                religiousPractice: biodata.religiousPractice,
                prayerFrequency: biodata.prayerFrequency,
                fasting: biodata.fasting,
                quranReading: biodata.quranReading,
              },
              preferences: {
                maritalStatus: biodata.maritalStatus,
                willingToRelocate: biodata.willingToRelocate,
                preferredAgeMin: biodata.preferredAgeMin,
                preferredAgeMax: biodata.preferredAgeMax,
                preferredEducation: biodata.preferredEducation,
                preferredProfession: biodata.preferredProfession,
                preferredLocation: biodata.preferredLocation,
                otherPreferences: biodata.otherPreferences,
              },
              additional: {
                hobbies: biodata.hobbies,
                languages: biodata.languages,
                aboutMe: biodata.aboutMe,
                expectations: biodata.expectations,
              },
            };
            setSavedData(stepData);
          }
        } catch (error) {
          console.error('Failed to load biodata:', error);
        }
      }
    };

    loadExistingData();
  }, []);

  const saveStep = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Merge current step data with existing data
      const updatedData = { ...savedData, [currentStepData.id]: data };

      // Flatten all step data into a single object
      const payload: any = {};
      Object.values(updatedData).forEach(stepData => {
        Object.assign(payload, stepData);
      });

      // Convert dateOfBirth to Date object if it's a valid date string
      if (payload.dateOfBirth && typeof payload.dateOfBirth === 'string') {
        const date = new Date(payload.dateOfBirth);
        if (!isNaN(date.getTime())) {
          // Send as ISO string without milliseconds and Z suffix for better database compatibility
          payload.dateOfBirth = date.toISOString().split('.')[0] + 'Z';
        } else {
          delete payload.dateOfBirth; // Remove invalid dates
        }
      }

      // If dateOfBirth is still empty/invalid, remove it
      if (!payload.dateOfBirth || payload.dateOfBirth === '') {
        delete payload.dateOfBirth;
      }

      // Convert siblingsCount to number if it's a valid string, otherwise remove the field
      if (payload.siblingsCount !== undefined && payload.siblingsCount !== null && payload.siblingsCount !== '') {
        const num = parseInt(String(payload.siblingsCount), 10);
        if (!isNaN(num)) {
          payload.siblingsCount = num;
        } else {
          delete payload.siblingsCount;
        }
      } else {
        delete payload.siblingsCount;
      }

      // Convert numeric fields, remove if invalid
      if (payload.preferredAgeMin !== undefined && payload.preferredAgeMin !== null && payload.preferredAgeMin !== '') {
        const num = parseInt(String(payload.preferredAgeMin), 10);
        if (!isNaN(num)) {
          payload.preferredAgeMin = num;
        } else {
          delete payload.preferredAgeMin;
        }
      } else {
        delete payload.preferredAgeMin;
      }

      if (payload.preferredAgeMax !== undefined && payload.preferredAgeMax !== null && payload.preferredAgeMax !== '') {
        const num = parseInt(String(payload.preferredAgeMax), 10);
        if (!isNaN(num)) {
          payload.preferredAgeMax = num;
        } else {
          delete payload.preferredAgeMax;
        }
      } else {
        delete payload.preferredAgeMax;
      }

      // Remove other undefined/null/empty fields that shouldn't be sent
      Object.keys(payload).forEach(key => {
        if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
          delete payload[key];
        }
      });

      // Don't send fields that match database defaults
      if (payload.religion === 'islam') {
        delete payload.religion;
      }
      if (payload.maritalStatus === 'never_married') {
        delete payload.maritalStatus;
      }

      // Ensure required fields have defaults
      if (!payload.religion) {
        payload.religion = 'islam';
      }
      if (!payload.maritalStatus) {
        payload.maritalStatus = 'never_married';
      }

      console.log('Sending payload:', payload);

      let response;
      const token = localStorage.getItem('auth_token');

      if (biodataId) {
        // Update existing biodata
        response = await fetch(api.biodata.update.path.replace(':id', biodataId.toString()), {
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
      setSavedData(updatedData);

      addToast({
        type: "success",
        title: "Step saved successfully!",
        duration: 3000,
      });

      return savedBiodata;
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to save step",
        duration: 5000,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      console.log("Form validation failed:", form.formState.errors);
      return;
    }

    const data = form.getValues();
    try {
      await saveStep(data);

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final step completed
        addToast({
          type: "success",
          title: "Biodata completed!",
          duration: 3000,
        });
        navigate("/biodata");
      }
    } catch (error) {
      console.error("Error saving step:", error);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = async () => {
    const data = form.getValues();
    await saveStep(data);
    navigate("/biodata");
  };

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case "basic":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  {...form.register("fullName")}
                  placeholder="Enter your full name"
                />
                {(form.formState.errors as any).fullName && (
                  <p className="text-sm text-red-500">{(form.formState.errors as any).fullName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select onValueChange={(value) => form.setValue("gender", value as "male" | "female")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {(form.formState.errors as any).gender && (
                  <p className="text-sm text-red-500">{(form.formState.errors as any).gender.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...form.register("dateOfBirth")}
                />
              </div>

              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  {...form.register("height")}
                  placeholder="e.g., 5'6"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  {...form.register("weight")}
                  placeholder="e.g., 70 kg"
                />
              </div>

              <div>
                <Label htmlFor="complexion">Complexion</Label>
                <Select onValueChange={(value) => form.setValue("complexion", value as "fair" | "wheatish" | "dark")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select complexion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="wheatish">Wheatish</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "education":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="educationLevel">Education Level</Label>
                <Select onValueChange={(value) => form.setValue("educationLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ssc">SSC</SelectItem>
                    <SelectItem value="hsc">HSC</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  {...form.register("profession")}
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div>
                <Label htmlFor="annualIncome">Annual Income</Label>
                <Input
                  id="annualIncome"
                  {...form.register("annualIncome")}
                  placeholder="e.g., 5-10 Lakhs"
                />
              </div>

              <div>
                <Label htmlFor="workLocation">Work Location</Label>
                <Input
                  id="workLocation"
                  {...form.register("workLocation")}
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="educationDetails">Education Details</Label>
              <Textarea
                id="educationDetails"
                {...form.register("educationDetails")}
                placeholder="Describe your educational background in detail"
                rows={3}
              />
            </div>
          </div>
        );

      case "family":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  {...form.register("fatherName")}
                  placeholder="Father's full name"
                />
              </div>

              <div>
                <Label htmlFor="fatherOccupation">Father's Occupation</Label>
                <Input
                  id="fatherOccupation"
                  {...form.register("fatherOccupation")}
                  placeholder="Father's profession"
                />
              </div>

              <div>
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  {...form.register("motherName")}
                  placeholder="Mother's full name"
                />
              </div>

              <div>
                <Label htmlFor="motherOccupation">Mother's Occupation</Label>
                <Input
                  id="motherOccupation"
                  {...form.register("motherOccupation")}
                  placeholder="Mother's profession"
                />
              </div>

              <div>
                <Label htmlFor="siblingsCount">Number of Siblings</Label>
                <Input
                  id="siblingsCount"
                  type="number"
                  {...form.register("siblingsCount", { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="siblingsDetails">Siblings Details</Label>
              <Textarea
                id="siblingsDetails"
                {...form.register("siblingsDetails")}
                placeholder="Details about your brothers and sisters"
                rows={2}
              />
            </div>
          </div>
        );

      case "religious":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sect">Sect</Label>
                <Select onValueChange={(value) => form.setValue("sect", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunni">Sunni</SelectItem>
                    <SelectItem value="shia">Shia</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="religiousPractice">Religious Practice</Label>
                <Select onValueChange={(value) => form.setValue("religiousPractice", value as "regular" | "occasional" | "minimal")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select practice level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prayerFrequency">Prayer Frequency</Label>
                <Select onValueChange={(value) => form.setValue("prayerFrequency", value as "5_times" | "3_times" | "occasional")}>
                  <SelectTrigger>
                    <SelectValue placeholder="How often do you pray?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5_times">5 times daily</SelectItem>
                    <SelectItem value="3_times">3 times daily</SelectItem>
                    <SelectItem value="occasional">Occasionally</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fasting">Fasting</Label>
                <Select onValueChange={(value) => form.setValue("fasting", value as "ramadan_only" | "regular" | "occasional")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fasting habits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ramadan_only">Ramadan only</SelectItem>
                    <SelectItem value="regular">Regular fasting</SelectItem>
                    <SelectItem value="occasional">Occasionally</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select onValueChange={(value) => form.setValue("maritalStatus", value as "never_married" | "divorced" | "widowed")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never_married">Never Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="willingToRelocate"
                  {...form.register("willingToRelocate")}
                />
                <Label htmlFor="willingToRelocate">Willing to relocate</Label>
              </div>

              <div>
                <Label htmlFor="preferredAgeMin">Preferred Age (Min)</Label>
                <Input
                  id="preferredAgeMin"
                  type="number"
                  {...form.register("preferredAgeMin", { valueAsNumber: true })}
                  placeholder="18"
                />
              </div>

              <div>
                <Label htmlFor="preferredAgeMax">Preferred Age (Max)</Label>
                <Input
                  id="preferredAgeMax"
                  type="number"
                  {...form.register("preferredAgeMax", { valueAsNumber: true })}
                  placeholder="35"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredEducation">Preferred Education</Label>
                <Input
                  id="preferredEducation"
                  {...form.register("preferredEducation")}
                  placeholder="e.g., Bachelor's degree or higher"
                />
              </div>

              <div>
                <Label htmlFor="preferredProfession">Preferred Profession</Label>
                <Input
                  id="preferredProfession"
                  {...form.register("preferredProfession")}
                  placeholder="e.g., Doctor, Engineer"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="preferredLocation">Preferred Location</Label>
              <Input
                id="preferredLocation"
                {...form.register("preferredLocation")}
                placeholder="Cities or countries you prefer"
              />
            </div>

            <div>
              <Label htmlFor="otherPreferences">Other Preferences</Label>
              <Textarea
                id="otherPreferences"
                {...form.register("otherPreferences")}
                placeholder="Any other preferences or requirements"
                rows={3}
              />
            </div>
          </div>
        );

      case "additional":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hobbies">Hobbies & Interests</Label>
              <Input
                id="hobbies"
                {...form.register("hobbies")}
                placeholder="e.g., Reading, cooking, sports"
              />
            </div>

            <div>
              <Label htmlFor="languages">Languages Known</Label>
              <Input
                id="languages"
                {...form.register("languages")}
                placeholder="e.g., English, Bengali, Arabic"
              />
            </div>

            <div>
              <Label htmlFor="aboutMe">About Me</Label>
              <Textarea
                id="aboutMe"
                {...form.register("aboutMe")}
                placeholder="Tell us about yourself, your personality, values, etc."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="expectations">Expectations from Marriage</Label>
              <Textarea
                id="expectations"
                {...form.register("expectations")}
                placeholder="What are your expectations from marriage and married life?"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Marriage Biodata</h1>
        <p className="text-muted-foreground">
          Step {currentStep + 1} of {steps.length}: {currentStepData.title}
        </p>
        <Progress value={progress} className="mt-4" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          <CardDescription>
            Fill in the information for this step. You can save and continue later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-6">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveAndExit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save & Exit"}
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : currentStep === steps.length - 1
                    ? "Complete Biodata"
                    : "Save & Next"
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

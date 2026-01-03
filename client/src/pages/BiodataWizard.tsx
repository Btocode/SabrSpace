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
  DeclarationsData,
} from "@/components/biodata";
import { useBiodataWizardStore } from "@/stores/biodataWizardStore";

import {
  Save,
  CheckCircle,
  Share2,
  Copy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Step schemas with improved validation
const basicProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  biodata_type: z.enum(["groom", "bride"], {
    required_error: "Please select if you are looking for a groom or bride",
  }),
  marital_status: z.enum(["unmarried", "married", "divorced", "widowed"], {
    required_error: "Marital status is required",
  }),
  birth_month_year: z.date({
    required_error: "Birth date is required",
  }).refine((date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 18 && age <= 80;
  }, "Age must be between 18 and 80 years"),
  height: z.enum([
    "3'0\"", "3'1\"", "3'2\"", "3'3\"", "3'4\"", "3'5\"", "3'6\"", "3'7\"", "3'8\"", "3'9\"", "3'10\"", "3'11\"",
    "4'0\"", "4'1\"", "4'2\"", "4'3\"", "4'4\"", "4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
    "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
    "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\"", "6'7\"", "6'8\"", "6'9\"", "6'10\"", "6'11\"",
    "7'0\""
  ], { required_error: "Height is required" }),
  weight: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+\s*(kg|lbs)?$/.test(val),
      "Weight must be a number with optional unit (kg/lbs)",
    ),
  complexion: z.enum(["fair", "wheatish", "dusky"]).optional(),
  blood_group: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
      errorMap: () => ({ message: "Please select a valid blood group" }),
    })
    .optional(),
  nationality: z
    .string()
    .max(50, "Nationality must be less than 50 characters")
    .default("Bangladeshi"),
});

const addressSchema = z.object({
  permanent_address: z.object({
    country: z
      .string()
      .min(2, "Country is required")
      .max(50, "Country name too long"),
    division: z
      .string()
      .min(2, "Division is required")
      .max(50, "Division name too long"),
    district: z
      .string()
      .min(2, "District is required")
      .max(50, "District name too long"),
    upazila_thana: z
      .string()
      .min(2, "Upazila/Thana is required")
      .max(50, "Upazila/Thana name too long"),
    city_corp: z.string().max(50, "City Corporation name too long").optional(),
    area_name: z.string().max(100, "Area name too long").optional(),
  }),
  current_address: z.object({
    country: z
      .string()
      .min(2, "Country is required")
      .max(50, "Country name too long"),
    division: z
      .string()
      .min(2, "Division is required")
      .max(50, "Division name too long"),
    district: z
      .string()
      .min(2, "District is required")
      .max(50, "District name too long"),
    upazila_thana: z
      .string()
      .min(2, "Upazila/Thana is required")
      .max(50, "Upazila/Thana name too long"),
    city_corp: z.string().max(50, "City Corporation name too long").optional(),
    area_name: z.string().max(100, "Area name too long").optional(),
  }),
  where_grew_up: z.string().max(500, "Description too long").optional(),
});

const educationSchema = z.object({
  education_medium: z.enum(["general", "madrasa", "english_medium"]).optional(),
  ssc_year: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}$/.test(val),
      "SSC year must be a valid 4-digit year",
    ),
  ssc_group: z.string().max(50, "SSC group name too long").optional(),
  ssc_result: z
    .string()
    .max(20, "SSC result too long")
    .refine(
      (val) => !val || /^(\d+\.?\d*|\d*\.?\d+)$/.test(val),
      "SSC result must be a valid number",
    )
    .optional(),
  hsc_year: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}$/.test(val),
      "HSC year must be a valid 4-digit year",
    ),
  hsc_group: z.string().max(50, "HSC group name too long").optional(),
  hsc_result: z
    .string()
    .max(20, "HSC result too long")
    .refine(
      (val) => !val || /^(\d+\.?\d*|\d*\.?\d+)$/.test(val),
      "HSC result must be a valid number",
    )
    .optional(),
  higher_education: z
    .array(
      z.object({
        level: z.enum(["bachelor", "master", "phd"]).optional(),
        subject: z.string().max(100, "Subject name too long").optional(),
        institution: z
          .string()
          .max(200, "Institution name too long")
          .optional(),
        passing_year: z
          .string()
          .refine(
            (val) => !val || /^\d{4}$/.test(val),
            "Passing year must be a valid 4-digit year",
          )
          .optional(),
        result: z.string().max(50, "Result description too long").optional(),
      }),
    )
    .default([]),
});

const familySchema = z.object({
  father: z.object({
    alive: z.boolean().default(true),
    occupation: z
      .string()
      .max(100, "Father's occupation description too long")
      .optional(),
  }),
  mother: z.object({
    alive: z.boolean().default(true),
    occupation: z
      .string()
      .max(100, "Mother's occupation description too long")
      .optional(),
  }),
  siblings: z.object({
    brothers_count: z
      .number()
      .min(0)
      .max(20, "Invalid number of brothers")
      .default(0),
    sisters_count: z
      .number()
      .min(0)
      .max(20, "Invalid number of sisters")
      .default(0),
    details: z.string().max(500, "Siblings details too long").optional(),
  }),
  extended_family_summary: z
    .string()
    .max(500, "Extended family summary too long")
    .optional(),
  economic_status: z
    .enum(["lower", "lower_middle", "middle", "upper_middle"])
    .optional(),
  economic_description: z
    .string()
    .max(300, "Economic description too long")
    .optional(),
  family_religious_environment: z
    .string()
    .max(500, "Religious environment description too long")
    .optional(),
});

const personalReligiousSchema = z.object({
  clothing_style: z
    .string()
    .max(300, "Clothing style description too long")
    .optional(),
  sunnati_beard_or_hijab: z
    .string()
    .max(300, "Beard/Hijab description too long")
    .optional(),
  clothes_above_ankle: z.boolean().default(false),
  five_times_prayer: z.enum(["yes", "trying", "no"]).optional(),
  qaza_frequency: z
    .string()
    .max(100, "Qaza frequency description too long")
    .optional(),
  mahram_non_mahram: z.enum(["strict", "trying", "casual"]).optional(),
  quran_tilawat: z.boolean().default(false),
  fiqh: z.enum(["hanafi", "shafi", "maliki", "hanbali", "other"]).optional(),
  entertainment_habit: z
    .string()
    .max(300, "Entertainment habit description too long")
    .optional(),
  health_notes: z.string().max(500, "Health notes too long").optional(),
  islamic_books: z
    .string()
    .max(300, "Islamic books description too long")
    .optional(),
  favorite_scholars: z
    .string()
    .max(300, "Favorite scholars description too long")
    .optional(),
  hobbies: z.string().max(500, "Hobbies description too long").optional(),
});

const careerSchema = z.object({
  occupation_title: z.string().max(100, "Occupation title too long").optional(),
  occupation_details: z
    .string()
    .max(500, "Occupation details too long")
    .optional(),
  monthly_income: z
    .number()
    .min(0)
    .max(10000000, "Income amount too high")
    .optional(),
  workplace_city: z
    .string()
    .max(100, "Workplace city name too long")
    .optional(),
  experience_years: z
    .number()
    .min(0)
    .max(70, "Invalid experience years")
    .optional(),
});

const marriageSchema = z.object({
  marriage_related: z.object({
    guardian_agrees: z.boolean().default(false),
    can_support_purdah: z.boolean().default(false),
    allow_study: z
      .string()
      .max(300, "Study allowance explanation too long")
      .optional(),
    allow_work: z
      .string()
      .max(300, "Work allowance explanation too long")
      .optional(),
    after_marriage_location: z
      .string()
      .max(300, "Marriage location description too long")
      .optional(),
    gifts_expectation: z.boolean().default(false),
    why_marriage_view: z
      .string()
      .max(500, "Marriage view description too long")
      .optional(),
  }),
  desired_spouse: z.object({
    age_range: z
      .string()
      .max(20, "Age range too long")
      .refine(
        (val) => !val || /^\d{1,2}-\d{1,2}$/.test(val),
        "Age range must be in format like 22-28",
      )
      .optional(),
    height_range: z.string().max(20, "Height range too long").optional(),
    complexion: z
      .string()
      .max(50, "Complexion description too long")
      .optional(),
    education: z.string().max(100, "Education preference too long").optional(),
    district_preference: z
      .string()
      .max(300, "District preference too long")
      .optional(),
    marital_status: z
      .string()
      .max(50, "Marital status preference too long")
      .optional(),
    occupation: z
      .string()
      .max(100, "Occupation preference too long")
      .optional(),
    economic_status: z
      .string()
      .max(50, "Economic status preference too long")
      .optional(),
    desired_qualities: z
      .string()
      .max(1000, "Desired qualities description too long")
      .optional(),
  }),
});

const declarationSchema = z.object({
  guardian_knows_submission: z.boolean().default(false),
  swear_true: z.boolean().default(false),
  agree_disclaimer: z.boolean().default(false),
  verification_status: z
    .enum(["pending", "approved", "not_approved"])
    .default("pending"),
});

// Steps configuration
const steps = [
  { id: "basic_profile", title: "Basic Profile", schema: basicProfileSchema },
  { id: "address", title: "Address & Location", schema: addressSchema },
  { id: "education", title: "Education", schema: educationSchema },
  { id: "family", title: "Family Info", schema: familySchema },
  {
    id: "personal_religious",
    title: "Personal & Religious Practice",
    schema: personalReligiousSchema,
  },
  { id: "career", title: "Career & Income", schema: careerSchema },
  {
    id: "marriage",
    title: "Marriage Plan & Preferences",
    schema: marriageSchema,
  },
  {
    id: "declaration",
    title: "Declarations & Verification",
    schema: declarationSchema,
  },
];

type StepFormData =
  | BasicProfileData
  | AddressData
  | EducationData
  | FamilyInfoData
  | PersonalReligiousData
  | CareerIncomeData
  | MarriagePreferencesData
  | DeclarationsData;

export default function BiodataWizard() {
  const [, navigate] = useLocation();
  const { addToast } = useToast();

  const formatFormErrors = (errors: any) => {
    const out: Array<{ path: string; message: string }> = [];

    const walk = (node: any, prefix: string) => {
      if (!node) return;
      if (typeof node !== "object") return;

      if (typeof node.message === "string" && node.message.trim().length > 0) {
        out.push({ path: prefix || "field", message: node.message });
      }

      for (const [k, v] of Object.entries(node)) {
        if (k === "message" || k === "type" || k === "ref") continue;
        const nextPrefix = prefix ? `${prefix}.${k}` : k;
        walk(v, nextPrefix);
      }
    };

    walk(errors, "");

    // Remove duplicates and keep a stable order
    const seen = new Set<string>();
    return out.filter((e) => {
      const key = `${e.path}:${e.message}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

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
    reset,
  } = useBiodataWizardStore();

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Initialize form for current step with store data
  const form = useForm<StepFormData>({
    resolver: zodResolver(currentStepData.schema as any),
    defaultValues: {} as any,
  });

  // Reset form when step changes or formData updates
  useEffect(() => {
    const stepData = (formData as any)?.[currentStepData.id];
    if (stepData && Object.keys(stepData).length > 0) {
      form.reset(stepData);
    } else {
      // Reset to empty form for new step
      form.reset({});
    }
  }, [currentStepData.id, formData, form]);

  // Real-time data persistence - save to store when form data changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const subscription = form.watch((data) => {
      // Clear previous timeout
      if (timeoutId) clearTimeout(timeoutId);

      // Debounce updates to avoid excessive store updates
      timeoutId = setTimeout(() => {
        // Only update if there's actual data
        if (data && Object.keys(data).length > 0) {
          // Check if data has actually changed from what's in the store
          const currentStoreData = (formData as any)?.[currentStepData.id] || {};
          const hasChanges = JSON.stringify(data) !== JSON.stringify(currentStoreData);

          if (hasChanges) {
            updateStepData(currentStepData.id, data);
          }
        }
      }, 300); // 300ms debounce
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [form, currentStepData.id, updateStepData, formData]);

  useEffect(() => {
    const loadExistingData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const editIdRaw = urlParams.get("edit");

      if (!editIdRaw) {
        // For new biodata creation, always reset the store to ensure clean state
        reset();
        return;
      }
  
      // ✅ hard validation
      if (!/^\d+$/.test(editIdRaw)) {
        reset();
        addToast({
          type: "error",
          title: "Invalid edit link",
          description: "That biodata id is not valid.",
          duration: 4000,
        });
        // optional: clean URL
        navigate("/biodata/create");
        return;
      }
  
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(api.biodata.get.path.replace(":id", editIdRaw), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
  
        if (response.ok) {
          const biodata = await response.json();
          loadExistingBiodata(biodata);
        }
      } catch (error) {
        console.error("Failed to load biodata:", error);
      }
    };
  
    loadExistingData();
  }, [loadExistingBiodata, reset, addToast, navigate]);
  

  // Map frontend 8-step data to backend schema
  const mapToBackendSchema = (allData: any) => {
    const basic = allData.basic_profile;
    const address = allData.address;
    const education = allData.education;
    const family = allData.family;
    const personal = allData.personal_religious;
    const career = allData.career;
    const marriage = allData.marriage;

    const hasMeaningfulData = (value: any): boolean => {
      if (!value) return false;
      if (typeof value !== "object") return Boolean(value);
      if (Array.isArray(value)) return value.length > 0;
      return Object.values(value).some((v) => {
        if (v === null || v === undefined) return false;
        if (typeof v === "string") return v.trim().length > 0;
        if (typeof v === "number") return true;
        if (typeof v === "boolean") return true;
        if (v instanceof Date) return !Number.isNaN(v.getTime());
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === "object") return hasMeaningfulData(v);
        return Boolean(v);
      });
    };

    const mapMaritalStatus = (
      status: any,
    ): "never_married" | "married" | "divorced" | "widowed" | undefined => {
      if (!status) return undefined;
      if (status === "unmarried") return "never_married";
      if (status === "married") return "married";
      if (status === "divorced") return "divorced";
      if (status === "widowed") return "widowed";
      return undefined;
    };

    const payload: any = {};

    // Only include basic profile fields if we actually have meaningful basic data.
    // This prevents PATCH updates from overwriting saved biodata with empty defaults.
    if (hasMeaningfulData(basic)) {
      const gender =
        basic?.biodata_type === "groom"
          ? "male"
          : basic?.biodata_type === "bride"
            ? "female"
            : undefined;

      payload.fullName = basic?.fullName;
      payload.gender = gender;
      payload.dateOfBirth = basic?.birth_month_year;
      payload.maritalStatus = mapMaritalStatus(basic?.marital_status);
      payload.height = basic?.height;
      payload.weight = basic?.weight;
      payload.complexion = basic?.complexion;
      payload.bloodGroup = basic?.blood_group;
      payload.nationality = basic?.nationality;
    }

    // Only include address data if address step is completed
    if (hasMeaningfulData(address)) {
      payload.address = `${address.permanent_address.area_name || ""}, ${address.permanent_address.district}, ${address.permanent_address.division}, ${address.permanent_address.country}`.replace(/^, /, "");
      payload.city = address.permanent_address.district;
      payload.state = address.permanent_address.division;
      payload.country = address.permanent_address.country;
    }

    // Only include education data if education step is completed
    if (hasMeaningfulData(education)) {
      payload.educationLevel = education.education_medium;
      payload.educationDetails = education.ssc_year
        ? `SSC: ${education.ssc_year}, ${education.ssc_group}, ${education.ssc_result}` +
          (education.hsc_year ? ` | HSC: ${education.hsc_year}, ${education.hsc_group}, ${education.hsc_result}` : "") +
          (education.higher_education?.length ? ` | Higher: ${education.higher_education.map((h: any) => `${h.level} in ${h.subject}`).join(", ")}` : "")
        : undefined;
    }

    // Only include career data if career step is completed
    if (hasMeaningfulData(career)) {
      payload.profession = career.occupation_title;
      payload.occupation = career.occupation_details;
      payload.annualIncome = career.monthly_income ? (career.monthly_income * 12).toString() : undefined;
      payload.workLocation = career.workplace_city;
    }

    // Only include family data if family step is completed
    if (hasMeaningfulData(family)) {
      payload.fatherName = family.father?.occupation ? `Father - ${family.father.occupation}` : undefined;
      payload.fatherOccupation = family.father?.occupation;
      payload.motherName = family.mother?.occupation ? `Mother - ${family.mother.occupation}` : undefined;
      payload.motherOccupation = family.mother?.occupation;
      payload.siblingsCount = (family.siblings?.brothers_count || 0) + (family.siblings?.sisters_count || 0);
      payload.siblingsDetails = family.siblings?.details;
    }

    // Only include personal/religious data if personal step is completed
    if (hasMeaningfulData(personal)) {
      payload.religion = "islam";
      payload.religiousPractice = personal.five_times_prayer === "yes" ? "regular" : personal.five_times_prayer === "trying" ? "regular" : "occasional";
      payload.prayerFrequency = personal.five_times_prayer === "yes" ? "5_times" : personal.five_times_prayer === "trying" ? "3_times" : "occasional";
      payload.fasting = "ramadan_only";
      payload.quranReading = personal.quran_tilawat ? "daily" : "occasional";
      payload.hobbies = personal.hobbies;
      payload.aboutMe = personal.health_notes;
    }

    // Only include marriage data if marriage step is completed
    if (hasMeaningfulData(marriage)) {
      // Don't re-send maritalStatus here; it belongs to basic profile.
      payload.willingToRelocate = !!marriage.marriage_related?.after_marriage_location;
      const parseIntSafe = (v?: string): number | undefined => {
        if (!v) return undefined;
        const n = Number.parseInt(v, 10);
        return Number.isFinite(n) ? n : undefined;
      };

      const parts = marriage.desired_spouse?.age_range?.split("-").map((s: string) => s.trim());
      payload.preferredAgeMin = parts?.[0] ? parseIntSafe(parts[0]) : undefined;
      payload.preferredAgeMax = parts?.[1] ? parseIntSafe(parts[1]) : undefined;
      payload.preferredEducation = marriage.desired_spouse?.education;
      payload.preferredProfession = marriage.desired_spouse?.occupation;
      payload.preferredLocation = marriage.desired_spouse?.district_preference;
      payload.otherPreferences = marriage.desired_spouse?.desired_qualities;
      payload.expectations = marriage.marriage_related?.why_marriage_view;
    }

    return payload;
  };

  const saveStepData = async (
    stepId: string,
    stepData: any,
  ): Promise<string | number | undefined> => {
    try {
      const token = localStorage.getItem("auth_token");

      const url = biodataId
        ? api.biodataWizard.updateStep.path
            .replace(":id", String(biodataId))
            .replace(":stepId", stepId)
        : api.biodataWizard.createFromBasicProfile.path;

      const method = biodataId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(stepData),
      });

      if (!response.ok) {
        let details = "Failed to save biodata";
        try {
          const errJson = await response.json();
          if (errJson?.message) details = String(errJson.message);
          if (Array.isArray(errJson?.errors) && errJson.errors.length > 0) {
            const msg = errJson.errors
              .map((e: any) => {
                const path = Array.isArray(e.path) ? e.path.join(".") : e.path;
                return path ? `${path}: ${e.message}` : e.message;
              })
              .filter(Boolean)
              .slice(0, 6)
              .join("\n");
            if (msg) details = msg;
          }
        } catch {
          // ignore JSON parsing errors
        }
        throw new Error(details);
      }

      const savedBiodata = await response.json();
      setBiodataId(savedBiodata.id);

      // Toast only for first save or last step save
      if (!biodataId || currentStep === steps.length - 1) {
        addToast({
          type: "success",
          title: "Progress saved!",
          description:
            "Your biodata is saved as draft. You can continue anytime.",
          duration: 3000,
        });
      }

      return savedBiodata.id;
    } catch (error) {
      console.error("Save step error:", error);

      // Show error toast for all steps (not just final step)
      addToast({
        type: "error",
        title: "Failed to save step data",
        description:
          error instanceof Error ? error.message : "Please check your data and try again",
        duration: 5000,
      });

      return undefined;
    }
  };

  const markBiodataComplete = async (
    allData: any,
    idToUse?: string | number,
  ) => {
    const id = idToUse ?? biodataId;
    if (!id) {
      addToast({
        type: "error",
        title: "Could not complete biodata",
        description: "Missing biodata id. Please try again.",
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = mapToBackendSchema(allData);
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        api.biodata.update.path.replace(":id", String(id)),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) throw new Error("Failed to complete biodata");

      let savedBiodata = await response.json();

      // Now publish the biodata
      const publishResponse = await fetch(
        api.biodata.publish.path.replace(":id", String(id)),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      if (publishResponse.ok) {
        savedBiodata = await publishResponse.json();
      } else {
        // If publish fails, still show success but warn that sharing isn't available
        console.warn("Failed to publish biodata, but completion succeeded");
        addToast({
          type: "warning",
          title: "Biodata completed but not published",
          description: "Your biodata was saved but may not be shareable yet.",
          duration: 5000,
        });
      }

      // Generate share URL for published or pending review biodata
      if (savedBiodata.status === "published" || savedBiodata.status === "pending_review") {
        const shareUrl = `${window.location.origin}/b/${savedBiodata.token}`;
        setCreatedBiodataUrl(shareUrl);
      }

      addToast({
        type: "success",
        title: "Biodata completed successfully!",
        description:
          savedBiodata.status === "published"
            ? "Your biodata is now live and shareable."
            : savedBiodata.status === "pending_review"
            ? "Your biodata is submitted for review and shareable."
            : "Your biodata has been saved.",
        duration: 4000,
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to complete biodata",
        description:
          error instanceof Error ? error.message : "Please try again",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    console.log('handleNext called, isLoading:', isLoading);
    console.log('Current form values:', form.getValues());
    console.log('Current form errors:', form.formState.errors);

    const isValid = await form.trigger();
    console.log('Form validation result:', isValid);
    if (!isValid) {
      console.log('Form errors after trigger:', form.formState.errors);

      const formatted = formatFormErrors(form.formState.errors);
      const details = formatted
        .slice(0, 6)
        .map((e) => `- ${e.message}`)
        .join("\n");

      addToast({
        type: "error",
        title: "Please fix the highlighted fields",
        description:
          details || "Some required information is missing or invalid.",
        duration: 4000,
      });
      return;
    }

    const data = form.getValues();

    // Update step data in store
    updateStepData(currentStepData.id, data);

    // Save only this step to the step-specific endpoint
    const savedId = await saveStepData(currentStepData.id, data);

    // Only proceed if save was successful (savedId is not undefined)
    if (savedId !== undefined) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final step: complete/publish (still uses legacy path for now)
        const updatedFormData = {
          ...(formData as any),
          [currentStepData.id]: data,
        };
        await markBiodataComplete(updatedFormData, savedId);
      }
    } else {
      // Save failed, don't proceed to next step
      console.log('Step save failed, staying on current step');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
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

              <h3 className="text-3xl font-bold mb-4 text-primary font-serif">
                Biodata Created Successfully!
              </h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Your marriage biodata has been created and is ready to share
                with potential matches.
              </p>

              <div className="bg-primary/5 p-6 rounded-xl mb-6 border border-primary/20">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Share2 className="w-6 h-6 text-primary" />
                  <span className="font-medium text-lg text-primary font-serif">
                    Share Your Biodata
                  </span>
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
                        duration: 2000,
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
            <h1 className="text-3xl font-bold font-serif text-primary mb-2">
              Create Marriage Biodata
            </h1>
            <p className="text-muted-foreground">
              Step {currentStep + 1} of {steps.length}: {currentStepData.title}
            </p>
          </div>

          {/* Step Content */}
          <div className="mb-8">{renderStepContent()}</div>

          {/* Bottom Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t z-10">
            <div className="container max-w-4xl mx-auto">
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

                <div className="flex-1 max-w-md mx-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{Math.round(progress)}% Complete</span>
                    <span>
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2 [&>[role=progressbar]]:bg-gray-300 dark:[&>[role=progressbar]]:bg-gray-600"
                  />
                </div>

                <Button
                  onClick={() => {
                    console.log('Next button clicked');
                    handleNext();
                  }}
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

          {/* Spacer so content isn't hidden behind fixed bar */}
          <div className="h-24" />
        </div>
      </div>
    </div>
  );
}

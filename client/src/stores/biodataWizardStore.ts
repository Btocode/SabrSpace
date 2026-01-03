import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface BiodataFormData {
  // Basic Profile
  fullName: string;
  biodata_type: "groom" | "bride";
  marital_status: "unmarried" | "married" | "divorced" | "widowed";
  birth_month_year: string;
  height: string;
  weight: string;
  complexion?: "fair" | "wheatish" | "dusky";
  blood_group?: string;
  nationality: string;

  // Address
  permanent_address: {
    country: string;
    division: string;
    district: string;
    upazila_thana: string;
    city_corp?: string;
    area_name?: string;
  };
  current_address: {
    country: string;
    division: string;
    district: string;
    upazila_thana: string;
    city_corp?: string;
    area_name?: string;
  };
  where_grew_up: string;

  // Education
  education_medium?: "general" | "madrasa" | "english_medium";
  ssc_year?: string;
  ssc_group?: string;
  ssc_result?: string;
  hsc_year?: string;
  hsc_group?: string;
  hsc_result?: string;
  higher_education: Array<{
    level?: "bachelor" | "master" | "phd";
    subject?: string;
    institution?: string;
    passing_year?: string;
    result?: string;
  }>;

  // Family
  father: {
    alive: boolean;
    occupation: string;
  };
  mother: {
    alive: boolean;
    occupation: string;
  };
  siblings: {
    brothers_count: number;
    sisters_count: number;
    details: string;
  };
  extended_family_summary: string;
  economic_status?: "lower" | "lower_middle" | "middle" | "upper_middle";
  economic_description: string;
  family_religious_environment: string;

  // Personal & Religious
  clothing_style: string;
  sunnati_beard_or_hijab: string;
  clothes_above_ankle: boolean;
  five_times_prayer?: "yes" | "trying" | "no";
  qaza_frequency: string;
  mahram_non_mahram?: "strict" | "trying" | "casual";
  quran_tilawat: boolean;
  fiqh?: "hanafi" | "shafi" | "maliki" | "hanbali" | "other";
  entertainment_habit: string;
  health_notes: string;
  islamic_books: string;
  favorite_scholars: string;
  hobbies: string;

  // Career
  occupation_title: string;
  occupation_details: string;
  monthly_income: number;
  workplace_city: string;
  experience_years: number;

  // Marriage
  marriage_related: {
    guardian_agrees: boolean;
    can_support_purdah: boolean;
    allow_study: string;
    allow_work: string;
    after_marriage_location: string;
    gifts_expectation: boolean;
    why_marriage_view: string;
  };
  desired_spouse: {
    age_range: string;
    height_range: string;
    complexion: string;
    education: string;
    district_preference: string;
    marital_status: string;
    occupation: string;
    economic_status: string;
    desired_qualities: string;
  };

  // Declaration
  guardian_knows_submission: boolean;
  swear_true: boolean;
  agree_disclaimer: boolean;
}

interface BiodataWizardState {
  // Form data
  formData: Partial<BiodataFormData>;
  currentStep: number;
  biodataId: string | null;
  createdBiodataUrl: string | null;
  isLoading: boolean;

  // Actions
  setFormData: (data: Partial<BiodataFormData>) => void;
  updateStepData: (stepId: string, data: any) => void;
  setCurrentStep: (step: number) => void;
  setBiodataId: (id: string | null) => void;
  setCreatedBiodataUrl: (url: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
  loadExistingBiodata: (biodata: any) => void;
}

const initialFormData: Partial<BiodataFormData> = {
  // Basic Profile
  fullName: "",
  biodata_type: undefined,
  marital_status: undefined,
  birth_month_year: "",
  height: "",
  weight: "",
  complexion: undefined,
  blood_group: "",
  nationality: "Bangladeshi",

  // Address
  permanent_address: {
    country: "",
    division: "",
    district: "",
    upazila_thana: "",
    city_corp: "",
    area_name: "",
  },
  current_address: {
    country: "",
    division: "",
    district: "",
    upazila_thana: "",
    city_corp: "",
    area_name: "",
  },
  where_grew_up: "",

  // Education
  education_medium: undefined,
  ssc_year: "",
  ssc_group: "",
  ssc_result: "",
  hsc_year: "",
  hsc_group: "",
  hsc_result: "",
  higher_education: [],

  // Family
  father: { alive: true, occupation: "" },
  mother: { alive: true, occupation: "" },
  siblings: { brothers_count: 0, sisters_count: 0, details: "" },
  extended_family_summary: "",
  economic_status: undefined,
  economic_description: "",
  family_religious_environment: "",

  // Personal & Religious
  clothing_style: "",
  sunnati_beard_or_hijab: "",
  clothes_above_ankle: false,
  five_times_prayer: undefined,
  qaza_frequency: "",
  mahram_non_mahram: undefined,
  quran_tilawat: false,
  fiqh: undefined,
  entertainment_habit: "",
  health_notes: "",
  islamic_books: "",
  favorite_scholars: "",
  hobbies: "",

  // Career
  occupation_title: "",
  occupation_details: "",
  monthly_income: 0,
  workplace_city: "",
  experience_years: 0,

  // Marriage
  marriage_related: {
    guardian_agrees: false,
    can_support_purdah: false,
    allow_study: "",
    allow_work: "",
    after_marriage_location: "",
    gifts_expectation: false,
    why_marriage_view: "",
  },
  desired_spouse: {
    age_range: "",
    height_range: "",
    complexion: "",
    education: "",
    district_preference: "",
    marital_status: "",
    occupation: "",
    economic_status: "",
    desired_qualities: "",
  },

  // Declaration
  guardian_knows_submission: false,
  swear_true: false,
  agree_disclaimer: false,
};

export const useBiodataWizardStore = create<BiodataWizardState>()(
  devtools(
    (set, get) => ({
      formData: initialFormData,
      currentStep: 0,
      biodataId: null,
      createdBiodataUrl: null,
      isLoading: false,

      setFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
      })),

      updateStepData: (stepId, data) => set((state) => ({
        formData: { ...state.formData, [stepId]: data }
      })),

      setCurrentStep: (step) => set({ currentStep: step }),

      setBiodataId: (id) => set({ biodataId: id }),

      setCreatedBiodataUrl: (url) => set({ createdBiodataUrl: url }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      reset: () => set({
        formData: initialFormData,
        currentStep: 0,
        biodataId: null,
        createdBiodataUrl: null,
        isLoading: false,
      }),

      loadExistingBiodata: (biodata) => set((state) => ({
        biodataId: biodata.id,
        formData: {
          // Map backend data to frontend format
          fullName: biodata.fullName,
          biodata_type: biodata.gender === 'male' ? 'groom' : biodata.gender === 'female' ? 'bride' : 'groom',
          marital_status: biodata.maritalStatus === 'never_married' ? 'unmarried' :
                        biodata.maritalStatus === 'divorced' ? 'divorced' :
                        biodata.maritalStatus === 'widowed' ? 'widowed' : 'unmarried',
          birth_month_year: "",
          height: biodata.height || "",
          weight: biodata.weight || "",
          complexion: biodata.complexion as "fair" | "wheatish" | "dusky",
          blood_group: biodata.bloodGroup || "",
          nationality: "Bangladeshi",

          permanent_address: {
            country: biodata.country || "",
            division: biodata.state || "",
            district: biodata.city || "",
            upazila_thana: "",
            city_corp: "",
            area_name: "",
          },
          current_address: {
            country: biodata.country || "",
            division: biodata.state || "",
            district: biodata.city || "",
            upazila_thana: "",
            city_corp: "",
            area_name: "",
          },
          where_grew_up: "",

          education_medium: biodata.educationLevel as "general" | "madrasa" | "english_medium",
          ssc_year: "",
          ssc_group: "",
          ssc_result: "",
          hsc_year: "",
          hsc_group: "",
          hsc_result: "",
          higher_education: [],

          father: { alive: true, occupation: biodata.fatherOccupation || "" },
          mother: { alive: true, occupation: biodata.motherOccupation || "" },
          siblings: {
            brothers_count: Math.floor((biodata.siblingsCount || 0) / 2),
            sisters_count: Math.floor((biodata.siblingsCount || 0) / 2),
            details: biodata.siblingsDetails || ""
          },
          extended_family_summary: "",
          economic_status: "middle",
          economic_description: "",
          family_religious_environment: "",

          clothing_style: "",
          sunnati_beard_or_hijab: "",
          clothes_above_ankle: false,
          five_times_prayer: biodata.prayerFrequency === '5_times' ? 'yes' :
                           biodata.prayerFrequency === '3_times' ? 'trying' : 'no',
          qaza_frequency: "",
          mahram_non_mahram: "strict",
          quran_tilawat: biodata.quranReading === 'daily',
          fiqh: biodata.sect as "hanafi" | "shafi" | "maliki" | "hanbali" | "other",
          entertainment_habit: "",
          health_notes: biodata.aboutMe || "",
          islamic_books: "",
          favorite_scholars: "",
          hobbies: biodata.hobbies || "",

          occupation_title: biodata.profession || "",
          occupation_details: biodata.occupation || "",
          monthly_income: biodata.annualIncome ? Math.floor(parseInt(biodata.annualIncome) / 12) : 0,
          workplace_city: biodata.workLocation || "",
          experience_years: 0,

          marriage_related: {
            guardian_agrees: false,
            can_support_purdah: false,
            allow_study: "",
            allow_work: "",
            after_marriage_location: "",
            gifts_expectation: false,
            why_marriage_view: biodata.expectations || "",
          },
          desired_spouse: {
            age_range: biodata.preferredAgeMin && biodata.preferredAgeMax ?
                      `${biodata.preferredAgeMin}-${biodata.preferredAgeMax}` : "",
            height_range: "",
            complexion: "",
            education: biodata.preferredEducation || "",
            district_preference: biodata.preferredLocation || "",
            marital_status: "",
            occupation: biodata.preferredProfession || "",
            economic_status: "",
            desired_qualities: biodata.otherPreferences || "",
          },

          guardian_knows_submission: false,
          swear_true: false,
          agree_disclaimer: false,
        }
      })),
    }),
    { name: 'biodata-wizard' }
  )
);

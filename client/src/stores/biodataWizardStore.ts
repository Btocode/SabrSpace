import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type BiodataWizardFormData = Record<string, any>;

interface BiodataWizardState {
  // Form data
  formData: BiodataWizardFormData;
  currentStep: number;
  biodataId: number | null;
  createdBiodataUrl: string | null;
  isLoading: boolean;

  // Actions
  setFormData: (data: BiodataWizardFormData) => void;
  updateStepData: (stepId: string, data: any) => void;
  setCurrentStep: (step: number) => void;
  setBiodataId: (id: number | null) => void;
  setCreatedBiodataUrl: (url: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
  loadExistingBiodata: (biodata: any) => void;
}

const initialFormData: BiodataWizardFormData = {};

export const useBiodataWizardStore = create<BiodataWizardState>()(
  devtools(
    (set, get) => ({
      formData: initialFormData,
      currentStep: 0,
      biodataId: null,
      createdBiodataUrl: null,
      isLoading: false,

      setFormData: (data) => set((state) => ({
        formData: { ...data }
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
        biodataId: typeof biodata.id === "number" ? biodata.id : Number(biodata.id),
        formData: {
          basic_profile: {
            fullName: biodata.fullName ?? "",
            biodata_type:
              biodata.gender === "male" ? "groom" : biodata.gender === "female" ? "bride" : "groom",
            marital_status:
              biodata.maritalStatus === "never_married"
                ? "unmarried"
                : biodata.maritalStatus === "married"
                  ? "married"
                  : biodata.maritalStatus === "divorced"
                    ? "divorced"
                    : biodata.maritalStatus === "widowed"
                      ? "widowed"
                      : "unmarried",
            birth_month_year: biodata.dateOfBirth ? new Date(biodata.dateOfBirth) : new Date(2000, 0, 1),
            height: biodata.height ?? "",
            weight: biodata.weight ?? "",
            complexion: biodata.complexion ?? undefined,
            blood_group: biodata.bloodGroup ?? undefined,
            nationality: "Bangladeshi",
          },
          address: {
            permanent_address: {
              country: biodata.country ?? "",
              division: biodata.state ?? "",
              district: biodata.city ?? "",
              upazila_thana: "",
              city_corp: "",
              area_name: "",
            },
            current_address: {
              country: biodata.country ?? "",
              division: biodata.state ?? "",
              district: biodata.city ?? "",
              upazila_thana: "",
              city_corp: "",
              area_name: "",
            },
            where_grew_up: "",
          },
        }
      })),
    }),
    { name: 'biodata-wizard' }
  )
);

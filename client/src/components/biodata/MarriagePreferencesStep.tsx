import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export type MarriagePreferencesData = {
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
};

interface MarriagePreferencesStepProps {
  form: UseFormReturn<MarriagePreferencesData>;
}

export function MarriagePreferencesStep({ form }: MarriagePreferencesStepProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Marriage Plan & Preferences</CardTitle>
        <CardDescription>Your marriage plans and desired spouse qualities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Marriage-related Plans */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Your Marriage Plans</h4>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="guardian_agrees"
                checked={form.watch("marriage_related.guardian_agrees")}
                onCheckedChange={(checked) => form.setValue("marriage_related.guardian_agrees", !!checked)}
              />
              <Label htmlFor="guardian_agrees">Guardian agrees to marriage</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="can_support_purdah"
                checked={form.watch("marriage_related.can_support_purdah")}
                onCheckedChange={(checked) => form.setValue("marriage_related.can_support_purdah", !!checked)}
              />
              <Label htmlFor="can_support_purdah">Can support purdah observance</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="gifts_expectation"
                checked={form.watch("marriage_related.gifts_expectation")}
                onCheckedChange={(checked) => form.setValue("marriage_related.gifts_expectation", !!checked)}
              />
              <Label htmlFor="gifts_expectation">Expect gifts/dowry</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allow_study">Will you allow your spouse to study?</Label>
            <Textarea
              id="allow_study"
              {...form.register("marriage_related.allow_study")}
              placeholder="Explain your views on spouse continuing education"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allow_work">Will you allow your spouse to work?</Label>
            <Textarea
              id="allow_work"
              {...form.register("marriage_related.allow_work")}
              placeholder="Explain your views on spouse working outside"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="after_marriage_location">Where will you live after marriage?</Label>
            <Textarea
              id="after_marriage_location"
              {...form.register("marriage_related.after_marriage_location")}
              placeholder="Describe your preferred living arrangement after marriage"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="why_marriage_view">Your view on marriage</Label>
            <Textarea
              id="why_marriage_view"
              {...form.register("marriage_related.why_marriage_view")}
              placeholder="Share your thoughts and expectations about marriage"
              rows={3}
            />
          </div>
        </div>

        {/* Desired Spouse */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Desired Spouse Qualities</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="spouse_age_range">Age Range</Label>
              <Input
                id="spouse_age_range"
                {...form.register("desired_spouse.age_range")}
                placeholder="e.g., 22-28 years"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouse_height_range">Height Range</Label>
              <Input
                id="spouse_height_range"
                {...form.register("desired_spouse.height_range")}
                placeholder="e.g., 5'2 - 5'6"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="spouse_complexion">Complexion</Label>
              <Input
                id="spouse_complexion"
                {...form.register("desired_spouse.complexion")}
                placeholder="e.g., Fair, Wheatish"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouse_education">Education Preference</Label>
              <Input
                id="spouse_education"
                {...form.register("desired_spouse.education")}
                placeholder="e.g., Graduate, Masters"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="spouse_district_preference">Preferred Districts</Label>
            <Textarea
              id="spouse_district_preference"
              {...form.register("desired_spouse.district_preference")}
              placeholder="List preferred districts for spouse's origin"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="spouse_marital_status">Marital Status Preference</Label>
              <Input
                id="spouse_marital_status"
                {...form.register("desired_spouse.marital_status")}
                placeholder="e.g., Unmarried"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouse_occupation">Occupation Preference</Label>
              <Input
                id="spouse_occupation"
                {...form.register("desired_spouse.occupation")}
                placeholder="e.g., Any, Doctor, Teacher"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="spouse_economic_status">Economic Status Preference</Label>
            <Input
              id="spouse_economic_status"
              {...form.register("desired_spouse.economic_status")}
              placeholder="e.g., Middle class, Any"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spouse_desired_qualities">Desired Qualities/Character</Label>
            <Textarea
              id="spouse_desired_qualities"
              {...form.register("desired_spouse.desired_qualities")}
              placeholder="Describe the qualities you seek in a spouse"
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

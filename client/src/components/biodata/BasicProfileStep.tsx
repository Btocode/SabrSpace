import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type BasicProfileData = {
  fullName: string;
  biodata_type: "groom" | "bride";
  marital_status: "unmarried" | "married" | "divorced" | "widowed";
  birth_month_year: string;
  height: string;
  weight?: string;
  complexion?: "fair" | "wheatish" | "dusky";
  blood_group?: string;
  nationality: string;
};

interface BasicProfileStepProps {
  form: UseFormReturn<BasicProfileData>;
}

export function BasicProfileStep({ form }: BasicProfileStepProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Basic Information</CardTitle>
        <CardDescription>Essential details about yourself</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-base font-semibold text-foreground/80">Full Name *</Label>
          <Input
            id="fullName"
            {...form.register("fullName")}
            className="h-11"
            placeholder="Enter your full name"
          />
          {form.formState.errors.fullName && (
            <p className="text-destructive text-sm">{form.formState.errors.fullName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="biodata_type" className="text-base font-semibold text-foreground/80">I am looking for *</Label>
            <Select onValueChange={(value) => form.setValue("biodata_type", value as "groom" | "bride")}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select your preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="groom">Groom (পাত্র)</SelectItem>
                <SelectItem value="bride">Bride (পাত্রী)</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.biodata_type && (
              <p className="text-destructive text-sm">{form.formState.errors.biodata_type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="marital_status" className="text-base font-semibold text-foreground/80">Marital Status *</Label>
            <Select onValueChange={(value) => form.setValue("marital_status", value as "unmarried" | "married" | "divorced" | "widowed")}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unmarried">Unmarried</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.marital_status && (
              <p className="text-destructive text-sm">{form.formState.errors.marital_status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_month_year" className="text-base font-semibold text-foreground/80">Birth Month & Year *</Label>
            <Input
              id="birth_month_year"
              {...form.register("birth_month_year")}
              className="h-11"
              placeholder="e.g., January 1995"
            />
            {form.formState.errors.birth_month_year && (
              <p className="text-destructive text-sm">{form.formState.errors.birth_month_year.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="height" className="text-base font-semibold text-foreground/80">Height *</Label>
            <Input
              id="height"
              {...form.register("height")}
              className="h-11"
              placeholder="e.g., 5'6"
            />
            {form.formState.errors.height && (
              <p className="text-destructive text-sm">{form.formState.errors.height.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-base font-semibold text-foreground/80">Weight</Label>
            <Input
              id="weight"
              {...form.register("weight")}
              className="h-11"
              placeholder="e.g., 70 kg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complexion" className="text-base font-semibold text-foreground/80">Complexion</Label>
            <Select onValueChange={(value) => form.setValue("complexion", value as "fair" | "wheatish" | "dusky")}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select complexion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="wheatish">Wheatish</SelectItem>
                <SelectItem value="dusky">Dusky</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blood_group" className="text-base font-semibold text-foreground/80">Blood Group</Label>
            <Select onValueChange={(value) => form.setValue("blood_group", value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality" className="text-base font-semibold text-foreground/80">Nationality</Label>
            <Input
              id="nationality"
              {...form.register("nationality")}
              className="h-11"
              placeholder="e.g., Bangladeshi"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

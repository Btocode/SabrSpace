import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

export type BasicProfileData = {
  fullName: string;
  biodata_type: "groom" | "bride";
  marital_status: "unmarried" | "married" | "divorced" | "widowed";
  birth_month_year: Date;
  height: string;
  weight?: string;
  complexion?: "fair" | "wheatish" | "dusky";
  blood_group?: string;
  nationality: string;
};

interface BasicProfileStepProps {
  form: UseFormReturn<BasicProfileData>;
}

// Height options from 3'0" to 7'0"
const heightOptions = [
  "3'0\"", "3'1\"", "3'2\"", "3'3\"", "3'4\"", "3'5\"", "3'6\"", "3'7\"", "3'8\"", "3'9\"", "3'10\"", "3'11\"",
  "4'0\"", "4'1\"", "4'2\"", "4'3\"", "4'4\"", "4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\"", "6'7\"", "6'8\"", "6'9\"", "6'10\"", "6'11\"",
  "7'0\""
];

export function BasicProfileStep({ form }: BasicProfileStepProps) {
  const biodataType = form.watch("biodata_type");
  const maritalStatus = form.watch("marital_status");
  const height = form.watch("height");
  const complexion = form.watch("complexion");
  const bloodGroup = form.watch("blood_group");

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
            <input
              type="hidden"
              {...form.register("biodata_type")}
            />
            <Select
              value={biodataType ?? undefined}
              onValueChange={(value) =>
                form.setValue("biodata_type", value as "groom" | "bride", { shouldValidate: true })
              }
            >
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
            <input
              type="hidden"
              {...form.register("marital_status")}
            />
            <Select
              value={maritalStatus ?? undefined}
              onValueChange={(value) =>
                form.setValue("marital_status", value as "unmarried" | "married" | "divorced" | "widowed", {
                  shouldValidate: true,
                })
              }
            >
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
            <Label className="text-base font-semibold text-foreground/80">Birth Date *</Label>
            <input
              type="hidden"
              {...form.register("birth_month_year")}
            />
            <DatePicker
              date={form.watch("birth_month_year")}
              onSelect={(date) => {
                form.setValue("birth_month_year", date as Date, { shouldValidate: true, shouldDirty: true });
              }}
              placeholder="Select your birth date"
              className="w-full"
            />
            {form.formState.errors.birth_month_year && (
              <p className="text-destructive text-sm">{form.formState.errors.birth_month_year.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="height" className="text-base font-semibold text-foreground/80">Height *</Label>
            <input
              type="hidden"
              {...form.register("height")}
            />
            <Select
              value={height ?? undefined}
              onValueChange={(value) => form.setValue("height", value, { shouldValidate: true })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select your height" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {heightOptions.map((height) => (
                  <SelectItem key={height} value={height}>
                    {height}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select
              value={complexion ?? undefined}
              onValueChange={(value) => form.setValue("complexion", value as "fair" | "wheatish" | "dusky")}
            >
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
            <Select value={bloodGroup ?? undefined} onValueChange={(value) => form.setValue("blood_group", value)}>
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

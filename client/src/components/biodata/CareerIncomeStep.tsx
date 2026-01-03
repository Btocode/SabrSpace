import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type CareerIncomeData = {
  occupation_title: string;
  occupation_details: string;
  monthly_income: number;
  workplace_city: string;
  experience_years: number;
};

interface CareerIncomeStepProps {
  form: UseFormReturn<CareerIncomeData>;
}

export function CareerIncomeStep({ form }: CareerIncomeStepProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Career & Income</CardTitle>
        <CardDescription>Your professional background and financial status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="occupation_title">Occupation Title</Label>
            <Input
              id="occupation_title"
              {...form.register("occupation_title")}
              placeholder="e.g., Software Engineer, Doctor, Teacher"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly_income">Monthly Income</Label>
            <Input
              id="monthly_income"
              type="number"
              min="0"
              {...form.register("monthly_income", { valueAsNumber: true })}
              placeholder="Enter monthly income in BDT"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation_details">Occupation Details</Label>
          <Textarea
            id="occupation_details"
            {...form.register("occupation_details")}
            placeholder="Describe your job responsibilities, company, etc."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="workplace_city">Workplace City (optional)</Label>
            <Input
              id="workplace_city"
              {...form.register("workplace_city")}
              placeholder="e.g., Dhaka, Chittagong"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience_years">Experience (years, optional)</Label>
            <Input
              id="experience_years"
              type="number"
              min="0"
              {...form.register("experience_years", { valueAsNumber: true })}
              placeholder="Years of experience"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

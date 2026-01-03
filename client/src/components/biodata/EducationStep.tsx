import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export type EducationData = {
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
};

interface EducationStepProps {
  form: UseFormReturn<EducationData>;
}

export function EducationStep({ form }: EducationStepProps) {
  const { fields: higherEducationFields, append: appendHigherEducation, remove: removeHigherEducation } = useFieldArray({
    control: form.control,
    name: "higher_education"
  });

  const educationMedium = form.watch("education_medium");

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Education</CardTitle>
        <CardDescription>Your educational background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="education_medium">Education Medium</Label>
            <Select
              value={educationMedium ?? undefined}
              onValueChange={(value) =>
                form.setValue("education_medium", value as "general" | "madrasa" | "english_medium")
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="madrasa">Madrasa</SelectItem>
                <SelectItem value="english_medium">English Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* SSC */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Secondary School Certificate (SSC)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ssc_year">Year</Label>
              <Input id="ssc_year" {...form.register("ssc_year")} placeholder="e.g., 2010" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ssc_group">Group</Label>
              <Input id="ssc_group" {...form.register("ssc_group")} placeholder="e.g., Science" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ssc_result">Result</Label>
              <Input id="ssc_result" {...form.register("ssc_result")} placeholder="e.g., 5.00" />
            </div>
          </div>
        </div>

        {/* HSC */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Higher Secondary Certificate (HSC)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hsc_year">Year</Label>
              <Input id="hsc_year" {...form.register("hsc_year")} placeholder="e.g., 2012" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hsc_group">Group</Label>
              <Input id="hsc_group" {...form.register("hsc_group")} placeholder="e.g., Science" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hsc_result">Result</Label>
              <Input id="hsc_result" {...form.register("hsc_result")} placeholder="e.g., 4.50" />
            </div>
          </div>
        </div>

        {/* Higher Education */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Higher Education</h4>
            <span className="text-sm text-muted-foreground">{higherEducationFields.length} degrees</span>
          </div>

          {higherEducationFields.map((field, index) => (
            <Card key={field.id} className="border border-border/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Level</Label>
                    <Select
                      value={form.watch(`higher_education.${index}.level`) ?? undefined}
                      onValueChange={(value) =>
                        form.setValue(`higher_education.${index}.level`, value as "bachelor" | "master" | "phd")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelor">Bachelor</SelectItem>
                        <SelectItem value="master">Master</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input {...form.register(`higher_education.${index}.subject`)} placeholder="e.g., Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input {...form.register(`higher_education.${index}.institution`)} placeholder="e.g., University of Dhaka" />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input {...form.register(`higher_education.${index}.passing_year`)} placeholder="e.g., 2018" />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHigherEducation(index)}
                    disabled={higherEducationFields.length === 0}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => appendHigherEducation({
              level: undefined,
              subject: "",
              institution: "",
              passing_year: "",
              result: "",
            })}
            className="w-full py-6 border-dashed border-2 hover:border-primary hover:text-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Higher Education
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

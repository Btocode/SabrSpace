import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export type FamilyInfoData = {
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
  economic_status: "lower" | "lower_middle" | "middle" | "upper_middle";
  economic_description: string;
  family_religious_environment: string;
};

interface FamilyInfoStepProps {
  form: UseFormReturn<FamilyInfoData>;
}

export function FamilyInfoStep({ form }: FamilyInfoStepProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Family Information</CardTitle>
        <CardDescription>Details about your family background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Parents */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Parents</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="father_alive"
                  checked={form.watch("father.alive")}
                  onCheckedChange={(checked) => form.setValue("father.alive", !!checked)}
                />
                <Label htmlFor="father_alive">Father is alive</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="father_occupation">Father's Occupation</Label>
                <Input
                  id="father_occupation"
                  {...form.register("father.occupation")}
                  placeholder="e.g., Businessman, Teacher"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mother_alive"
                  checked={form.watch("mother.alive")}
                  onCheckedChange={(checked) => form.setValue("mother.alive", !!checked)}
                />
                <Label htmlFor="mother_alive">Mother is alive</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_occupation">Mother's Occupation</Label>
                <Input
                  id="mother_occupation"
                  {...form.register("mother.occupation")}
                  placeholder="e.g., Housewife, Doctor"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Siblings */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Siblings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brothers_count">Number of Brothers</Label>
              <Input
                id="brothers_count"
                type="number"
                min="0"
                {...form.register("siblings.brothers_count", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sisters_count">Number of Sisters</Label>
              <Input
                id="sisters_count"
                type="number"
                min="0"
                {...form.register("siblings.sisters_count", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siblings_details">Siblings Details (optional)</Label>
            <Textarea
              id="siblings_details"
              {...form.register("siblings.details")}
              placeholder="Brief details about your siblings (education, marriage status, etc.)"
              rows={3}
            />
          </div>
        </div>

        {/* Extended Family */}
        <div className="space-y-2">
          <Label htmlFor="extended_family_summary">Extended Family Summary (optional)</Label>
          <Textarea
            id="extended_family_summary"
            {...form.register("extended_family_summary")}
            placeholder="Brief information about uncles, aunts, etc."
            rows={3}
          />
        </div>

        {/* Financial & Religious Environment */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Financial & Religious Environment</h4>

          <div className="space-y-2">
            <Label htmlFor="economic_status">Economic Status</Label>
            <Select onValueChange={(value) => form.setValue("economic_status", value as "lower" | "lower_middle" | "middle" | "upper_middle")}>
              <SelectTrigger>
                <SelectValue placeholder="Select economic status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lower">Lower</SelectItem>
                <SelectItem value="lower_middle">Lower-Middle</SelectItem>
                <SelectItem value="middle">Middle</SelectItem>
                <SelectItem value="upper_middle">Upper-Middle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="economic_description">Financial Details (brief)</Label>
            <Textarea
              id="economic_description"
              {...form.register("economic_description")}
              placeholder="Brief description of family's financial situation"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="family_religious_environment">Religious Environment at Home</Label>
            <Textarea
              id="family_religious_environment"
              {...form.register("family_religious_environment")}
              placeholder="Describe the religious practices and environment in your family"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

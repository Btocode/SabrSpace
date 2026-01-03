import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type AddressData = {
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
  where_grew_up?: string;
};

interface AddressStepProps {
  form: UseFormReturn<AddressData>;
}

export function AddressStep({ form }: AddressStepProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Address & Location</CardTitle>
        <CardDescription>Where you live and grew up</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permanent Address */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Permanent Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="permanent_country">Country *</Label>
              <Input id="permanent_country" {...form.register("permanent_address.country")} placeholder="e.g., Bangladesh" />
              {form.formState.errors.permanent_address?.country && (
                <p className="text-destructive text-sm">{form.formState.errors.permanent_address.country.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanent_division">Division *</Label>
              <Input id="permanent_division" {...form.register("permanent_address.division")} placeholder="e.g., Dhaka" />
              {form.formState.errors.permanent_address?.division && (
                <p className="text-destructive text-sm">{form.formState.errors.permanent_address.division.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanent_district">District *</Label>
              <Input id="permanent_district" {...form.register("permanent_address.district")} placeholder="e.g., Dhaka" />
              {form.formState.errors.permanent_address?.district && (
                <p className="text-destructive text-sm">{form.formState.errors.permanent_address.district.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanent_upazila">Upazila/Thana *</Label>
              <Input id="permanent_upazila" {...form.register("permanent_address.upazila_thana")} placeholder="e.g., Dhanmondi" />
              {form.formState.errors.permanent_address?.upazila_thana && (
                <p className="text-destructive text-sm">{form.formState.errors.permanent_address.upazila_thana.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanent_city_corp">City Corporation</Label>
              <Input id="permanent_city_corp" {...form.register("permanent_address.city_corp")} placeholder="e.g., Dhaka North" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanent_area">Area Name</Label>
              <Input id="permanent_area" {...form.register("permanent_address.area_name")} placeholder="e.g., Mirpur" />
            </div>
          </div>
        </div>

        {/* Current Address */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Current Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_country">Country *</Label>
              <Input id="current_country" {...form.register("current_address.country")} placeholder="e.g., Bangladesh" />
              {form.formState.errors.current_address?.country && (
                <p className="text-destructive text-sm">{form.formState.errors.current_address.country.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_division">Division *</Label>
              <Input id="current_division" {...form.register("current_address.division")} placeholder="e.g., Dhaka" />
              {form.formState.errors.current_address?.division && (
                <p className="text-destructive text-sm">{form.formState.errors.current_address.division.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_district">District *</Label>
              <Input id="current_district" {...form.register("current_address.district")} placeholder="e.g., Dhaka" />
              {form.formState.errors.current_address?.district && (
                <p className="text-destructive text-sm">{form.formState.errors.current_address.district.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_upazila">Upazila/Thana *</Label>
              <Input id="current_upazila" {...form.register("current_address.upazila_thana")} placeholder="e.g., Dhanmondi" />
              {form.formState.errors.current_address?.upazila_thana && (
                <p className="text-destructive text-sm">{form.formState.errors.current_address.upazila_thana.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_city_corp">City Corporation</Label>
              <Input id="current_city_corp" {...form.register("current_address.city_corp")} placeholder="e.g., Dhaka North" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_area">Area Name</Label>
              <Input id="current_area" {...form.register("current_address.area_name")} placeholder="e.g., Mirpur" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="where_grew_up">Where did you grow up?</Label>
          <Textarea
            id="where_grew_up"
            {...form.register("where_grew_up")}
            placeholder="Brief description of where you grew up..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}

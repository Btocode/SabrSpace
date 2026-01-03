import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export type DeclarationsData = {
  guardian_knows_submission: boolean;
  swear_true: boolean;
  agree_disclaimer: boolean;
  verification_status: "pending" | "approved" | "not_approved";
};

interface DeclarationsStepProps {
  form: UseFormReturn<DeclarationsData>;
}

export function DeclarationsStep({ form }: DeclarationsStepProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Declarations & Verification</CardTitle>
        <CardDescription>Please confirm the following declarations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="guardian_knows_submission"
              checked={form.watch("guardian_knows_submission")}
              onCheckedChange={(checked) => form.setValue("guardian_knows_submission", !!checked)}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="guardian_knows_submission" className="text-base font-medium">
                Guardian knows about this submission
              </Label>
              <p className="text-sm text-muted-foreground">
                My guardian/parents are aware that I am submitting this biodata for marriage proposals.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="swear_true"
              checked={form.watch("swear_true")}
              onCheckedChange={(checked) => form.setValue("swear_true", !!checked)}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="swear_true" className="text-base font-medium">
                All information provided is true
              </Label>
              <p className="text-sm text-muted-foreground">
                I swear by Allah that all the information provided in this biodata is true and accurate to the best of my knowledge.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="agree_disclaimer"
              checked={form.watch("agree_disclaimer")}
              onCheckedChange={(checked) => form.setValue("agree_disclaimer", !!checked)}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="agree_disclaimer" className="text-base font-medium">
                Agree to terms and disclaimer
              </Label>
              <p className="text-sm text-muted-foreground">
                I agree to the terms of service and understand that this platform facilitates marriage proposals only.
                I accept that final decisions are made by families and individuals involved.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Important Notice</h4>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Your biodata will be reviewed by our team before publication. This usually takes 24-48 hours.
            You will receive a notification once your biodata is approved and published.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

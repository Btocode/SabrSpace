import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export type PersonalReligiousData = {
  clothing_style: string;
  sunnati_beard_or_hijab: string;
  clothes_above_ankle: boolean;
  five_times_prayer: "yes" | "trying" | "no";
  qaza_frequency: string;
  mahram_non_mahram: "strict" | "trying" | "casual";
  quran_tilawat: boolean;
  fiqh: "hanafi" | "shafi" | "maliki" | "hanbali" | "other";
  entertainment_habit: string;
  health_notes: string;
  islamic_books: string;
  favorite_scholars: string;
  hobbies: string;
};

interface PersonalReligiousStepProps {
  form: UseFormReturn<PersonalReligiousData>;
}

export function PersonalReligiousStep({ form }: PersonalReligiousStepProps) {
  const fiveTimesPrayer = form.watch("five_times_prayer");
  const mahramPractice = form.watch("mahram_non_mahram");
  const fiqh = form.watch("fiqh");

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Personal & Religious Practice</CardTitle>
        <CardDescription>Your personal practices and religious observance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Clothing & Appearance */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Clothing & Appearance</h4>

          <div className="space-y-2">
            <Label htmlFor="clothing_style">Clothing Style</Label>
            <Textarea
              id="clothing_style"
              {...form.register("clothing_style")}
              placeholder="Describe your clothing preferences and style"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sunnati_beard_or_hijab">Beard/Hijab Practice</Label>
            <Textarea
              id="sunnati_beard_or_hijab"
              {...form.register("sunnati_beard_or_hijab")}
              placeholder="Describe your practice regarding beard (for men) or hijab (for women)"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="clothes_above_ankle"
              checked={form.watch("clothes_above_ankle")}
              onCheckedChange={(checked) => form.setValue("clothes_above_ankle", !!checked)}
            />
            <Label htmlFor="clothes_above_ankle">Do you wear clothes above the ankle?</Label>
          </div>
        </div>

        {/* Prayer & Religious Practice */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Prayer & Religious Practice</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="five_times_prayer">Do you pray 5 times daily?</Label>
              <Select
                value={fiveTimesPrayer ?? undefined}
                onValueChange={(value) => form.setValue("five_times_prayer", value as "yes" | "trying" | "no")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="trying">Trying</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qaza_frequency">Qaza Frequency</Label>
              <Input
                id="qaza_frequency"
                {...form.register("qaza_frequency")}
                placeholder="How often do you have qaza prayers?"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mahram_non_mahram">Mahram/Non-mahram Practice</Label>
            <Select
              value={mahramPractice ?? undefined}
              onValueChange={(value) => form.setValue("mahram_non_mahram", value as "strict" | "trying" | "casual")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select practice level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strict">Strict</SelectItem>
                <SelectItem value="trying">Trying</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="quran_tilawat"
              checked={form.watch("quran_tilawat")}
              onCheckedChange={(checked) => form.setValue("quran_tilawat", !!checked)}
            />
            <Label htmlFor="quran_tilawat">Can you recite Quran properly?</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fiqh">Fiqh (School of Islamic Jurisprudence)</Label>
            <Select
              value={fiqh ?? undefined}
              onValueChange={(value) =>
                form.setValue("fiqh", value as "hanafi" | "shafi" | "maliki" | "hanbali" | "other")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select madhab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hanafi">Hanafi</SelectItem>
                <SelectItem value="shafi">Shafi</SelectItem>
                <SelectItem value="maliki">Maliki</SelectItem>
                <SelectItem value="hanbali">Hanbali</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Other Personal Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Other Information</h4>

          <div className="space-y-2">
            <Label htmlFor="entertainment_habit">Entertainment Habits</Label>
            <Textarea
              id="entertainment_habit"
              {...form.register("entertainment_habit")}
              placeholder="Describe your entertainment preferences (TV, movies, music, etc.)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="health_notes">Health Notes (brief)</Label>
            <Textarea
              id="health_notes"
              {...form.register("health_notes")}
              placeholder="Any health conditions or notes (brief)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="islamic_books">Islamic Books Read</Label>
            <Textarea
              id="islamic_books"
              {...form.register("islamic_books")}
              placeholder="List Islamic books you've read"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="favorite_scholars">Favorite Scholars</Label>
            <Textarea
              id="favorite_scholars"
              {...form.register("favorite_scholars")}
              placeholder="Name your favorite Islamic scholars or teachers"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hobbies">Hobbies/Likes/Dislikes/Dreams</Label>
            <Textarea
              id="hobbies"
              {...form.register("hobbies")}
              placeholder="Describe your hobbies, likes, dislikes, and dreams"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

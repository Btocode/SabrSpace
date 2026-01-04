import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, MapPin, Briefcase, GraduationCap } from "lucide-react";

interface PublicBiodataCardProps {
  biodata: {
    id: number;
    gender: string;
    dateOfBirth: string | null;
    profession: string | null;
    educationLevel: string | null;
    city: string | null;
    maritalStatus: string;
    sect: string | null;
  };
}

export function PublicBiodataCard({ biodata }: PublicBiodataCardProps) {
  const calcAge = (dobString: string | null) => {
    if (!dobString) return "N/A";
    const dob = new Date(dobString);
    const age = new Date().getFullYear() - dob.getFullYear();
    return age;
  };

  return (
    <Card className="overflow-hidden border-primary/20 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-amber-500/10" />
          <div className="relative p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="outline" className="capitalize rounded-full border-primary/20">
                    {biodata.gender}
                  </Badge>
                  <Badge className="bg-emerald-600 rounded-full">
                    {biodata.maritalStatus.replace('_', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Profile #{biodata.id}
                </CardTitle>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span className="truncate">Age: {calcAge(biodata.dateOfBirth)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span className="truncate">{biodata.city || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="truncate">{biodata.profession || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate">{biodata.educationLevel || "Not specified"}</span>
                </div>
              </div>
              
              {biodata.sect && (
                <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary border border-primary/20">
                  <span className="font-medium">Sect:</span> {biodata.sect}
                </div>
              )}

              <Link href={`/public-biodata/${biodata.id}`}>
                <Button className="w-full mt-3 rounded-full" variant="outline" size="sm">
                  View Full Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

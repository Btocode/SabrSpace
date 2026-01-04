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
    <Card className="hover-elevate transition-all border-primary/10 overflow-hidden">
      <CardHeader className="pb-3 bg-primary/5">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="capitalize">
            {biodata.gender}
          </Badge>
          <Badge className="bg-emerald-600">
            {biodata.maritalStatus.replace('_', ' ')}
          </Badge>
        </div>
        <CardTitle className="text-xl mt-2 font-serif text-primary">
          Member #{biodata.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Age: {calcAge(biodata.dateOfBirth)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>{biodata.city || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-4 h-4 text-amber-600" />
            <span className="truncate">{biodata.profession || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="truncate">{biodata.educationLevel || "Not specified"}</span>
          </div>
        </div>
        
        {biodata.sect && (
          <div className="text-xs font-medium text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded w-fit">
            Sect: {biodata.sect}
          </div>
        )}

        <Link href={`/public-biodata/${biodata.id}`}>
          <Button className="w-full mt-2 rounded-full" variant="outline">
            View Full Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

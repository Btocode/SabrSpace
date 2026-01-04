import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PublicBiodataCard } from "@/components/biodata/PublicBiodataCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal, Heart, Users, Shield, BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Bismillah } from "@/components/Bismillah";
import { useLanguage } from "@/lib/i18n";

// Dummy data for initial implementation
const DUMMY_BIODATA = [
  { id: 1001, gender: "male", dateOfBirth: "1995-05-15", profession: "Software Engineer", educationLevel: "Bachelors", city: "Dhaka", maritalStatus: "never_married", sect: "Sunni" },
  { id: 1002, gender: "female", dateOfBirth: "1998-08-22", profession: "Doctor", educationLevel: "MBBS", city: "Chittagong", maritalStatus: "never_married", sect: "Sunni" },
  { id: 1003, gender: "male", dateOfBirth: "1992-03-10", profession: "Teacher", educationLevel: "Masters", city: "Sylhet", maritalStatus: "never_married", sect: "Sunni" },
  { id: 1004, gender: "female", dateOfBirth: "1996-11-30", profession: "Architect", educationLevel: "Bachelors", city: "Dhaka", maritalStatus: "never_married", sect: "Sunni" },
  { id: 1005, gender: "male", dateOfBirth: "1990-07-05", profession: "Businessman", educationLevel: "Bachelors", city: "Rajshahi", maritalStatus: "divorced", sect: "Sunni" },
  { id: 1006, gender: "female", dateOfBirth: "2000-01-20", profession: "Student", educationLevel: "Bachelors (Final Year)", city: "Dhaka", maritalStatus: "never_married", sect: "Sunni" },
];

export default function PublicBiodataList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const filteredData = DUMMY_BIODATA.filter(item => 
    item.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.gender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-pattern">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Bismillah className="mb-4 opacity-80 text-2xl sm:text-3xl" />
            
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/8 via-background to-amber-500/8 border border-primary/15 p-6 sm:p-8 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-amber-500/3" />
              <div className="relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 font-serif">
                      Biodata Portal
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
                      Find your potential life partner within our respectful community. 
                      Personal details remain private until mutual interest is expressed.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full bg-primary/10 border-primary/20">
                      <Shield className="w-3 h-3 mr-1" />
                      Private & Secure
                    </Badge>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-2 sm:gap-3 text-xs">
                  <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-2 text-muted-foreground border border-border/60">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-primary font-medium">
                      {filteredData.length} Profiles
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-2 text-muted-foreground border border-border/60">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="text-primary font-medium">
                      Islamic Marriage
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-2 text-muted-foreground border border-border/60">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-primary font-medium">
                      Verified Community
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <Card className="border-primary/20 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      placeholder="Search by profession, city, or gender..." 
                      className="pl-10 rounded-full border-primary/20 focus-visible:ring-primary h-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5">
                      <Filter className="w-4 h-4" />
                      Filter
                    </Button>
                    <Button variant="outline" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5">
                      <SlidersHorizontal className="w-4 h-4" />
                      Sort
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Grid */}
          {filteredData.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredData.map((biodata, index) => (
                <motion.div
                  key={biodata.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <PublicBiodataCard biodata={biodata} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-dashed border-2 border-primary/20">
                <CardContent className="flex flex-col items-center justify-center py-12 md:py-16">
                  <div className="text-center space-y-4">
                    <div className="text-5xl md:text-6xl mb-4">🔍</div>
                    <h3 className="text-xl md:text-2xl font-semibold">No matching biodata found</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Try adjusting your search terms or filters to find more profiles.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Guidelines Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-sm sm:text-base">What to Remember</h3>
                </div>
                <ul className="text-xs sm:text-sm space-y-2 text-muted-foreground">
                  <li>• Be respectful and sincere in your search</li>
                  <li>• Focus on character and faith compatibility</li>
                  <li>• Marriage is a sacred commitment in Islam</li>
                  <li>• Seek Allah's guidance in your journey</li>
                  <li>• Base connections on mutual respect</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border bg-background/70">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-sm sm:text-base">How This Works</h3>
                </div>
                <ul className="text-xs sm:text-sm space-y-2 text-muted-foreground">
                  <li>• Browse profiles with essential information</li>
                  <li>• Personal details remain private until mutual interest</li>
                  <li>• All profiles are from verified community members</li>
                  <li>• Contact information shared only with consent</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

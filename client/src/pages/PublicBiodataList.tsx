import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PublicBiodataCard } from "@/components/biodata/PublicBiodataCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

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

  const filteredData = DUMMY_BIODATA.filter(item => 
    item.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.gender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-pattern flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif"
            >
              Public Biodata Portal
            </motion.h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find your potential life partner within our respectful community. 
              Personal details remain hidden until interest is mutual.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-primary/10 mb-8 sticky top-20 z-30">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search by profession, city, or gender..." 
                  className="pl-10 rounded-full border-primary/20 focus-visible:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full gap-2 border-primary/20">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button variant="outline" className="rounded-full gap-2 border-primary/20">
                  <SlidersHorizontal className="w-4 h-4" />
                  Sort
                </Button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.length > 0 ? (
              filteredData.map((biodata, index) => (
                <motion.div
                  key={biodata.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PublicBiodataCard biodata={biodata} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No matching biodata found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-12">
        <p>&copy; {new Date().getFullYear()} SabrSpace. All rights reserved.</p>
      </footer>
    </div>
  );
}

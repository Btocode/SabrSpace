import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Download, Share2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { api } from "@shared/routes";

export default function BiodataList() {
  const { t } = useLanguage();

  const { data: biodata, isLoading } = useQuery({
    queryKey: ["biodata"],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(api.biodata.list.path, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error("Failed to fetch biodata");
      return response.json();
    },
  });

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      pending_review: "warning",
      published: "default",
      rejected: "destructive",
    } as const;

    const labels = {
      draft: "Draft",
      pending_review: "Pending Review",
      published: "Published",
      rejected: "Rejected",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marriage Biodata</h1>
          <p className="text-muted-foreground">Manage your marriage biodata profiles</p>
        </div>
        <Link href="/biodata/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Biodata
          </Button>
        </Link>
      </div>

      {biodata?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">No biodata yet</h3>
              <p className="text-muted-foreground">
                Create your first marriage biodata profile to get started
              </p>
              <Link href="/biodata/create">
                <Button className="gap-2 mt-4">
                  <Plus className="w-4 h-4" />
                  Create Your First Biodata
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {biodata?.map((item: any) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.fullName}</CardTitle>
                    <CardDescription>
                      Created {new Date(item.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Gender: {item.gender}</p>
                    <p>Age: {item.dateOfBirth ? new Date().getFullYear() - new Date(item.dateOfBirth).getFullYear() : 'Not specified'}</p>
                    <p>Location: {item.city}, {item.country}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/biodata/${item.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/biodata/create?edit=${item.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                    </Link>
                    {item.status === 'published' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/b/${item.token}`)}
                        >
                          <Share2 className="w-3 h-3" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="w-3 h-3" />
                          PDF
                        </Button>
                      </>
                    )}
                    {item.status === 'draft' && (
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={async () => {
                          // TODO: Implement publish functionality
                          alert('Publish functionality coming soon!');
                        }}
                      >
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

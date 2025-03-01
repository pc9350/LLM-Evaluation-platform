"use client";

import { useExperimentStore } from "@/store/experimentStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, ExternalLink, Search, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SavedExperimentsPage() {
  const { savedExperiments, deleteSavedExperiment } = useExperimentStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleDeleteExperiment = (id: string) => {
    deleteSavedExperiment(id);
    toast({
      title: "Experiment Deleted",
      description: "The experiment has been removed from your saved list.",
    });
  };

  const filteredExperiments = savedExperiments.filter(exp => 
    exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Saved Experiments</h1>
          <p className="text-muted-foreground">View and manage your saved experiments</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/new-experiment">
            <div className="flex items-center text-blue-600 hover:text-blue-800 gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Experiments</span>
            </div>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Experiment Library</CardTitle>
          <CardDescription>
            Access your previously saved experiments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md p-3 mb-6 text-sm">
            <p className="flex items-center text-blue-800 dark:text-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Local Storage Notice:</span> 
              <span className="ml-1">Experiments are saved in your browser's local storage. They will persist between sessions but will be lost if you clear your browser data or use a different device.</span>
            </p>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search experiments by name or prompt content..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredExperiments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExperiments.map((experiment) => (
                <Card key={experiment.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{experiment.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(experiment.timestamp), 'MMM d, yyyy h:mm a')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {experiment.prompt}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {Object.keys(experiment.results).map((model) => (
                        <Badge key={model} variant="outline" className="text-xs">
                          {model}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Temperature:</span> {experiment.temperature}
                        <span className="mx-2">•</span>
                        <span className="font-medium">Max Tokens:</span> {experiment.maxTokens}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/new-experiment?id=${experiment.id}`}>
                          <Button variant="outline" size="sm" className="h-8 px-2">
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            Load
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleDeleteExperiment(experiment.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? (
                <>
                  <p className="text-xl">No matching experiments found.</p>
                  <p className="mt-2">Try a different search term.</p>
                </>
              ) : (
                <>
                  <p className="text-xl">No saved experiments yet.</p>
                  <p className="mt-2">Run and save experiments to see them here.</p>
                  <div className="mt-6">
                    <Link href="/new-experiment">
                      <Button>Start a New Experiment</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {filteredExperiments.length > 0 && (
        <div className="text-center text-sm text-muted-foreground mt-4">
          Showing {filteredExperiments.length} of {savedExperiments.length} saved experiments
        </div>
      )}
    </div>
  );
} 
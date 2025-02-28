"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ExperimentResult, useExperimentStore } from '@/store/experimentStore';
import { Loader2, Save, Share, BarChart } from "lucide-react";
import Link from 'next/link';

const MODELS = ["gpt-4", "llama-70b", "mixtral"];

export default function NewExperimentPage() {
  const [prompt, setPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [useSystemPrompt, setUseSystemPrompt] = useState(false);
  const [experimentName, setExperimentName] = useState("");
  const { results, setResults } = useExperimentStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResults({});  // Clear previous results
  
    const requests = MODELS.map(async (model) => {
      try {
        const response = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt, 
            model,
            systemPrompt: useSystemPrompt ? systemPrompt : undefined,
            temperature,
            maxTokens
          }),
        });
  
        const data = await response.json();
        setResults((prev: Record<string, ExperimentResult>) => ({
          ...prev,
          [model]: {
            response: data.response,
            responseTime: data.responseTime,
            metrics: {
              tokenCount: data.metrics?.tokenCount || 0,
              promptTokens: data.metrics?.promptTokens || 0,
              completionTokens: data.metrics?.completionTokens || 0,
              cost: data.metrics?.cost || 0,
            }
          },
        }));
      } catch (error) {
        setResults((prev: Record<string, ExperimentResult>) => ({
          ...prev,
          [model]: {
            response: "Error occurred",
            responseTime: 0,
            metrics: {
              tokenCount: 0,
              promptTokens: 0,
              completionTokens: 0,
              cost: 0,
            },
            error: error instanceof Error ? error.message : "Failed to get response"
          },
        }));
      }
    });
  
    await Promise.all(requests);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">New Experiment</h1>
          <p className="text-muted-foreground">Test your prompts across multiple LLM models</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/Dashboard">
            <Button variant="outline" className="gap-2">
              <BarChart className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" className="gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experiment Settings</CardTitle>
              <CardDescription>Configure your experiment parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experiment-name">Experiment Name</Label>
                <Input 
                  id="experiment-name" 
                  placeholder="My Experiment" 
                  value={experimentName}
                  onChange={(e) => setExperimentName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature">Temperature: {temperature}</Label>
                </div>
                <Slider 
                  id="temperature"
                  min={0} 
                  max={2} 
                  step={0.1}
                  value={[temperature]} 
                  onValueChange={(value) => setTemperature(value[0])} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
                </div>
                <Slider 
                  id="max-tokens"
                  min={100} 
                  max={4000} 
                  step={100}
                  value={[maxTokens]} 
                  onValueChange={(value) => setMaxTokens(value[0])} 
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="system-prompt-toggle" 
                  checked={useSystemPrompt}
                  onCheckedChange={setUseSystemPrompt}
                />
                <Label htmlFor="system-prompt-toggle">Use System Prompt</Label>
              </div>
              
              {useSystemPrompt && (
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    placeholder="You are a helpful assistant..."
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleSubmit} 
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Experiment...
                  </>
                ) : "Run Experiment"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Models</CardTitle>
              <CardDescription>Models included in this experiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MODELS.map((model) => (
                  <div key={model} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="font-medium">{model}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Active</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prompt</CardTitle>
              <CardDescription>Enter your prompt to test across all models</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>
          
          <Tabs defaultValue="results" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>
            <TabsContent value="results" className="space-y-4 mt-4">
              {Object.keys(results).length > 0 ? (
                MODELS.map((model) => (
                  <Card key={model}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span>{model}</span>
                        {results[model] && (
                          <span className="text-sm font-normal text-muted-foreground">
                            {results[model].responseTime.toFixed(2)}s
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {results[model] ? (
                        <>
                          <div className="mb-4 whitespace-pre-wrap">
                            {results[model].response}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              <p className="font-semibold">Total Tokens</p>
                              <p>{results[model].metrics?.tokenCount || 0}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              <p className="font-semibold">Prompt Tokens</p>
                              <p>{results[model].metrics?.promptTokens || 0}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              <p className="font-semibold">Completion Tokens</p>
                              <p>{results[model].metrics?.completionTokens || 0}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              <p className="font-semibold">Cost</p>
                              <p>${results[model].metrics?.cost.toFixed(6) || 0}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-muted-foreground">
                          {isLoading ? "Waiting for response..." : "No result yet"}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <p>Running experiment across all models...</p>
                    </div>
                  ) : (
                    <p>Enter a prompt and run the experiment to see results</p>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="comparison" className="mt-4">
              {Object.keys(results).length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Model Comparison</CardTitle>
                    <CardDescription>Side-by-side comparison of model performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Metric</th>
                            {MODELS.map(model => (
                              <th key={model} className="text-left p-2">{model}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Response Time</td>
                            {MODELS.map(model => (
                              <td key={model} className="p-2">
                                {results[model]?.responseTime.toFixed(2) || "-"}s
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Total Tokens</td>
                            {MODELS.map(model => (
                              <td key={model} className="p-2">
                                {results[model]?.metrics?.tokenCount || "-"}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Cost</td>
                            {MODELS.map(model => (
                              <td key={model} className="p-2">
                                ${results[model]?.metrics?.cost.toFixed(6) || "-"}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Run the experiment to see comparison data</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 
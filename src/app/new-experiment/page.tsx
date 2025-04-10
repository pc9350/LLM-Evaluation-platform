"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ExperimentResult, useExperimentStore, SavedExperiment } from '@/store/experimentStore';
import { Loader2, Save, Share, BarChart, Trophy, Zap, Swords, Medal, Star, Award, Hash } from "lucide-react";
import Link from 'next/link';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useSearchParams } from 'next/navigation';
import { ResultsContainer } from "@/components/Results";

const MODELS = ["gpt-4", "llama-3.3-70b", "gemma2-9b"];

// Function to format code blocks in responses
const formatResponseWithCodeBlocks = (text: string) => {
  if (!text) return "";
  
  // Replace markdown code blocks with HTML pre and code tags
  const formattedText = text.replace(
    /```(\w*)\n([\s\S]*?)```/g, 
    '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto my-2"><code class="text-sm font-mono">$2</code></pre>'
  );
  
  // Replace inline code with HTML code tags
  return formattedText.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
  );
};

// Client component that uses useSearchParams
function ExperimentPageContent() {
  const searchParams = useSearchParams();
  const experimentId = searchParams.get('id');

  const [prompt, setPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [useSystemPrompt, setUseSystemPrompt] = useState(false);
  const [experimentName, setExperimentName] = useState("");
  const [battleMode, setBattleMode] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const { 
    results, 
    setResults, 
    userXp, 
    userLevel, 
    addXp, 
    incrementExperimentCount, 
    updateAchievement,
    saveExperiment,
    achievements,
    savedExperiments,
    experimentCount
  } = useExperimentStore();

  // Load experiment from ID if provided
  useEffect(() => {
    if (experimentId) {
      const experiment = savedExperiments.find(exp => exp.id === experimentId);
      if (experiment) {
        setPrompt(experiment.prompt);
        setSystemPrompt(experiment.systemPrompt);
        setTemperature(experiment.temperature);
        setMaxTokens(experiment.maxTokens);
        setUseSystemPrompt(!!experiment.systemPrompt);
        setExperimentName(experiment.name);
        setResults(experiment.results);
        
        toast({
          title: "Experiment Loaded",
          description: `"${experiment.name}" has been loaded successfully.`,
        });
      }
    }
  }, [experimentId, savedExperiments, setResults]);

  // Handle save experiment
  const handleSaveExperiment = () => {
    if (!experimentName.trim()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your experiment before saving.",
        variant: "destructive",
      });
      return;
    }

    // Create experiment data to save
    const experimentData: SavedExperiment = {
      id: Date.now().toString(),
      name: experimentName,
      prompt,
      systemPrompt: useSystemPrompt ? systemPrompt : "",
      temperature,
      maxTokens,
      results,
      timestamp: new Date().toISOString(),
    };

    // Save to our store
    saveExperiment(experimentData);
    
    toast({
      title: "Experiment Saved",
      description: `"${experimentName}" has been saved successfully to your browser's local storage.`,
    });
  };

  // Handle share experiment
  const handleShareExperiment = async () => {
    if (Object.keys(results).length === 0) {
      toast({
        title: "No Results",
        description: "Please run the experiment before sharing.",
        variant: "destructive",
      });
      return;
    }

    // Create shareable text
    const shareText = `
Check out my LLM experiment results:
Experiment: ${experimentName || "Untitled"}
Models tested: ${Object.keys(results).join(", ")}
Prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"
Results:
${Object.entries(results)
  .map(([model, data]) => 
    `- ${model}: ${data.responseTime.toFixed(2)}s, ${data.metrics.tokenCount} tokens, $${data.metrics.cost.toFixed(6)}`
  )
  .join('\n')}
`;

    try {
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `LLM Experiment: ${experimentName || "Untitled"}`,
          text: shareText,
        });
        
        toast({
          title: "Shared Successfully",
          description: "Your experiment has been shared.",
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        
        toast({
          title: "Copied to Clipboard",
          description: "Share text copied to clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Share Failed",
        description: "Could not share the experiment.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResults({});  // Clear previous results
    setShowWinner(false);
  
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
              quality: data.metrics?.quality || 0,
              readability: data.metrics?.readability || 0,
              coherence: data.metrics?.coherence || 0,
              vocabulary: data.metrics?.vocabulary || 0
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
              quality: 0,
              readability: 0,
              coherence: 0,
              vocabulary: 0
            },
            error: error instanceof Error ? error.message : "Failed to get response"
          },
        }));
      }
    });
  
    await Promise.all(requests);
    setIsLoading(false);
    
    // Increment experiment count
    incrementExperimentCount();
    
    // Add XP for completing an experiment
    addXp(25);
    
    // Update achievements
    // Only update first-experiment if this is actually the first experiment
    const firstExperiment = experimentCount === 0 ? updateAchievement('first-experiment', 1) : null;
    const modelMaster = updateAchievement('model-master', 1);
    
    // Check for speed demon achievement
    const fastestTime = Math.min(...Object.values(results).map(r => r.responseTime || Infinity));
    if (fastestTime < 2) {
      updateAchievement('speed-demon', 1);
    }
    
    // Check for token master achievement
    const totalTokens = Object.values(results).reduce((sum, r) => sum + (r.metrics?.tokenCount || 0), 0);
    updateAchievement('token-master', totalTokens);
    
    // Show achievement toast if any were unlocked
    if ((firstExperiment && firstExperiment.unlocked) || (modelMaster && modelMaster.unlocked)) {
      const unlockedAchievement = (firstExperiment && firstExperiment.unlocked) ? firstExperiment : modelMaster;
      
      toast({
        title: "Achievement Unlocked!",
        description: unlockedAchievement?.name,
        action: <ToastAction altText="View">View</ToastAction>,
      });
    }
    
    // Show winner in battle mode
    if (battleMode && Object.keys(results).length === MODELS.length) {
      setShowWinner(true);
    }
  };

  // Determine winner based on response time (could be any metric)
  const determineWinner = () => {
    if (Object.keys(results).length < MODELS.length) return null;
    
    let winner = '';
    let bestTime = Infinity;
    
    Object.entries(results).forEach(([model, data]) => {
      if (data.responseTime < bestTime) {
        bestTime = data.responseTime;
        winner = model;
      }
    });
    
    return winner;
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
          <Button variant="outline" className="gap-2" onClick={handleSaveExperiment}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleShareExperiment}>
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
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="battle-mode-toggle" 
                  checked={battleMode}
                  onCheckedChange={setBattleMode}
                />
                <div>
                  <Label htmlFor="battle-mode-toggle" className="flex items-center gap-2">
                    <Swords className="h-4 w-4 text-red-500" />
                    Battle Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">Models compete for the best performance</p>
                </div>
              </div>
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
                ) : battleMode ? (
                  <>
                    <Swords className="mr-2 h-4 w-4" />
                    Start Battle
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
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Achievements
              </CardTitle>
              <CardDescription>Your progress and unlocked achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-2">
                    {achievement.unlocked ? 
                      (achievement.icon === 'Medal' ? <Medal className="h-5 w-5 text-yellow-500" /> :
                       achievement.icon === 'Star' ? <Star className="h-5 w-5 text-yellow-500" /> :
                       achievement.icon === 'Award' ? <Award className="h-5 w-5 text-yellow-500" /> :
                       achievement.icon === 'Zap' ? <Zap className="h-5 w-5 text-yellow-500" /> :
                       achievement.icon === 'Hash' ? <Hash className="h-5 w-5 text-yellow-500" /> :
                       <Trophy className="h-5 w-5 text-yellow-500" />)
                    : 
                      (achievement.icon === 'Medal' ? <Medal className="h-5 w-5 text-gray-300" /> :
                       achievement.icon === 'Star' ? <Star className="h-5 w-5 text-gray-300" /> :
                       achievement.icon === 'Award' ? <Award className="h-5 w-5 text-gray-300" /> :
                       achievement.icon === 'Zap' ? <Zap className="h-5 w-5 text-gray-300" /> :
                       achievement.icon === 'Hash' ? <Hash className="h-5 w-5 text-gray-300" /> :
                       <Trophy className="h-5 w-5 text-gray-300" />)
                    }
                    <div>
                      <p className={`font-medium ${achievement.unlocked ? '' : 'text-muted-foreground'}`}>
                        {achievement.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description} ({achievement.progress}/{achievement.target})
                      </p>
                    </div>
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
          
          {battleMode && showWinner && Object.keys(results).length === MODELS.length && (
            <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 animate-pulse">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center text-center">
                  <Trophy className="h-12 w-12 text-yellow-500 mb-2" />
                  <h3 className="text-xl font-bold mb-1">Battle Winner: {determineWinner()}</h3>
                  <p className="text-sm text-muted-foreground">
                    Fastest response time: {results[determineWinner() || '']?.responseTime.toFixed(2)}s
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      Speed Champion
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      +15 XP
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Tabs defaultValue="results" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>
            <TabsContent value="results" className="space-y-4 mt-4">
              {Object.keys(results).length > 0 ? (
                <ResultsContainer modelResults={Object.keys(results).map(model => ({
                  modelName: model,
                  response: results[model].response,
                  responseTime: results[model].responseTime,
                  metrics: {
                    tokenCount: results[model].metrics?.tokenCount || 0,
                    promptTokens: results[model].metrics?.promptTokens || 0,
                    completionTokens: results[model].metrics?.completionTokens || 0,
                    cost: results[model].metrics?.cost || 0,
                    quality: results[model].metrics?.quality || 0,
                    readability: results[model].metrics?.readability || 0,
                    coherence: results[model].metrics?.coherence || 0,
                    vocabulary: results[model].metrics?.vocabulary || 0
                  }
                }))} />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <p>{battleMode ? "Battle in progress..." : "Running experiment across all models..."}</p>
                    </div>
                  ) : (
                    <p>{battleMode ? "Enter a prompt and start the battle!" : "Enter a prompt and run the experiment to see results"}</p>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="comparison" className="mt-4">
              {Object.keys(results).length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{battleMode ? "Battle Results" : "Model Comparison"}</CardTitle>
                    <CardDescription>Side-by-side comparison of model performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Metric</th>
                            {MODELS.map(model => (
                              <th key={model} className="text-left p-2">
                                <div className="flex items-center gap-1">
                                  {model}
                                  {battleMode && determineWinner() === model && (
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                  )}
                                </div>
                              </th>
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
                          {battleMode && (
                            <tr className="border-b">
                              <td className="p-2 font-medium">Battle Points</td>
                              {MODELS.map(model => {
                                const points = determineWinner() === model ? 10 : 
                                  (model === "gpt-4" ? 7 : model === "llama-3.3-70b" ? 5 : 3);
                                return (
                                  <td key={model} className="p-2 font-bold">
                                    {points} pts
                                  </td>
                                );
                              })}
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>{battleMode ? "Start the battle to see comparison data" : "Run the experiment to see comparison data"}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function ExperimentPageLoading() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-xl font-medium">Loading experiment...</p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function NewExperimentPage() {
  return (
    <Suspense fallback={<ExperimentPageLoading />}>
      <ExperimentPageContent />
    </Suspense>
  );
} 
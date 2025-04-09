"use client";

import { useExperimentStore } from "@/store/experimentStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import Link from "next/link";
import { ArrowLeft, BarChart2, Clock, DollarSign, Zap, Trophy, Medal, Star, Award, Hash, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const MODELS = ["gpt-4", "llama-3.3-70b", "gemma2-9b"];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function Dashboard() {
  const { 
    results, 
    savedExperiments, 
    achievements, 
    userXp, 
    userLevel, 
    experimentCount,
    deleteSavedExperiment 
  } = useExperimentStore();

  const prepareChartData = () => {
    return MODELS.map((model) => ({
      name: model,
      responseTime: results[model]?.responseTime || 0,
      tokenCount: results[model]?.metrics?.tokenCount || 0,
      promptTokens: results[model]?.metrics?.promptTokens || 0,
      completionTokens: results[model]?.metrics?.completionTokens || 0,
      cost: results[model]?.metrics?.cost || 0,
    }));
  };

  const prepareTokenDistributionData = () => {
    const totalTokens = MODELS.reduce(
      (acc, model) => acc + (results[model]?.metrics?.tokenCount || 0),
      0
    );
    
    return MODELS.map((model, index) => ({
      name: model,
      value: results[model]?.metrics?.tokenCount || 0,
      percentage: totalTokens > 0 
        ? ((results[model]?.metrics?.tokenCount || 0) / totalTokens * 100).toFixed(1) 
        : 0,
      color: COLORS[index],
    }));
  };

  const prepareCostComparisonData = () => {
    const totalCost = MODELS.reduce(
      (acc, model) => acc + (results[model]?.metrics?.cost || 0),
      0
    );
    
    return MODELS.map((model, index) => ({
      name: model,
      value: results[model]?.metrics?.cost || 0,
      percentage: totalCost > 0 
        ? ((results[model]?.metrics?.cost || 0) / totalCost * 100).toFixed(1) 
        : 0,
      color: COLORS[index],
    }));
  };

  const prepareModelPerformanceData = () => {
    return [
      {
        metric: "Response Speed",
        gpt4: 3,
        llama3370b: 5,
        gemma29b: 4,
      },
      {
        metric: "Token Efficiency",
        gpt4: 4,
        llama3370b: 3,
        gemma29b: 5,
      },
      {
        metric: "Cost Efficiency",
        gpt4: 2,
        llama3370b: 5,
        gemma29b: 5,
      },
      {
        metric: "Output Quality",
        gpt4: 5,
        llama3370b: 4,
        gemma29b: 3.5,
      },
      {
        metric: "Reasoning",
        gpt4: 5,
        llama3370b: 4,
        gemma29b: 3.5,
      },
    ];
  };

  const calculateTotalMetrics = () => {
    const totalResponseTime = MODELS.reduce(
      (acc, model) => acc + (results[model]?.responseTime || 0),
      0
    );
    
    const totalTokens = MODELS.reduce(
      (acc, model) => acc + (results[model]?.metrics?.tokenCount || 0),
      0
    );
    
    const totalCost = MODELS.reduce(
      (acc, model) => acc + (results[model]?.metrics?.cost || 0),
      0
    );
    
    const fastestModel = MODELS.reduce(
      (fastest, model) => {
        if (!results[model]) return fastest;
        if (!fastest.time || results[model].responseTime < fastest.time) {
          return { model, time: results[model].responseTime };
        }
        return fastest;
      },
      { model: '', time: 0 }
    );
    
    const cheapestModel = MODELS.reduce(
      (cheapest, model) => {
        if (!results[model]) return cheapest;
        if (!cheapest.cost || results[model].metrics?.cost < cheapest.cost) {
          return { model, cost: results[model].metrics?.cost };
        }
        return cheapest;
      },
      { model: '', cost: 0 }
    );
    
    return {
      totalResponseTime: totalResponseTime.toFixed(2),
      totalTokens,
      totalCost: totalCost.toFixed(6),
      fastestModel: fastestModel.model,
      fastestTime: fastestModel.time ? fastestModel.time.toFixed(2) : 0,
      cheapestModel: cheapestModel.model,
      cheapestCost: cheapestModel.cost ? cheapestModel.cost.toFixed(6) : 0,
      experimentCount,
    };
  };

  const metrics = calculateTotalMetrics();

  const handleDeleteExperiment = (id: string) => {
    deleteSavedExperiment(id);
    toast({
      title: "Experiment Deleted",
      description: "The experiment has been removed from your saved list.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-muted-foreground">Analyze and compare model performance metrics</p>
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

      {Object.keys(results).length > 0 ? (
        <div className="space-y-8">
          {/* Game-like Stats Banner */}
          <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-background/80 rounded-lg">
                  <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                  <h3 className="text-lg font-bold">Speed Champion</h3>
                  <p className="text-sm text-muted-foreground">{metrics.fastestModel}</p>
                  <p className="text-xs font-medium">{metrics.fastestTime}s</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-background/80 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="text-lg font-bold">Cost Efficient</h3>
                  <p className="text-sm text-muted-foreground">{metrics.cheapestModel}</p>
                  <p className="text-xs font-medium">${metrics.cheapestCost}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-background/80 rounded-lg">
                  <Zap className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="text-lg font-bold">Total Tokens</h3>
                  <p className="text-sm text-muted-foreground">Processed</p>
                  <p className="text-xs font-medium">{metrics.totalTokens}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-background/80 rounded-lg">
                  <Medal className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="text-lg font-bold">Experiments</h3>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-xs font-medium">{metrics.experimentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{metrics.totalResponseTime}s</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Fastest: {metrics.fastestModel} ({metrics.fastestTime}s)
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart2 className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{metrics.totalTokens}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all models
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">${metrics.totalCost}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cheapest: {metrics.cheapestModel} (${metrics.cheapestCost})
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Models Compared</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{Object.keys(results).length}</div>
                </div>
                <div className="flex gap-1 mt-2">
                  {MODELS.map((model) => (
                    results[model] ? (
                      <Badge key={model} variant="outline" className="text-xs">
                        {model}
                      </Badge>
                    ) : null
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="technical" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="technical">Technical Metrics</TabsTrigger>
              <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
              <TabsTrigger value="achievements">Achievements & History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="technical" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Response Time Chart */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                    <CardDescription>Comparison of response times across models</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prepareChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}s`, 'Response Time']} />
                        <Bar 
                          dataKey="responseTime" 
                          fill="#8884d8" 
                          name="Response Time (s)"
                          label={{ position: 'top', formatter: (val: number) => val.toFixed(2) + 's' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Token Usage Chart */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Token Usage</CardTitle>
                    <CardDescription>Breakdown of token usage by model</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prepareChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="promptTokens"
                          stackId="a"
                          fill="#82ca9d"
                          name="Prompt Tokens"
                        />
                        <Bar
                          dataKey="completionTokens"
                          stackId="a"
                          fill="#8884d8"
                          name="Completion Tokens"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Cost Comparison Chart */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Cost Comparison</CardTitle>
                    <CardDescription>Cost analysis across different models</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prepareChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                        <Legend />
                        <Bar dataKey="cost" fill="#ffc658" name="Cost ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Token Distribution Pie Chart */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Token Distribution</CardTitle>
                    <CardDescription>Percentage of tokens used by each model</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareTokenDistributionData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareTokenDistributionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Tokens']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Cost Distribution Pie Chart */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Cost Distribution</CardTitle>
                    <CardDescription>Percentage of total cost by model</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareCostComparisonData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareCostComparisonData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Response Time Trend */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Response Time Trend</CardTitle>
                    <CardDescription>Historical response times (simulated)</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { name: 'Run 1', gpt4: 2.1, llama3370b: 0.8, gemma29b: 1.2 },
                          { name: 'Run 2', gpt4: 2.3, llama3370b: 0.9, gemma29b: 1.1 },
                          { name: 'Run 3', gpt4: 2.0, llama3370b: 0.7, gemma29b: 1.0 },
                          { name: 'Run 4', gpt4: 2.2, llama3370b: 0.8, gemma29b: 1.3 },
                          { name: 'Current', 
                            gpt4: results['gpt-4']?.responseTime || 0, 
                            llama3370b: results['llama-3.3-70b']?.responseTime || 0, 
                            gemma29b: results['gemma2-9b']?.responseTime || 0 
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}s`, 'Response Time']} />
                        <Legend />
                        <Line type="monotone" dataKey="gpt4" stroke="#8884d8" name="GPT-4" />
                        <Line type="monotone" dataKey="llama3370b" stroke="#82ca9d" name="Llama 3.3 70B" />
                        <Line type="monotone" dataKey="gemma29b" stroke="#ffc658" name="Gemma 2 9B" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Model Performance Radar Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Model Performance Comparison</CardTitle>
                      <CardDescription>
                        Relative performance across different metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            data={prepareModelPerformanceData()}
                          >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="metric" />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} />
                            <Radar
                              name="GPT-4"
                              dataKey="gpt4"
                              stroke="#3b82f6"
                              fill="#3b82f6"
                              fillOpacity={0.2}
                            />
                            <Radar
                              name="Llama 3.3 70B"
                              dataKey="llama3370b"
                              stroke="#10b981"
                              fill="#10b981"
                              fillOpacity={0.2}
                            />
                            <Radar
                              name="Gemma 2 9B"
                              dataKey="gemma29b"
                              stroke="#8b5cf6"
                              fill="#8b5cf6"
                              fillOpacity={0.2}
                            />
                            <Legend />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Leaderboard */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Model Leaderboard
                      </CardTitle>
                      <CardDescription>
                        Performance ranking based on recent experiments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {MODELS.map((model, index) => {
                          // Calculate score based on metrics
                          const responseTime = results[model]?.responseTime || 0;
                          const tokenCount = results[model]?.metrics?.tokenCount || 0;
                          const cost = results[model]?.metrics?.cost || 0;
                          
                          // Simple scoring formula - lower is better for time and cost, higher is better for tokens
                          const timeScore = responseTime ? (5 - Math.min(responseTime / 2, 4)) : 0;
                          const tokenScore = tokenCount ? Math.min(tokenCount / 200, 5) : 0;
                          const costScore = cost ? (5 - Math.min(cost * 1000, 4)) : 0;
                          
                          const totalScore = timeScore + tokenScore + costScore;
                          
                          return (
                            <div 
                              key={model} 
                              className={`flex items-center p-4 rounded-lg ${
                                index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : 
                                index === 1 ? 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700' : 
                                index === 2 ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : ''
                              }`}
                            >
                              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 mr-4">
                                {index === 0 ? (
                                  <Trophy className="h-4 w-4 text-yellow-500" />
                                ) : index === 1 ? (
                                  <span className="text-sm font-bold">2</span>
                                ) : (
                                  <span className="text-sm font-bold">3</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{model}</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>Time: {results[model]?.responseTime.toFixed(2) || '-'}s</span>
                                  <span>•</span>
                                  <span>Tokens: {results[model]?.metrics?.tokenCount || '-'}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold">{totalScore.toFixed(1)}</div>
                                <div className="text-xs text-muted-foreground">points</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                  <CardDescription>Key observations from the experiment results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <h3 className="font-semibold text-blue-700 dark:text-blue-300">Response Time Analysis</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        {metrics.fastestModel ? `${metrics.fastestModel} was the fastest model, responding in ${metrics.fastestTime}s.` : 'No response time data available.'}
                        {' '}Response times can vary based on model complexity and server load.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                      <h3 className="font-semibold text-green-700 dark:text-green-300">Token Efficiency</h3>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        A total of {metrics.totalTokens} tokens were used across all models.
                        {' '}Efficient token usage can significantly impact both cost and performance.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                      <h3 className="font-semibold text-yellow-700 dark:text-yellow-300">Cost Optimization</h3>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                        {metrics.cheapestModel ? `${metrics.cheapestModel} was the most cost-effective model at $${metrics.cheapestCost}.` : 'No cost data available.'}
                        {' '}Consider the balance between cost and performance for your specific use case.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                      <h3 className="font-semibold text-purple-700 dark:text-purple-300">Recommendation</h3>
                      <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                        Based on this experiment, the optimal model choice depends on your priorities:
                        {' '}GPT-4 for quality, Llama 3.3 70B for speed, or Gemma 2 9B for a balance of cost and performance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Achievements Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Your Achievements
                    </CardTitle>
                    <CardDescription>
                      Track your progress and unlock new achievements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {achievements.map((achievement) => (
                        <div 
                          key={achievement.id} 
                          className={`flex items-center p-3 rounded-lg ${
                            achievement.unlocked 
                              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                              : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          {achievement.unlocked ? 
                            (achievement.icon === 'Medal' ? <Medal className="h-5 w-5 text-yellow-500 mr-3" /> :
                             achievement.icon === 'Star' ? <Star className="h-5 w-5 text-yellow-500 mr-3" /> :
                             achievement.icon === 'Award' ? <Award className="h-5 w-5 text-yellow-500 mr-3" /> :
                             achievement.icon === 'Zap' ? <Zap className="h-5 w-5 text-yellow-500 mr-3" /> :
                             achievement.icon === 'Hash' ? <Hash className="h-5 w-5 text-yellow-500 mr-3" /> :
                             <Trophy className="h-5 w-5 text-yellow-500 mr-3" />)
                          : 
                            (achievement.icon === 'Medal' ? <Medal className="h-5 w-5 text-gray-300 mr-3" /> :
                             achievement.icon === 'Star' ? <Star className="h-5 w-5 text-gray-300 mr-3" /> :
                             achievement.icon === 'Award' ? <Award className="h-5 w-5 text-gray-300 mr-3" /> :
                             achievement.icon === 'Zap' ? <Zap className="h-5 w-5 text-gray-300 mr-3" /> :
                             achievement.icon === 'Hash' ? <Hash className="h-5 w-5 text-gray-300 mr-3" /> :
                             <Trophy className="h-5 w-5 text-gray-300 mr-3" />)
                          }
                          <div className="flex-1">
                            <h4 className="font-medium">{achievement.name}</h4>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {achievement.progress}/{achievement.target}
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.target) * 100} 
                              max={100} 
                              className="h-2 w-20"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Saved Experiments Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Experiments</CardTitle>
                    <CardDescription>Your previously saved experiments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedExperiments.length > 0 ? (
                      <div className="space-y-4">
                        {savedExperiments.map((experiment) => (
                          <div key={experiment.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{experiment.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(experiment.timestamp), 'MMM d, yyyy h:mm a')}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {Object.keys(experiment.results).map((model) => (
                                  <Badge key={model} variant="outline" className="text-xs">
                                    {model}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/new-experiment?id=${experiment.id}`}>
                                <Button variant="outline" size="sm">Load</Button>
                              </Link>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteExperiment(experiment.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No saved experiments yet.</p>
                        <p className="text-sm mt-1">Run and save experiments to see them here.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* XP Progress Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Level up by running more experiments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        Level {userLevel}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {userXp} XP total • {100 - (userXp % 100)} XP until next level
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Experiments Run</p>
                      <p className="text-2xl font-bold">{experimentCount}</p>
                    </div>
                  </div>
                  <Progress value={(userXp % 100)} max={100} className="h-3" />
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium">How to earn XP</h4>
                      <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                        <li>• Run experiments (+25 XP)</li>
                        <li>• Unlock achievements (+50 XP)</li>
                        <li>• Save experiments (+10 XP)</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-medium">Level Benefits</h4>
                      <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                        <li>• Level 2: Battle Mode</li>
                        <li>• Level 3: Advanced Metrics</li>
                        <li>• Level 5: Custom Models</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-medium">Next Goals</h4>
                      <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                        {achievements
                          .filter(a => !a.unlocked)
                          .slice(0, 3)
                          .map(a => (
                            <li key={a.id}>• {a.name} ({a.progress}/{a.target})</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">No experiment data available.</p>
          <p className="mt-2">Run some experiments to see the results here!</p>
          <div className="mt-6">
            <Link href="/new-experiment">
              <div className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Start a New Experiment
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
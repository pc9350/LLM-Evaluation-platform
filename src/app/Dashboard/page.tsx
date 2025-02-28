"use client";

import { useExperimentStore } from "@/store/experimentStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, BarChart2, Clock, DollarSign, Zap } from "lucide-react";

const MODELS = ["gpt-4", "llama-70b", "mixtral"];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function Dashboard() {
  const { results } = useExperimentStore();

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
    // This would ideally come from actual metrics, but for now we'll use mock data
    return [
      { subject: 'Response Time', gpt4: 3, llama70b: 5, mixtral: 4 },
      { subject: 'Token Efficiency', gpt4: 4, llama70b: 3, mixtral: 5 },
      { subject: 'Cost Efficiency', gpt4: 2, llama70b: 5, mixtral: 5 },
      { subject: 'Response Quality', gpt4: 5, llama70b: 4, mixtral: 3 },
      { subject: 'Accuracy', gpt4: 5, llama70b: 4, mixtral: 3 },
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
    };
  };

  const metrics = calculateTotalMetrics();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-muted-foreground">Analyze and compare model performance metrics</p>
        </div>
        <Link href="/experiments">
          <div className="flex items-center text-blue-600 hover:text-blue-800 gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Experiments</span>
          </div>
        </Link>
      </div>

      {Object.keys(results).length > 0 ? (
        <div className="space-y-8">
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
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="technical">Technical Metrics</TabsTrigger>
              <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
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
                        <Legend />
                        <Bar
                          dataKey="responseTime"
                          fill="#8884d8"
                          name="Response Time (s)"
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
                          { name: 'Run 1', gpt4: 2.1, llama70b: 0.8, mixtral: 1.2 },
                          { name: 'Run 2', gpt4: 2.3, llama70b: 0.9, mixtral: 1.1 },
                          { name: 'Run 3', gpt4: 2.0, llama70b: 0.7, mixtral: 1.0 },
                          { name: 'Run 4', gpt4: 2.2, llama70b: 0.8, mixtral: 1.3 },
                          { name: 'Current', 
                            gpt4: results['gpt-4']?.responseTime || 0, 
                            llama70b: results['llama-70b']?.responseTime || 0, 
                            mixtral: results['mixtral']?.responseTime || 0 
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}s`, 'Response Time']} />
                        <Legend />
                        <Line type="monotone" dataKey="gpt4" stroke="#8884d8" name="GPT-4" />
                        <Line type="monotone" dataKey="llama70b" stroke="#82ca9d" name="Llama 70B" />
                        <Line type="monotone" dataKey="mixtral" stroke="#ffc658" name="Mixtral" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Model Performance Radar Chart */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Model Performance Radar</CardTitle>
                    <CardDescription>Comparative analysis across key metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={150} data={prepareModelPerformanceData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} />
                        <Radar name="GPT-4" dataKey="gpt4" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                        <Radar name="Llama 70B" dataKey="llama70b" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
                        <Radar name="Mixtral" dataKey="mixtral" stroke="#ffc658" fill="#ffc658" fillOpacity={0.2} />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
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
                        {' '}GPT-4 for quality, Llama 70B for speed, or Mixtral for a balance of cost and performance.
                      </p>
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
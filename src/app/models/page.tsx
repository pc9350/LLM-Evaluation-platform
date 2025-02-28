"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Zap, Brain, Clock, DollarSign, BarChart2 } from "lucide-react";

const models = [
  {
    id: "gpt-4",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "OpenAI&apos;s most advanced model, with broad general knowledge and domain expertise.",
    strengths: ["Reasoning", "Creative writing", "Code generation", "Multi-modal capabilities"],
    contextWindow: "128,000 tokens",
    costPer1kTokens: "$0.03",
    badge: "Premium",
    badgeColor: "bg-blue-100 text-blue-800",
    icon: Brain,
  },
  {
    id: "llama-70b",
    name: "Llama 3.3 70B",
    provider: "Meta (via Groq)",
    description: "Meta&apos;s largest open model, fine-tuned for instruction following and coding.",
    strengths: ["Fast inference", "Code generation", "Instruction following", "Cost-effective"],
    contextWindow: "32,768 tokens",
    costPer1kTokens: "$0.0001",
    badge: "Fast",
    badgeColor: "bg-green-100 text-green-800",
    icon: Zap,
  },
  {
    id: "mixtral",
    name: "Mixtral 8x7B",
    provider: "Mistral AI (via Groq)",
    description: "A mixture-of-experts model with strong performance across various tasks.",
    strengths: ["Balanced performance", "Multilingual", "Efficient architecture", "Cost-effective"],
    contextWindow: "32,768 tokens",
    costPer1kTokens: "$0.0001",
    badge: "Balanced",
    badgeColor: "bg-purple-100 text-purple-800",
    icon: BarChart2,
  },
];

const modelComparisons = [
  { metric: "Reasoning", gpt4: 5, llama70b: 4, mixtral: 3.5 },
  { metric: "Creative Writing", gpt4: 5, llama70b: 4, mixtral: 3.5 },
  { metric: "Code Generation", gpt4: 5, llama70b: 4.5, mixtral: 3.5 },
  { metric: "Response Speed", gpt4: 3, llama70b: 5, mixtral: 4.5 },
  { metric: "Cost Efficiency", gpt4: 2, llama70b: 5, mixtral: 5 },
  { metric: "Context Length", gpt4: 5, llama70b: 4, mixtral: 4 },
];

export default function ModelsPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Models</h1>
          <p className="text-muted-foreground">Explore the capabilities of different LLM models</p>
        </div>
        <Link href="/new-experiment">
          <Button className="gap-2">
            New Experiment
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="models">Available Models</TabsTrigger>
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <Card key={model.id} className="overflow-hidden border-t-4" style={{ borderTopColor: model.badgeColor.split(' ')[1].replace('text-', '') }}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{model.name}</CardTitle>
                      <CardDescription>{model.provider}</CardDescription>
                    </div>
                    <Badge className={model.badgeColor}>{model.badge}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                      {model.strengths.map((strength) => (
                        <Badge key={strength} variant="outline">{strength}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">Context Window</p>
                        <p className="text-muted-foreground">{model.contextWindow}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">Cost</p>
                        <p className="text-muted-foreground">{model.costPer1kTokens}/1K tokens</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/new-experiment?model=${model.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Test this model
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Model Comparison</CardTitle>
              <CardDescription>
                Relative performance across different metrics (5 = best)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Metric</th>
                      <th className="text-left p-2">GPT-4o</th>
                      <th className="text-left p-2">Llama 3.3 70B</th>
                      <th className="text-left p-2">Mixtral 8x7B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelComparisons.map((comparison) => (
                      <tr key={comparison.metric} className="border-b">
                        <td className="p-2 font-medium">{comparison.metric}</td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${(comparison.gpt4 / 5) * 100}%` }}
                              ></div>
                            </div>
                            {comparison.gpt4}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: `${(comparison.llama70b / 5) * 100}%` }}
                              ></div>
                            </div>
                            {comparison.llama70b}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-purple-600 h-2.5 rounded-full" 
                                style={{ width: `${(comparison.mixtral / 5) * 100}%` }}
                              ></div>
                            </div>
                            {comparison.mixtral}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
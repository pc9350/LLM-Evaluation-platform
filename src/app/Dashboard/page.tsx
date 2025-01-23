"use client";

import { useExperimentStore } from "@/store/experimentStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

const MODELS = ["gpt-4", "llama-70b", "mixtral"];

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

      //   relevancy: results[model]?.metrics?.relevancy || 0,
      //   accuracy: results[model]?.metrics?.accuracy || 0,
      //   consistency: results[model]?.metrics?.consistency || 0,
      //   responseQuality: results[model]?.metrics?.responseQuality || 0,
    }));
  };

  //   const prepareQualityMetricsData = () => {
  //     return MODELS.map(model => ({
  //       subject: model,
  //       relevancy: results[model]?.metrics?.relevancy || 0,
  //       accuracy: results[model]?.metrics?.accuracy || 0,
  //       consistency: results[model]?.metrics?.consistency || 0,
  //       responseQuality: results[model]?.metrics?.responseQuality || 0,
  //     }));
  //   };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Performance Dashboard</h1>
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          ← Back to Experiments
        </Link>
      </div>

      {Object.keys(results).length > 0 ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Technical Metrics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Response Time Chart */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Response Time Comparison</CardTitle>
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
                  <CardTitle>Token Usage Breakdown</CardTitle>
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
                        fill="#82ca9d"
                        name="Prompt Tokens"
                      />
                      <Bar
                        dataKey="completionTokens"
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
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cost" fill="#ffc658" name="Cost ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">No experiment data available.</p>
          <p className="mt-2">Run some experiments to see the results here!</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExperimentResult, useExperimentStore } from '@/store/experimentStore';
import Link from 'next/link';

const MODELS = ["gpt-4", "llama-70b", "mixtral"];

export function ExperimentForm() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
          body: JSON.stringify({ prompt, model }),
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

  // const prepareChartData = () => {
  //   return MODELS.map(model => ({
  //     name: model,
  //     responseTime: results[model]?.responseTime || 0,
  //     tokenCount: results[model]?.metrics?.tokenCount || 0,
  //     promptTokens: results[model]?.metrics?.promptTokens || 0,
  //     completionTokens: results[model]?.metrics?.completionTokens || 0,
  //     cost: results[model]?.metrics?.cost || 0,
  //   }));
  // };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-4">
        <Link 
          href="/Dashboard" 
          className="text-blue-500 hover:text-blue-700"
        >
          View Dashboard →
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Test Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Testing..." : "Test LLMs"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {MODELS.map((model) => (
          <Card key={model}>
            <CardHeader>
              <CardTitle>{model}</CardTitle>
            </CardHeader>
            <CardContent>
              {results[model] ? (
                <>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Response:</h3>
                    <p className="text-sm">{results[model].response}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <p className="font-semibold">Response Time</p>
                      <p>{results[model].responseTime.toFixed(2)}s</p>
                    </div>
                    <div>
                      <p className="font-semibold">Total Tokens</p>
                      <p>{results[model].metrics?.tokenCount || 0}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Prompt Tokens</p>
                      <p>{results[model].metrics?.promptTokens || 0}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Completion Tokens</p>
                      <p>{results[model].metrics?.completionTokens || 0}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Cost</p>
                      <p>${results[model].metrics?.cost || 0}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">
                  {isLoading ? "Waiting for response..." : "No result yet"}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

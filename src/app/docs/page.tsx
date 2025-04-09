"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowRight, BookOpen, Code, Lightbulb, Settings, Terminal } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Documentation</h1>
          <p className="text-muted-foreground">Learn how to use the LLM Evaluation Platform</p>
        </div>
        <Link href="/new-experiment">
          <div className="flex items-center text-blue-600 hover:text-blue-800 gap-1">
            <span>Try it now</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-1">
                <a href="#getting-started" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Getting Started</a>
                <a href="#running-experiments" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Running Experiments</a>
                <a href="#analyzing-results" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Analyzing Results</a>
                <a href="#models" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Supported Models</a>
                <a href="#metrics" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Evaluation Metrics</a>
                <a href="#api" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">API Reference</a>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-10">
          <section id="getting-started" className="scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Getting Started</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  The LLM Evaluation Platform allows you to test and compare different Large Language Models (LLMs) in real-time. 
                  This helps you make data-driven decisions about which model best suits your specific needs.
                </p>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Key Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Test prompts across multiple LLM models simultaneously</li>
                  <li>Compare response quality, speed, and cost</li>
                  <li>Analyze detailed performance metrics</li>
                  <li>Visualize results with interactive charts</li>
                  <li>Save and share experiments</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Prerequisites</h3>
                <p>To use the platform, you&apos;ll need:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>API keys for the models you want to test (OpenAI, Groq, etc.)</li>
                  <li>Basic understanding of prompt engineering</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="running-experiments" className="scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Running Experiments</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Running an experiment is simple. Follow these steps to test your prompts across multiple models:
                </p>
                
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    <strong>Navigate to the New Experiment page</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click on &quot;New Experiment&quot; in the navigation bar or go to /new-experiment.
                    </p>
                  </li>
                  <li>
                    <strong>Configure your experiment settings</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Set parameters like temperature, max tokens, and optionally add a system prompt.
                    </p>
                  </li>
                  <li>
                    <strong>Enter your prompt</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Type or paste the prompt you want to test in the prompt field.
                    </p>
                  </li>
                  <li>
                    <strong>Run the experiment</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click &quot;Run Experiment&quot; to send your prompt to all selected models.
                    </p>
                  </li>
                  <li>
                    <strong>View the results</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      Results will appear in real-time as each model responds.
                    </p>
                  </li>
                </ol>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-6">
                  <h4 className="flex items-center text-md font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Pro Tip
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    For the most accurate comparisons, try to keep your prompts consistent across experiments. 
                    Small changes in wording can significantly impact model responses.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="analyzing-results" className="scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Analyzing Results</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  After running an experiment, you can analyze the results in several ways:
                </p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">Results Tab</h3>
                <p className="mb-4">
                  The Results tab shows each model&apos;s response along with key metrics:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Response Time:</strong> How long the model took to generate a response</li>
                  <li><strong>Token Usage:</strong> Total tokens, prompt tokens, and completion tokens</li>
                  <li><strong>Cost:</strong> Estimated cost of the API call</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Comparison Tab</h3>
                <p className="mb-4">
                  The Comparison tab provides a side-by-side comparison of all models, making it easy to spot differences in performance.
                </p>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Dashboard</h3>
                <p className="mb-4">
                  For a more visual analysis, visit the Dashboard to see charts and graphs of your experiment results:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Response Time Chart:</strong> Compare how quickly each model responds</li>
                  <li><strong>Token Usage Breakdown:</strong> Visualize token usage across models</li>
                  <li><strong>Cost Comparison:</strong> See which models are most cost-effective</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="models" className="scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Supported Models</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  The platform currently supports the following models:
                </p>
                
                <Tabs defaultValue="gpt-4">
                  <TabsList className="mb-4">
                    <TabsTrigger value="gpt-4">GPT-4</TabsTrigger>
                    <TabsTrigger value="llama-3.3-70b">Llama 3.3 70B</TabsTrigger>
                    <TabsTrigger value="gemma2-9b">Gemma 2 9B</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="gpt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">GPT-4</h3>
                      <p>OpenAI&apos;s most advanced model, with broad general knowledge and domain expertise.</p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="font-medium">Strengths</h4>
                          <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Reasoning</li>
                            <li>Creative writing</li>
                            <li>Code generation</li>
                            <li>Multi-modal capabilities</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium">Specifications</h4>
                          <ul className="mt-2 space-y-1">
                            <li><strong>Context Window:</strong> 128,000 tokens</li>
                            <li><strong>Cost:</strong> $0.03 per 1K tokens</li>
                            <li><strong>Provider:</strong> OpenAI</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="llama-3.3-70b">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Llama 3.3 70B</h3>
                      <p>
                        <strong>Provider:</strong> Meta (via Groq API)
                      </p>
                      <p>
                        <strong>Description:</strong> Meta&apos;s largest and most capable model, fine-tuned for instruction following and coding tasks.
                      </p>
                      <p>
                        <strong>Strengths:</strong> Fast inference, high-quality code generation, instruction following, good multi-turn conversations
                      </p>
                      <p>
                        <strong>Context Window:</strong> 32,768 tokens
                      </p>
                      <p>
                        <strong>Cost:</strong> $0.0001 per 1K tokens
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gemma2-9b">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Gemma 2 9B</h3>
                      <p>
                        <strong>Provider:</strong> Google (via Groq API)
                      </p>
                      <p>
                        <strong>Description:</strong> Google's efficient, instruction-tuned model with balanced performance and speed.
                      </p>
                      <p>
                        <strong>Strengths:</strong> Balanced performance, multilingual, efficient architecture, great value
                      </p>
                      <p>
                        <strong>Context Window:</strong> 32,768 tokens
                      </p>
                      <p>
                        <strong>Cost:</strong> $0.00005 per 1K tokens
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">
                    For more detailed information about each model, visit the <Link href="/models" className="text-blue-600 hover:underline">Models page</Link>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="metrics" className="scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Evaluation Metrics</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  The platform collects and analyzes several metrics to help you evaluate model performance:
                </p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">Technical Metrics</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Response Time:</strong> 
                    <p className="text-sm text-muted-foreground mt-1">
                      The time taken for the model to generate a response, measured in seconds.
                    </p>
                  </li>
                  <li>
                    <strong>Token Count:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      The total number of tokens used in the request and response.
                    </p>
                  </li>
                  <li>
                    <strong>Prompt Tokens:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      The number of tokens in your input prompt.
                    </p>
                  </li>
                  <li>
                    <strong>Completion Tokens:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      The number of tokens in the model&apos;s response.
                    </p>
                  </li>
                  <li>
                    <strong>Cost:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      The estimated cost of the API call, calculated based on token usage and model pricing.
                    </p>
                  </li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Future Metrics</h3>
                <p className="mb-2">
                  We&apos;re working on adding more advanced evaluation metrics, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Relevancy:</strong> 
                    <p className="text-sm text-muted-foreground mt-1">
                      How relevant the response is to the prompt.
                    </p>
                  </li>
                  <li>
                    <strong>Accuracy:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      The factual correctness of the response.
                    </p>
                  </li>
                  <li>
                    <strong>Consistency:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      How consistent the model&apos;s responses are across similar prompts.
                    </p>
                  </li>
                  <li>
                    <strong>Response Quality:</strong>
                    <p className="text-sm text-muted-foreground mt-1">
                      An overall quality score based on multiple factors.
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="api" className="scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">API Reference</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  The platform provides a simple API for running experiments programmatically:
                </p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">Evaluate Endpoint</h3>
                <p className="mb-2"><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /api/evaluate</code></p>
                
                <h4 className="font-medium mt-4 mb-2">Request Body</h4>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
{`{
  "prompt": "Explain quantum computing in simple terms",
  "model": "gpt-4", // or "llama-3.3-70b", "gemma2-9b"
  "temperature": 0.7,
  "max_tokens": 1000
}`}
                </pre>
                
                <h4 className="font-medium mt-4 mb-2">Response</h4>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
{`{
  "modelName": "gpt-4",
  "response": "Model&apos;s response text",
  "responseTime": 1.23,
  "metrics": {
    "tokenCount": 150,
    "promptTokens": 50,
    "completionTokens": 100,
    "cost": 0.0045
  }
}`}
                </pre>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mt-6">
                  <h4 className="flex items-center text-md font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Note
                  </h4>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    API access requires authentication. Contact us for API keys and rate limit information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
} 
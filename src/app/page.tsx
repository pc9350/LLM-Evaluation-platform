import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, Zap, Brain, Code } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          LLM Evaluation Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mb-8">
          Compare and evaluate different Large Language Models in real-time.
          Make data-driven decisions about which AI model best suits your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/new-experiment">
            <Button size="lg" className="gap-2">
              Start New Experiment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/docs">
            <Button size="lg" variant="outline">
              Read Documentation
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
            <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Multi-Model Testing</h3>
          <p className="text-muted-foreground">
            Test your prompts across GPT-4, Llama 3.3 70B, Mixtral, and more in a single experiment.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
          <p className="text-muted-foreground">
            Get immediate side-by-side comparisons of model responses and performance metrics.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
            <BarChart2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
          <p className="text-muted-foreground">
            Visualize performance with interactive charts for response time, token usage, and cost.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
            <Code className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">API Access</h3>
          <p className="text-muted-foreground">
            Integrate with your applications using our simple and powerful API endpoints.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to evaluate LLMs?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          Start testing your prompts across multiple models and discover which one performs best for your specific use case.
        </p>
        <Link href="/new-experiment">
          <Button size="lg" className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
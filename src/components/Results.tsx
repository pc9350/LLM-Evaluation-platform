import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModelResult } from '@/types';
import Markdown from 'react-markdown';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface ResultsProps {
  modelResults: ModelResult[];
}

export function ResultsContainer({ modelResults }: ResultsProps) {
  return (
    <div className="flex flex-col w-full gap-4 mt-4">
      {modelResults.map((result, index) => (
        <Card key={index} className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">
                {result.modelName}
                <Badge variant="outline" className="ml-2">
                  {result.responseTime.toFixed(2)}s
                </Badge>
              </CardTitle>
              <CardDescription>
                {result.metrics.tokenCount} tokens ({result.metrics.promptTokens} prompt, {result.metrics.completionTokens} completion) • ${result.metrics.cost.toFixed(5)}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {/* Quality Metrics Section */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Quality Metrics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <QualityMetric label="Overall Quality" value={result.metrics.quality || 0} />
                <QualityMetric label="Readability" value={result.metrics.readability || 0} />
                <QualityMetric label="Coherence" value={result.metrics.coherence || 0} />
                <QualityMetric label="Vocabulary" value={result.metrics.vocabulary || 0} />
              </div>
            </div>
            <Separator className="my-4" />
            {/* Response Content */}
            <div className="prose prose-sm dark:prose-invert w-full max-w-none overflow-auto">
              <Markdown>{result.response}</Markdown>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function QualityMetric({ label, value }: { label: string; value: number }) {
  // Convert value to percentage for progress bar (0-5 scale to 0-100%)
  const percentage = Math.min(Math.max((value / 5) * 100, 0), 100);
  
  // Determine color based on value
  let colorClass = "text-gray-500";
  if (value >= 4) colorClass = "text-green-500";
  else if (value >= 3) colorClass = "text-blue-500";
  else if (value >= 2) colorClass = "text-yellow-500";
  else colorClass = "text-red-500";
  
  return (
    <div className="flex flex-col w-full overflow-hidden px-1">
      <div className="flex justify-between items-center mb-1 w-full">
        <span className="text-xs font-medium truncate mr-1">{label}</span>
        <span className={`text-xs font-bold whitespace-nowrap ${colorClass}`}>{value.toFixed(1)}/5</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

export default ResultsContainer; 
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Format date in a readable format
function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(date).toLocaleDateString('en-US', options);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    
    // Get the most recent experiments
    const experiments = await prisma.experiment.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { results: true }
    });
    
    // Transform the data for chart consumption
    const formattedData = experiments.map(exp => {
      const dataPoint: any = { 
        name: formatDate(exp.createdAt),
        promptLength: exp.prompt.length
      };
      
      // Add each model's response time
      exp.results.forEach(result => {
        // Create a clean key for the chart
        let modelKey = result.modelName;
        if (modelKey === 'gpt-4') modelKey = 'gpt4';
        else if (modelKey === 'llama-3.3-70b') modelKey = 'llama3370b';
        else if (modelKey === 'gemma2-9b') modelKey = 'gemma29b';
        
        // Assign response time to the model key
        dataPoint[modelKey] = result.responseTime;
      });
      
      return dataPoint;
    });
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch experiment history' }, { status: 500 });
  }
} 
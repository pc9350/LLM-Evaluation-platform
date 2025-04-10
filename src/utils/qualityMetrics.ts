/**
 * Utility functions for calculating text quality metrics
 */

// Calculate readability (Flesch Reading Ease simplified)
export function calculateReadability(text: string): number {
  // Remove markdown code blocks to avoid skewing readability score
  const plainText = text.replace(/```[\s\S]*?```/g, '');
  
  // Count sentences, words, and syllables
  const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = plainText.match(/\b(\w+)\b/g) || [];
  const totalSyllables = countApproximateSyllables(plainText);
  
  if (words.length === 0 || sentences.length === 0) return 0;
  
  // Calculate Flesch Reading Ease score (simplified)
  const ASL = words.length / sentences.length; // Average Sentence Length
  const ASW = totalSyllables / words.length; // Average Syllables per Word
  
  const score = 206.835 - (1.015 * ASL) - (84.6 * ASW);
  
  // Normalize to 0-5 scale
  return Math.min(5, Math.max(0, score / 20));
}

// Calculate coherence (average similarity between adjacent sentences)
export function calculateCoherence(text: string): number {
  const plainText = text.replace(/```[\s\S]*?```/g, '');
  const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length <= 1) return 0;
  
  let totalSimilarity = 0;
  
  for (let i = 0; i < sentences.length - 1; i++) {
    totalSimilarity += calculateJaccardSimilarity(sentences[i], sentences[i+1]);
  }
  
  // Average similarity (0-1) scaled to 0-5
  return (totalSimilarity / (sentences.length - 1)) * 5;
}

// Calculate vocabulary richness (0-5 scale)
export function calculateVocabularyRichness(text: string): number {
  const plainText = text.replace(/```[\s\S]*?```/g, '');
  const words = plainText.toLowerCase().match(/\b(\w+)\b/g) || [];
  
  if (words.length === 0) return 0;
  
  const uniqueWords = new Set(words);
  
  // Type-Token Ratio (TTR) = unique words / total words
  const ttr = uniqueWords.size / words.length;
  
  // Normalize TTR to 0-5 scale (TTR of 0.5 is considered good)
  return Math.min(5, ttr * 10);
}

// Simple implementation to estimate syllables in text
function countApproximateSyllables(text: string): number {
  // Remove non-alphabetic characters and convert to lowercase
  const cleanText = text.toLowerCase().replace(/[^a-z]/g, ' ');
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  
  let syllableCount = 0;
  
  words.forEach(word => {
    // Count vowel groups as syllables
    const vowelGroups = word.match(/[aeiouy]+/g) || [];
    let count = vowelGroups.length;
    
    // Adjust for common patterns
    if (word.endsWith('e') && !word.endsWith('le')) count--;
    if (count === 0) count = 1; // Every word has at least one syllable
    
    syllableCount += count;
  });
  
  return syllableCount;
}

// Calculate Jaccard similarity between two sentences
function calculateJaccardSimilarity(sentence1: string, sentence2: string): number {
  const words1 = new Set(sentence1.toLowerCase().match(/\b(\w+)\b/g) || []);
  const words2 = new Set(sentence2.toLowerCase().match(/\b(\w+)\b/g) || []);
  
  if (words1.size === 0 && words2.size === 0) return 0;
  
  // Calculate intersection and union sizes
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  // Jaccard similarity = intersection size / union size
  return intersection.size / union.size;
}

// Calculate overall quality score from multiple metrics
export function calculateOverallQuality(text: string): { 
  overall: number, 
  readability: number, 
  coherence: number, 
  vocabulary: number 
} {
  const readability = calculateReadability(text);
  const coherence = calculateCoherence(text);
  const vocabulary = calculateVocabularyRichness(text);
  
  // Overall score is weighted average
  const overall = (readability * 0.4) + (coherence * 0.3) + (vocabulary * 0.3);
  
  return {
    overall: Math.min(5, overall),
    readability,
    coherence,
    vocabulary
  };
} 
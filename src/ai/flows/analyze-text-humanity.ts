'use server';

/**
 * @fileOverview Analyzes the 'humanity' of a given text and provides a score.
 *
 * - analyzeTextHumanity - A function that takes text as input and returns a 'humanity' score.
 * - AnalyzeTextHumanityInput - The input type for the analyzeTextHumanity function.
 * - AnalyzeTextHumanityOutput - The return type for the analyzeTextHumanity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTextHumanityInputSchema = z.object({
  text: z.string().describe('The text to analyze for its humanity score.'),
});
export type AnalyzeTextHumanityInput = z.infer<typeof AnalyzeTextHumanityInputSchema>;

const AnalyzeTextHumanityOutputSchema = z.object({
  humanityScore: z
    .number()
    .describe(
      'A score between 0 and 1 (inclusive) representing the degree to which the text sounds human-like.'
    ),
});
export type AnalyzeTextHumanityOutput = z.infer<typeof AnalyzeTextHumanityOutputSchema>;

export async function analyzeTextHumanity(input: AnalyzeTextHumanityInput): Promise<AnalyzeTextHumanityOutput> {
  return analyzeTextHumanityFlow(input);
}

const analyzeTextHumanityFlow = ai.defineFlow(
  {
    name: 'analyzeTextHumanityFlow',
    inputSchema: AnalyzeTextHumanityInputSchema,
    outputSchema: AnalyzeTextHumanityOutputSchema,
  },
  async input => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are an AI text analyst specializing in determining the degree to which a text exhibits human-like characteristics.  Analyze the following text and provide a "humanityScore" between 0 and 1.0, where 0 indicates completely non-human and 1.0 indicates highly human.

Consider aspects such as tone, emotional cues, use of natural language, presence of colloquialisms, and any other features that make text sound human-like.

Text: ${input.text}`,
      output: {
        schema: AnalyzeTextHumanityOutputSchema,
      }
    });

    const output = llmResponse.output;
    if (!output) {
      throw new Error('Failed to get structured output from the model.');
    }
    return output;
  }
);

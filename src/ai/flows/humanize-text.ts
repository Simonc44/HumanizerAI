'use server';

/**
 * @fileOverview Rewrites text to sound more human.
 *
 * - humanizeText - A function that rewrites the given text to sound more human.
 * - HumanizeTextInput - The input type for the humanizeText function.
 * - HumanizeTextOutput - The return type for the humanizeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HumanizeTextInputSchema = z.object({
  text: z.string().describe('The text to humanize.'),
});
export type HumanizeTextInput = z.infer<typeof HumanizeTextInputSchema>;

const HumanizeTextOutputSchema = z.object({
  originalScore: z.number().describe('The original humanity score of the text (0-100).'),
  humanizedText: z.string().describe('The humanized version of the text.'),
  humanizedScore: z.number().describe('The humanity score of the humanized text (0-100).'),
});
export type HumanizeTextOutput = z.infer<typeof HumanizeTextOutputSchema>;

export async function humanizeText(input: HumanizeTextInput): Promise<HumanizeTextOutput> {
  return humanizeTextFlow(input);
}

const analyzeHumanityPrompt = ai.definePrompt({
  name: 'analyzeHumanityPrompt',
  input: {schema: HumanizeTextInputSchema},
  output: {schema: z.object({score: z.number().describe('The humanity score of the text (0-100).')})},
  prompt: `Analyze the following text and provide a humanity score between 0 and 100. Consider factors such as tone, emotional cues, and use of personal language. Just output the score. Do not output any other text.

Text: {{{text}}}`,   
});

const humanizePrompt = ai.definePrompt({
  name: 'humanizePrompt',
  input: {schema: HumanizeTextInputSchema},
  output: {schema: z.object({humanizedText: z.string().describe('The humanized version of the text.')})},
  prompt: `Rewrite the following text to sound more human. Focus on improving its engagement and authenticity.

Text: {{{text}}}`,   
});

const humanizeTextFlow = ai.defineFlow(
  {
    name: 'humanizeTextFlow',
    inputSchema: HumanizeTextInputSchema,
    outputSchema: HumanizeTextOutputSchema,
  },
  async input => {
    const originalAnalysis = await analyzeHumanityPrompt(input);
    const {output: humanizedOutput} = await humanizePrompt(input);
    const humanizedAnalysisInput = {text: humanizedOutput.humanizedText};
    const humanizedAnalysis = await analyzeHumanityPrompt(humanizedAnalysisInput);

    return {
      originalScore: originalAnalysis.output!.score,
      humanizedText: humanizedOutput.humanizedText,
      humanizedScore: humanizedAnalysis.output!.score,
    };
  }
);

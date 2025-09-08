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
import {generate} from 'genkit';
import {stream} from 'genkit';

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
  let humanizedText = '';
  const {stream: humanizedStream, response: humanizedResponse} = await generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: `Rewrite the following text to sound more human. Focus on improving its engagement and authenticity.\n\nText: ${input.text}`,
    stream: true,
  });

  for await (const chunk of humanizedStream) {
    humanizedText += chunk.text;
  }
  await humanizedResponse;

  const [originalAnalysis, humanizedAnalysis] = await Promise.all([
    analyzeHumanityPrompt(input),
    analyzeHumanityPrompt({text: humanizedText}),
  ]);

  return {
    originalScore: originalAnalysis.output!.score,
    humanizedText,
    humanizedScore: humanizedAnalysis.output!.score,
  };
}

export async function streamHumanizedText(
  input: HumanizeTextInput,
  onChunk: (chunk: string) => void
): Promise<HumanizeTextOutput> {
  const originalAnalysis = await analyzeHumanityPrompt(input);

  let humanizedText = '';
  const {stream: humanizedStream, response: humanizedResponse} = await generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: `Rewrite the following text to sound more human. Focus on improving its engagement and authenticity. Your response should be only the rewritten text, without any preamble.\n\nText: ${input.text}`,
    stream: true,
  });

  for await (const chunk of humanizedStream) {
    const textChunk = chunk.text;
    humanizedText += textChunk;
    onChunk(textChunk);
  }
  await humanizedResponse;

  const humanizedAnalysis = await analyzeHumanityPrompt({text: humanizedText});

  return {
    originalScore: originalAnalysis.output!.score,
    humanizedText,
    humanizedScore: humanizedAnalysis.output!.score,
  };
}

const analyzeHumanityPrompt = ai.definePrompt({
  name: 'analyzeHumanityPrompt',
  input: {schema: z.object({text: z.string()})},
  output: {schema: z.object({score: z.number().describe('The humanity score of the text (0-100).')})},
  prompt: `Analyze the following text and provide a humanity score between 0 and 100. Consider factors such as tone, emotional cues, and use of personal language. Just output the score. Do not output any other text.

Text: {{{text}}}`,
});

export const humanizeTextFlow = ai.defineFlow(
  {
    name: 'humanizeTextFlow',
    inputSchema: HumanizeTextInputSchema,
    outputSchema: z.string(),
  },
  async (input, streamingCallback) => {
    const {stream, response} = await generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `Rewrite the following text to sound more human. Focus on improving its engagement and authenticity. Your response should be only the rewritten text, without any preamble.\n\nText: ${input.text}`,
      stream: true,
    });

    let humanizedText = '';
    for await (const chunk of stream) {
      const textChunk = chunk.text;
      if (textChunk) {
        humanizedText += textChunk;
        if (streamingCallback) {
          streamingCallback(textChunk);
        }
      }
    }

    return (await response).output?.text ?? '';
  }
);

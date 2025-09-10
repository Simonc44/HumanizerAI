'use server';

/**
 * @fileOverview Rewrites text to sound more human.
 *
 * - humanizeText - A function that rewrites the given text to sound more human.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { HumanizeTextInputSchema } from './schemas';

export const humanizeText = ai.defineFlow(
  {
    name: 'humanizeText',
    inputSchema: HumanizeTextInputSchema,
    outputSchema: z.string(),
  },
  async ({ text }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `Rewrite the following text to sound more human. Focus on improving its engagement and authenticity. Your response should be only the rewritten text, without any preamble.\n\nText: ${text}`,
    });

    return output ?? '';
  }
);

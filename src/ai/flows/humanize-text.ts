'use server';

/**
 * @fileOverview Rewrites text to sound more human.
 *
 * - humanizeTextFlow - A flow that rewrites the given text to sound more human.
 * - HumanizeTextInput - The input type for the humanizeText flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {generate} from 'genkit';

const HumanizeTextInputSchema = z.object({
  text: z.string().describe('The text to humanize.'),
});
export type HumanizeTextInput = z.infer<typeof HumanizeTextInputSchema>;

export const humanizeTextFlow = ai.defineFlow(
  {
    name: 'humanizeTextFlow',
    inputSchema: HumanizeTextInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const {output} = await generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `Rewrite the following text to sound more human. Focus on improving its engagement and authenticity. Your response should be only the rewritten text, without any preamble.\n\nText: ${input.text}`,
    });

    return output;
  }
);

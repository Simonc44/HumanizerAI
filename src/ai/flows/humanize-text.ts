'use server';

/**
 * @fileOverview Rewrites text to sound more human.
 *
 * - humanizeText - A function that rewrites the given text to sound more human.
 * - HumanizeTextInput - The input type for the humanizeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const HumanizeTextInputSchema = z.object({
  text: z.string().describe('The text to humanize.'),
});
export type HumanizeTextInput = z.infer<typeof HumanizeTextInputSchema>;

const humanizeTextFlow = ai.defineFlow(
  {
    name: 'humanizeTextFlow',
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

export async function humanizeText(input: HumanizeTextInput): Promise<string> {
    return await humanizeTextFlow(input);
}

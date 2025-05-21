'use server';
/**
 * @fileOverview Generates a joke based on a given quote using AI.
 *
 * - generateJoke - A function that generates a joke based on a quote.
 * - GenerateJokeInput - The input type for the generateJoke function.
 * - GenerateJokeOutput - The return type for the generateJoke function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJokeInputSchema = z.object({
  quote: z.string().describe('The quote to generate a joke from.'),
});
export type GenerateJokeInput = z.infer<typeof GenerateJokeInputSchema>;

const GenerateJokeOutputSchema = z.object({
  joke: z.string().describe('The generated joke based on the quote.'),
});
export type GenerateJokeOutput = z.infer<typeof GenerateJokeOutputSchema>;

export async function generateJoke(input: GenerateJokeInput): Promise<GenerateJokeOutput> {
  return generateJokeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJokePrompt',
  input: {schema: GenerateJokeInputSchema},
  output: {schema: GenerateJokeOutputSchema},
  prompt: `You are a comedian specializing in creating jokes based on quotes.

  Generate a joke that is related to the following quote:

  Quote: {{{quote}}}
  `,
});

const generateJokeFlow = ai.defineFlow(
  {
    name: 'generateJokeFlow',
    inputSchema: GenerateJokeInputSchema,
    outputSchema: GenerateJokeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

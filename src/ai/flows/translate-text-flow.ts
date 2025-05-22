'use server';
/**
 * @fileOverview Translates text into a specified target language using AI.
 *
 * - translateText - A function that translates text.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The language to translate the text into (e.g., "Hindi", "Spanish").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `Translate the following text into {{{targetLanguage}}}:

Text: {{{text}}}
`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input): Promise<TranslateTextOutput> => {
    try {
      const result = await prompt(input);

      if (!result || !result.output || typeof result.output.translatedText !== 'string' || result.output.translatedText.trim() === '') {
        console.error('Translation flow: Invalid or missing output from AI model.', { input, output: result?.output });
        throw new Error('Translation failed: AI model did not return valid translated text.');
      }
      
      return result.output;

    } catch (error) {
      console.error(`Error in translateTextFlow for input "${input.text}" to ${input.targetLanguage}:`, error);
      // Re-throw the error to be caught by the calling Server Action/Component context
      // This allows the client-side to also handle it via its own try/catch.
      if (error instanceof Error) {
        // Prepend a more specific message if desired, or just re-throw
        throw new Error(`Translation service failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred in the translation service.');
    }
  }
);

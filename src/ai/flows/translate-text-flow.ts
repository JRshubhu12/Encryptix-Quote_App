
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
        // Log the problematic output structure for server-side debugging
        console.error(
          'TranslateTextFlow: Invalid or missing output from AI model.', 
          { 
            input, 
            outputReceived: result?.output 
          }
        );
        throw new Error('Translation failed: AI model did not return valid translated text.');
      }
      
      return result.output;

    } catch (error) {
      let errorMessageToPropagate = 'An unknown error occurred in the translation service.';
      let errorDetailsForLogging: any = { originalError: String(error) };

      if (error instanceof Error) {
        errorMessageToPropagate = `Translation service failed: ${error.message}`; // This message might be masked on client in prod
        errorDetailsForLogging = {
          name: error.name,
          message: error.message,
          stack: error.stack,
          // Include any other relevant properties if known for specific error types
        };
      }
      
      // Log detailed error information on the server
      console.error(
        `TranslateTextFlow Error: Failed to translate input text "${input.text}" to ${input.targetLanguage}. Details:`, 
        JSON.stringify(errorDetailsForLogging, null, 2) // Stringify for better structured logging
      );
      
      // Re-throw a new error. The message here is what the client-side catch block will primarily see.
      // Next.js might still replace this message with a generic one in production on the client-side,
      // but the server logs will have the details.
      throw new Error(errorMessageToPropagate);
    }
  }
);

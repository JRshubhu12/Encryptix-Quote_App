'use server';
/**
 * @fileOverview Translates text into a specified target language using Google Cloud Translate.
 *
 * - translateText - A function that translates text.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import { z } from 'genkit';
// Import the Google Cloud Translate v2 client
import { Translate } from '@google-cloud/translate').v2;

// Define input and output schemas
const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The language to translate the text into (e.g., "Hindi", "Spanish").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

// Initialize Google Translate instance (ensure GOOGLE_APPLICATION_CREDENTIALS env var is set)
const translate = new Translate();

function languageToCode(language: string): string {
  // Accepts "Hindi" or "hi", "Spanish" or "es", etc.
  const lang = language.trim().toLowerCase();
  if (lang === 'hindi' || lang === 'hi') return 'hi';
  if (lang === 'spanish' || lang === 'es') return 'es';
  if (lang === 'english' || lang === 'en') return 'en';
  // Add more if needed
  if (lang.length === 2) return lang;
  return 'en'; // fallback to English
}

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const translateTextFlow = async (input: TranslateTextInput): Promise<TranslateTextOutput> => {
  try {
    const target = languageToCode(input.targetLanguage);
    const [translation] = await translate.translate(input.text, target);

    if (!translation || typeof translation !== "string" || translation.trim() === "") {
      console.error(
        'TranslateTextFlow: Invalid or missing output from Google Translate API.',
        { input, outputReceived: translation }
      );
      throw new Error('Translation failed: Google Translate did not return valid translated text.');
    }

    return { translatedText: translation };

  } catch (error) {
    let errorMessageToPropagate = 'An unknown error occurred in the translation service.';
    let errorDetailsForLogging: any = { originalError: String(error) };

    if (error instanceof Error) {
      errorMessageToPropagate = `Translation service failed: ${error.message}`;
      errorDetailsForLogging = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    // Log detailed error information on the server
    console.error(
      `TranslateTextFlow Error: Failed to translate input text "${input.text}" to ${input.targetLanguage}. Details:`,
      JSON.stringify(errorDetailsForLogging, null, 2)
    );

    throw new Error(errorMessageToPropagate);
  }
};
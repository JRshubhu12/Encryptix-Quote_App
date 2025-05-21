'use server';
/**
 * @fileOverview Generates an image based on a quote text using AI.
 *
 * - generateImageForQuote - A function that generates an image for a given quote.
 * - GenerateImageInput - The input type for the generateImageForQuote function.
 * - GenerateImageOutput - The return type for the generateImageForQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  quoteText: z.string().describe('The text of the quote to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe("Data URI of the generated image (e.g., 'data:image/png;base64,...')."),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImageForQuote(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImagePrompt',
  input: {schema: GenerateImageInputSchema},
  output: {schema: GenerateImageOutputSchema},
  prompt: `Generate an artistic and visually evocative image that captures the mood and theme of the following quote: "{{quoteText}}".
Consider abstract or symbolic representations rather than literal ones.
The image should be suitable as a background or illustration for this quote.
Avoid including any text in the image.
Ensure the output is a data URI.`,
  config: {
    // IMPORTANT: ONLY the googleai/gemini-2.0-flash-exp model is able to generate images.
    model: 'googleai/gemini-2.0-flash-exp',
    responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE
     safetySettings: [ // Relax safety settings for more creative image generation
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const result = await prompt(input);
    const imageResponse = result.media[0];

    if (!imageResponse || !imageResponse.url) {
      throw new Error('Image generation failed or did not return a valid image URL.');
    }
    // The model returns the image as a data URI directly in media.url
    return { imageUrl: imageResponse.url };
  }
);

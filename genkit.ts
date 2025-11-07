import { genkit, defineFlow, generate } from 'genkit';
import { grok } from '@genkit-ai/compat-oai/xai';
import { z } from 'zod';

// Initialize Genkit with the Grok plugin
export default genkit({
  plugins: [
    grok({
      // Make sure to set your XAI_API_KEY in your environment variables.
      // For Next.js, you can create a .env.local file.
      apiKey: process.env.XAI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  flowStateStore: 'firebase',
  traceStore: 'firebase',
});

// Define an example flow that uses the grok-4 model
export const grokFlow = defineFlow(
  {
    name: 'grokFlow',
    inputSchema: z.string().describe('The prompt to send to Grok'),
    outputSchema: z.string().describe('The response from Grok'),
  },
  async (prompt) => {
    const llmResponse = await generate({
      model: grok('grok-4'), // Specify the grok-4 model
      prompt: prompt,
      config: {
        temperature: 0.8,
      },
    });

    return llmResponse.text();
  }
);

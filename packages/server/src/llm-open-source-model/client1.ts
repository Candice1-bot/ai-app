import OpenAI from 'openai';
import type { Review } from '../generated/prisma/index.js';
import { InferenceClient } from '@huggingface/inference';

import { readFileSync } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Ollama } from 'ollama';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const summarizePrompt = readFileSync(
   path.resolve(__dirname, '../summarize-reviews.txt'),
   'utf8'
);

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

const openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ollamaClient = new Ollama();
type GenerateTextOptions = {
   model?: string;
   prompt: string;
   instructions?: string;
   temperature?: number;
   maxTokens?: number;
   previousResponseId?: string;
};

type GenerateTextResult = {
   id: string;
   text: string;
};

export const llmClient = {
   async generateText({
      model = 'gpt-4.1',
      prompt,
      instructions,
      temperature = 0.2,
      maxTokens = 3000,
      previousResponseId,
   }: GenerateTextOptions): Promise<GenerateTextResult> {
      const response = await openAIClient.responses.create({
         model,
         input: prompt,
         instructions,
         temperature,
         max_output_tokens: maxTokens,
         previous_response_id: previousResponseId,
      });
      return {
         id: response.id,
         text: response.output_text,
      };
   },

   async summarizeReviews(reviews: string) {
      const chatCompletion = await inferenceClient.chatCompletion({
         provider: 'fireworks-ai',
         model: 'meta-llama/Llama-3.1-8B-Instruct',
         messages: [
            // the first message can be a system massage for giving instructions. and this is where we can insert our prompt
            { role: 'system', content: summarizePrompt },
            // reviews is going to be in the second message.
            {
               role: 'user',
               content: reviews,
            },
         ],
      });

      return chatCompletion.choices[0]?.message.content || '';
   },

   async summarizeReviews1(reviews: string) {
      const response = await ollamaClient.chat({
         model: 'tinyllama',
         messages: [
            // the first message can be a system massage for giving instructions. and this is where we can insert our prompt
            { role: 'system', content: summarizePrompt },
            // reviews is going to be in the second message.
            {
               role: 'user',
               content: reviews,
            },
         ],
      });

      return response.message.content;
   },
};

import OpenAI from 'openai';
import type { Review } from '../generated/prisma/index.js';
import { InferenceClient } from '@huggingface/inference';

const huggingfaceClient = new InferenceClient(process.env.HF_TOKEN);

const openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

   async summarize(text: string) {
      const output = await huggingfaceClient.summarization({
         model: 'facebook/bart-large-cnn',
         inputs: text,
         provider: 'hf-inference',
      });

      return output.summary_text;
   },
};

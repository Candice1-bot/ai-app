import { Ollama } from 'ollama';

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
   async summarizeReviews(reviews: string) {
      const response = await ollamaClient.chat({
         model: 'llama3.1',
         messages: [{ role: 'user', content: 'Why is the sky blue?' }], 
      });

      return response.message.content;
   },
};

import fs, { readFileSync } from 'fs';
import path from 'path';
import { conversationRepository } from '../repositories/conversation.repository.ts';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { llmClient } from '../llm/client.ts';

// recreate CommonJS equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const template = readFileSync(
   path.resolve(__dirname, '../prompts/chatbot.txt'),
   'utf8'
);
const parkInfo = fs.readFileSync(
   path.resolve(__dirname, '../prompts/wonderWorld.md'),
   'utf-8'
);

const instructions = template.replace('{{parkInfo}}', parkInfo);

// to solve problem of Leaky abstraction
type ChatResponse = {
   id: string;
   message: string;
};

// public interface
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await llmClient.generateText({
         model: 'gpt-4o-mini',
         instructions,
         prompt,
         temperature: 0.2,
         maxTokens: 200,
         previousResponseId:
            conversationRepository.getLastResponseId(conversationId),
      });

      conversationRepository.setLastResponseId(conversationId, response.id);
      return {
         id: response.id,
         message: response.text,
      };
   },
};

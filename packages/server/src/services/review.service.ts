import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { llmClient } from '../llm/client.ts';
import { reviewRepository } from '../repositories/review.repository.ts';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const template = readFileSync(
   path.resolve(__dirname, '../prompts/summarize-reviews.txt'),
   'utf8'
);
// public interface
export const reviewService = {
   async summarizeReviews(productId: number): Promise<string> {
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary) {
         return existingSummary;
      }
      // Get the last 10 reviews.
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = template.replace('{{reviews}}', joinedReviews);
      const { text: summary } = await llmClient.generateText({
         model: 'gpt-4.1',
         prompt,
         temperature: 0.2,
         maxTokens: 500,
      });
      // first store the summary into the database.
      await reviewRepository.storeReviewSummary(productId, summary);
      return summary;
   },
};

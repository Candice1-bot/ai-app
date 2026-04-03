import { reviewRepository } from '../repositories/review.repository.ts';
import { llmClient } from './client1.ts';

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
      const summary = await llmClient.summarizeReviews(joinedReviews);
      // first store the summary into the database.
      await reviewRepository.storeReviewSummary(productId, summary);
      return summary;
   },
};

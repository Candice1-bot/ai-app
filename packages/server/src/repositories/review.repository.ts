import dayjs from 'dayjs';
import { PrismaClient, type Review } from '../generated/prisma/index.js';

const prisma = new PrismaClient();
export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      return await prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit ?? 10,
      });
   },
   storeReviewSummary(productId: number, summary: string) {
      const now = new Date();
      const expiredsAt = dayjs().add(7, 'days').toDate();
      const data = {
         content: summary,
         expiresAt: expiredsAt,
         generatedAt: now,
         productId,
      };
      // upsert: a combination of insert and update: if you don't have a record in the database, it will insert it; otherwise it will update it.
      return prisma.summary.upsert({
         where: { productId },
         create: data,
         update: data,
      });
   },
   async getReviewSummary(productId: number): Promise<string | null> {
      const summary = await prisma.summary.findFirst({
         where: { AND: [{ productId }, { expiresAt: { gt: new Date() } }] },
      });
      return summary ? summary.content : null;
   },
};

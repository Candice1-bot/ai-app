import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller.ts';
import { PrismaClient } from './generated/prisma/index.js';
import { reviewController } from './controllers/review.controller.ts';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('Hello World!');
});

router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello World!' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', reviewController.getReviews);

// because we're creating new data. anytime we creating new data, we have to use post method
router.post(
   '/api/products/:id/reviews/summarize',
   reviewController.summarizeReviews
);

export default router;

import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();
export const productRepository = {
   getProduct(productId: number) {
      return prisma.product.findUnique({ where: { id: productId } });
   },
};

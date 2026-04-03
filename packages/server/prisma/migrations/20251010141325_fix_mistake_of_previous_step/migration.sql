-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_productId_fkey`;

-- DropIndex
DROP INDEX `reviews_productId_key` ON `reviews`;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

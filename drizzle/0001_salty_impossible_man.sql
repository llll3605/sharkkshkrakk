ALTER TABLE `users` MODIFY COLUMN `openId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `lastSignedIn` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `userId` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `password` text;--> statement-breakpoint
ALTER TABLE `users` ADD `nickname` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `bank` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `account` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `exchangePw` text;--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `recentSite` text;--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('pending','approved','rejected','blacklist') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_userId_unique` UNIQUE(`userId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `users` (`userId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `users` (`status`);
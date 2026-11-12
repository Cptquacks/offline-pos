CREATE TABLE `app_data_migrations` (
	`key` text PRIMARY KEY,
	`completed_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `products` ADD `code` text;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`code` text,
	`cost` real DEFAULT 0 NOT NULL,
	`stock` integer NOT NULL,
	`unit` text NOT NULL DEFAULT 'unidad',
	`category` text,
	`currency` text NOT NULL,
	`expires_at` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_products`(`id`, `name`, `cost`, `stock`, `unit`, `category`, `currency`, `expires_at`, `created_at`) SELECT `id`, `name`, `cost`, `stock`, `unit`, `category`, `currency`, `expires_at`, `created_at` FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
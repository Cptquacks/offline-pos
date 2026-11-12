CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`cost` real DEFAULT 0 NOT NULL,
	`stock` integer NOT NULL,
	`category` text,
	`currency` text NOT NULL,
	`expires_at` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);

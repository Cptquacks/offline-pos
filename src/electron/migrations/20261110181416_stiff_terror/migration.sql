CREATE TABLE `contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`phone` text NOT NULL,
	`email` text,
	`address` text,
	`staff_id` integer,
	`provider_id` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	CONSTRAINT `fk_contacts_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_contacts_provider_id_providers_id_fk` FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`cost` real DEFAULT 0 NOT NULL,
	`stock` integer NOT NULL,
	`unit` text NOT NULL,
	`category` text,
	`currency` text NOT NULL,
	`expires_at` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `providers` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`waste` real DEFAULT 0 NOT NULL,
	`currency` text NOT NULL,
	`started_at` text,
	`ends_at` text,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`uid` text NOT NULL CONSTRAINT `staff_uid_unique` UNIQUE,
	`salary` real DEFAULT 0 NOT NULL,
	`currency` text NOT NULL,
	`role` text,
	`started_at` text,
	`ends_at` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`type` integer NOT NULL,
	`color` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	CONSTRAINT `tags_name_type_unique` UNIQUE(`name`,`type`)
);
--> statement-breakpoint
CREATE TABLE `ticket_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`ticket_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`unit_price` real NOT NULL,
	`sub_total` real NOT NULL,
	`transaction_currency` text NOT NULL,
	CONSTRAINT `fk_ticket_items_ticket_id_tickets_id_fk` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_ticket_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`trace_id` integer NOT NULL,
	`total` real DEFAULT 0 NOT NULL,
	`is_closed` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	CONSTRAINT `fk_tickets_trace_id_traces_id_fk` FOREIGN KEY (`trace_id`) REFERENCES `traces`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `traces` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`date` text NOT NULL,
	`is_closed` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);

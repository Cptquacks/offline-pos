CREATE TABLE `notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`value` text NOT NULL,
	`staff_id` integer,
	`provider_id` integer,
	`product_id` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	CONSTRAINT `fk_notes_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_notes_provider_id_providers_id_fk` FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_notes_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
	CONSTRAINT "notes_single_owner_check" CHECK(
        ("staff_id" IS NOT NULL) +
        ("provider_id" IS NOT NULL) +
        ("product_id" IS NOT NULL) = 1
    )
);
--> statement-breakpoint
INSERT OR IGNORE INTO `tags` (`name`, `type`, `color`) VALUES ('CUP', 2, NULL), ('USD', 2, NULL);
--> statement-breakpoint
ALTER TABLE `providers` ADD `span` integer DEFAULT 31 NOT NULL;--> statement-breakpoint
ALTER TABLE `tickets` ADD `kind` text DEFAULT 'sale' NOT NULL;--> statement-breakpoint
ALTER TABLE `tickets` ADD `archived` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `ticket_items` ADD `original_ticket_item_id` integer REFERENCES `ticket_items`(`id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `traces` ADD `refunds` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `traces` ADD `sells` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `traces` ADD `total` text DEFAULT '{}' NOT NULL;
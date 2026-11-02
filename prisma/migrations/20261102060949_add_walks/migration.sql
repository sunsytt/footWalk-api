-- CreateTable
CREATE TABLE `walks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(60) NOT NULL,
    `date` DATE NOT NULL,
    `steps` INTEGER NOT NULL,
    `distance_km` DOUBLE NOT NULL,
    `duration_minutes` INTEGER NOT NULL,
    `notes` VARCHAR(120) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `walks_user_id_date_idx`(`user_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `walks` ADD CONSTRAINT `walks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE DATABASE IF NOT EXISTS `nodelogin` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `nodelogin`;

/*
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;*/
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isAdmin` tinyint DEFAULT '0',
  `about` varchar(45) DEFAULT NULL,
  `displayName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `wall_posts` (
  `wall_post_id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(45) NOT NULL,
  `date` varchar(45) NOT NULL,
  `users_id` int NOT NULL,
  PRIMARY KEY (`wall_post_id`),
  KEY `fk_wall_posts_users_idx` (`users_id`),
  CONSTRAINT `fk_wall_posts_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*code to create stats table*/
CREATE TABLE `stats` (
  `stat_id` int NOT NULL AUTO_INCREMENT,
  `resource` varchar(45) NOT NULL,
  `count` int NOT NULL DEFAULT '0',
  `method` varchar(45) NOT NULL,
  PRIMARY KEY (`stat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

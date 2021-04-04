USE APP;

DROP TABLE USERS;
DROP TABLE POSTS;

CREATE TABLE USERS(
  username VARCHAR(255),
  name VARCHAR(255),
  id INT,
  about_me VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE POSTS(
  content VARCHAR(255)
);

/*
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `wall_posts` (
  `wall_post_id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(45) NOT NULL,
  `date` varchar(45) NOT NULL,
  `users_id` int NOT NULL,
  PRIMARY KEY (`wall_post_id`),
  KEY `fk_wall_posts_users_idx` (`users_id`),
  CONSTRAINT `fk_wall_posts_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
*/
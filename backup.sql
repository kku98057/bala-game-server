-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: balansome_dev
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `BalanceFinalChoice`
--

DROP TABLE IF EXISTS `BalanceFinalChoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BalanceFinalChoice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `questionId` int NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `selectedItemId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `BalanceFinalChoice_questionId_idx` (`questionId`),
  KEY `BalanceFinalChoice_selectedItemId_idx` (`selectedItemId`),
  KEY `BalanceFinalChoice_userId_idx` (`userId`),
  CONSTRAINT `BalanceFinalChoice_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `BalanceQuestion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `BalanceFinalChoice_selectedItemId_fkey` FOREIGN KEY (`selectedItemId`) REFERENCES `BalanceItem` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `BalanceFinalChoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BalanceFinalChoice`
--

LOCK TABLES `BalanceFinalChoice` WRITE;
/*!40000 ALTER TABLE `BalanceFinalChoice` DISABLE KEYS */;
INSERT INTO `BalanceFinalChoice` VALUES (1,1,NULL,1,'2024-11-16 02:48:08.332'),(2,1,NULL,1,'2024-11-16 03:24:22.492'),(3,1,NULL,1,'2024-11-16 06:29:47.751'),(4,1,NULL,1,'2024-11-16 06:30:29.307'),(5,1,NULL,1,'2024-11-16 06:51:22.007');
/*!40000 ALTER TABLE `BalanceFinalChoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BalanceGame`
--

DROP TABLE IF EXISTS `BalanceGame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BalanceGame` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('BALANCE','TOURNAMENT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BALANCE',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` enum('ACTIVE','COMPLETED','DELETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `endedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `BalanceGame_userId_idx` (`userId`),
  CONSTRAINT `BalanceGame_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BalanceGame`
--

LOCK TABLES `BalanceGame` WRITE;
/*!40000 ALTER TABLE `BalanceGame` DISABLE KEYS */;
INSERT INTO `BalanceGame` VALUES (1,'cm3aclt710000eytz591vkmmo','rasdf','asdfa','BALANCE','2024-11-09 16:03:33.887','ACTIVE',NULL);
/*!40000 ALTER TABLE `BalanceGame` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BalanceItem`
--

DROP TABLE IF EXISTS `BalanceItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BalanceItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `selectCount` int NOT NULL DEFAULT '0',
  `questionId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `BalanceItem_questionId_idx` (`questionId`),
  CONSTRAINT `BalanceItem_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `BalanceQuestion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BalanceItem`
--

LOCK TABLES `BalanceItem` WRITE;
/*!40000 ALTER TABLE `BalanceItem` DISABLE KEYS */;
INSERT INTO `BalanceItem` VALUES (1,'fasdf',5,1),(2,'asdf',0,1);
/*!40000 ALTER TABLE `BalanceItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BalanceQuestion`
--

DROP TABLE IF EXISTS `BalanceQuestion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BalanceQuestion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gameId` int NOT NULL,
  `participantCount` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `BalanceQuestion_gameId_idx` (`gameId`),
  CONSTRAINT `BalanceQuestion_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `BalanceGame` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BalanceQuestion`
--

LOCK TABLES `BalanceQuestion` WRITE;
/*!40000 ALTER TABLE `BalanceQuestion` DISABLE KEYS */;
INSERT INTO `BalanceQuestion` VALUES (1,'sdfasd',1,75,'2024-11-09 16:03:33.887');
/*!40000 ALTER TABLE `BalanceQuestion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `gameType` enum('BALANCE','TOURNAMENT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TOURNAMENT',
  `tournamentGameId` int DEFAULT NULL,
  `balanceGameId` int DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Comment_tournamentGameId_idx` (`tournamentGameId`),
  KEY `Comment_balanceGameId_idx` (`balanceGameId`),
  KEY `Comment_userId_idx` (`userId`),
  CONSTRAINT `Comment_balanceGameId_fkey` FOREIGN KEY (`balanceGameId`) REFERENCES `BalanceGame` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Comment_tournamentGameId_fkey` FOREIGN KEY (`tournamentGameId`) REFERENCES `TournamentGame` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FinalChoice`
--

DROP TABLE IF EXISTS `FinalChoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FinalChoice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournamentId` int NOT NULL,
  `selectedItemId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FinalChoice_tournamentId_idx` (`tournamentId`),
  KEY `FinalChoice_selectedItemId_idx` (`selectedItemId`),
  KEY `FinalChoice_userId_idx` (`userId`),
  CONSTRAINT `FinalChoice_selectedItemId_fkey` FOREIGN KEY (`selectedItemId`) REFERENCES `TournamentItem` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FinalChoice_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `TournamentGame` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FinalChoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FinalChoice`
--

LOCK TABLES `FinalChoice` WRITE;
/*!40000 ALTER TABLE `FinalChoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `FinalChoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notice`
--

DROP TABLE IF EXISTS `Notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isVisible` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `Notice_authorId_idx` (`authorId`),
  KEY `Notice_createdAt_idx` (`createdAt`),
  CONSTRAINT `Notice_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notice`
--

LOCK TABLES `Notice` WRITE;
/*!40000 ALTER TABLE `Notice` DISABLE KEYS */;
/*!40000 ALTER TABLE `Notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PointHistory`
--

DROP TABLE IF EXISTS `PointHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PointHistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `reason` enum('GAME_PARTICIPATION','GAME_CREATION','ADMIN_ADJUSTMENT','EVENT_REWARD','REFUND','ITEM_PURCHASE','GIFT_SENT','POINT_EXCHANGE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `gameId` int DEFAULT NULL,
  `gameType` enum('BALANCE','TOURNAMENT') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `PointHistory_userId_idx` (`userId`),
  KEY `PointHistory_createdAt_idx` (`createdAt`),
  KEY `PointHistory_reason_idx` (`reason`),
  CONSTRAINT `PointHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PointHistory`
--

LOCK TABLES `PointHistory` WRITE;
/*!40000 ALTER TABLE `PointHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `PointHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TournamentGame`
--

DROP TABLE IF EXISTS `TournamentGame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TournamentGame` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `participantCount` int NOT NULL DEFAULT '0',
  `status` enum('ACTIVE','COMPLETED','DELETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `TournamentGame_userId_idx` (`userId`),
  CONSTRAINT `TournamentGame_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TournamentGame`
--

LOCK TABLES `TournamentGame` WRITE;
/*!40000 ALTER TABLE `TournamentGame` DISABLE KEYS */;
/*!40000 ALTER TABLE `TournamentGame` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TournamentItem`
--

DROP TABLE IF EXISTS `TournamentItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TournamentItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tournamentId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `TournamentItem_tournamentId_fkey` (`tournamentId`),
  CONSTRAINT `TournamentItem_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `TournamentGame` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TournamentItem`
--

LOCK TABLES `TournamentItem` WRITE;
/*!40000 ALTER TABLE `TournamentItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `TournamentItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` enum('EMAIL','KAKAO','GOOGLE','NAVER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EMAIL',
  `socialId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `profileImageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('USER','ADMIN','SUPER_ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `phoneNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_nickname_key` (`nickname`),
  KEY `User_email_idx` (`email`),
  KEY `User_role_idx` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('cm3aclt710000eytz591vkmmo','kku98057@naver.com','$2a$12$D/9zGH.yI8q/B62yQGD/m.k7GjStbE7Nb23Jm/775xmG6C/iie1fC','rasdf','EMAIL',NULL,'2024-11-09 15:56:31.883',NULL,'USER',NULL),('cm46gzqhu0000dlc3f4geqyds','kku980572@gmail.com','$2a$12$tJfz3sserb5Weor6GYT9LuuIzNgkd.koXOaO8KauTF4pr2t8rWdt2','as222','EMAIL',NULL,'2024-12-02 03:27:57.665',NULL,'USER',NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-02  3:36:09

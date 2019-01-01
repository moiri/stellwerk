-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 01, 2019 at 10:03 PM
-- Server version: 5.7.24-0ubuntu0.18.04.1
-- PHP Version: 7.2.10-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stellwerk`
--

-- --------------------------------------------------------

--
-- Table structure for table `drive_instances`
--

CREATE TABLE `drive_instances` (
  `id` int(10) UNSIGNED NOT NULL,
  `addr` int(10) UNSIGNED NOT NULL,
  `id_instance` int(10) UNSIGNED NOT NULL,
  `drive_number` int(1) UNSIGNED NOT NULL DEFAULT '0',
  `is_inverted` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `instances`
--

CREATE TABLE `instances` (
  `id` int(10) UNSIGNED NOT NULL,
  `id_station` int(10) UNSIGNED NOT NULL,
  `id_track_item` int(10) UNSIGNED NOT NULL,
  `angle` int(11) NOT NULL,
  `position` varchar(10) NOT NULL,
  `ecos_id` int(11) DEFAULT NULL,
  `ecos_addr` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `instances`
--

INSERT INTO `instances` (`id`, `id_station`, `id_track_item`, `angle`, `position`, `ecos_id`, `ecos_addr`) VALUES
(5, 1, 1, 180, '2-0', NULL, NULL),
(6, 1, 1, 0, '3-0', NULL, NULL),
(7, 1, 3, 180, '2-1', NULL, NULL),
(8, 1, 1, 0, '3-1', NULL, NULL),
(9, 1, 4, 180, '2-2', NULL, NULL),
(10, 1, 4, 180, '0-2', NULL, NULL),
(11, 1, 2, 90, '0-1', NULL, NULL),
(12, 1, 1, 90, '1-1', NULL, NULL),
(13, 1, 2, 0, '1-2', NULL, NULL),
(14, 1, 5, 0, '3-2', NULL, NULL),
(15, 1, 2, 0, '4-2', NULL, NULL),
(16, 1, 1, 0, '0-3', NULL, NULL),
(17, 1, 1, 0, '1-3', NULL, NULL),
(18, 1, 1, 0, '2-3', NULL, NULL),
(19, 1, 1, 0, '3-3', NULL, NULL),
(20, 1, 1, 0, '4-3', NULL, NULL),
(26, 1, 1, 0, '0-4', NULL, NULL),
(27, 1, 1, 0, '1-4', NULL, NULL),
(29, 1, 1, 0, '3-4', NULL, NULL),
(30, 1, 1, 0, '4-4', NULL, NULL),
(31, 1, 1, 0, '0-5', NULL, NULL),
(32, 1, 1, 0, '1-5', NULL, NULL),
(33, 1, 1, 0, '2-4', NULL, NULL),
(34, 1, 1, 0, '2-5', NULL, NULL),
(35, 1, 1, 0, '3-5', NULL, NULL),
(36, 1, 1, 0, '4-5', NULL, NULL),
(37, 1, 1, 0, '0-6', NULL, NULL),
(38, 1, 1, 0, '1-6', NULL, NULL),
(39, 1, 1, 0, '2-6', NULL, NULL),
(40, 1, 1, 0, '3-6', NULL, NULL),
(41, 1, 1, 0, '4-6', NULL, NULL),
(42, 1, 3, 180, '4-7', NULL, NULL),
(43, 1, 4, 270, '3-7', NULL, NULL),
(44, 1, 3, 0, '2-7', 1001, 16),
(45, 1, 4, 0, '2-8', 1000, 16),
(46, 1, 2, 180, '1-8', NULL, NULL),
(47, 1, 1, 0, '1-7', NULL, NULL),
(48, 1, 1, 0, '2-9', NULL, NULL),
(49, 1, 1, 0, '4-8', NULL, NULL),
(50, 1, 1, 0, '4-9', NULL, NULL),
(51, 3, 1, 0, '0-0', NULL, NULL),
(52, 3, 1, 0, '0-0', NULL, NULL),
(53, 3, 1, 0, '0-0', NULL, NULL),
(54, 1, 1, 180, '0-7', NULL, NULL),
(55, 1, 1, 0, '0-8', NULL, NULL),
(56, 1, 6, 0, '0-9', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `station`
--

CREATE TABLE `station` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `cols` int(10) UNSIGNED NOT NULL,
  `rows` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `station`
--

INSERT INTO `station` (`id`, `name`, `cols`, `rows`) VALUES
(1, 'Hauptbahnhof', 11, 5);

-- --------------------------------------------------------

--
-- Table structure for table `track_items`
--

CREATE TABLE `track_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `img_name` varchar(100) NOT NULL,
  `drive_count` int(1) NOT NULL,
  `position` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `track_items`
--

INSERT INTO `track_items` (`id`, `name`, `img_name`, `drive_count`, `position`) VALUES
(1, 'Gerade', 'gerade', 0, 10),
(2, 'Diagonale', 'diagonal', 0, 20),
(3, 'Weiche links', 'weiche_links', 1, 40),
(4, 'Weiche rechts', 'weiche_rechts', 1, 50),
(5, 'Engländer', 'englaender', 2, 60),
(6, 'Schluss', 'schluss', 0, 30);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `drive_instances`
--
ALTER TABLE `drive_instances`
  ADD PRIMARY KEY (`id_instance`,`drive_number`),
  ADD KEY `id_instance` (`id_instance`);

--
-- Indexes for table `instances`
--
ALTER TABLE `instances`
  ADD PRIMARY KEY (`id`,`id_station`),
  ADD KEY `id_track_item` (`id_track_item`);

--
-- Indexes for table `station`
--
ALTER TABLE `station`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `track_items`
--
ALTER TABLE `track_items`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `instances`
--
ALTER TABLE `instances`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
--
-- AUTO_INCREMENT for table `station`
--
ALTER TABLE `station`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `track_items`
--
ALTER TABLE `track_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `drive_instances`
--
ALTER TABLE `drive_instances`
  ADD CONSTRAINT `drive_instances_fk_id_instance` FOREIGN KEY (`id_instance`) REFERENCES `instances` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

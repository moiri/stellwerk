-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 16, 2019 at 10:54 AM
-- Server version: 5.7.25-0ubuntu0.18.04.2
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

--
-- Dumping data for table `drive_instances`
--

INSERT INTO `drive_instances` (`id`, `addr`, `id_instance`, `drive_number`, `is_inverted`) VALUES
(20007, 14, 7, 0, 0),
(20008, 15, 9, 0, 0),
(20022, 11, 14, 0, 0),
(20022, 12, 14, 1, 0),
(20014, 20, 42, 0, 0),
(20012, 18, 44, 0, 0),
(20011, 17, 45, 0, 0),
(20009, 16, 62, 0, 0),
(20013, 19, 66, 0, 0),
(20006, 13, 89, 0, 0),
(20018, 1, 97, 0, 0),
(20029, 4, 98, 0, 0),
(20052, 9, 100, 0, 0),
(20050, 6, 108, 0, 0),
(20050, 7, 108, 1, 0),
(20053, 10, 109, 0, 0),
(20045, 21, 113, 0, 0),
(20032, 8, 115, 0, 0),
(20047, 23, 116, 0, 0),
(20048, 24, 117, 0, 0),
(20046, 22, 120, 0, 0),
(20001, 2, 150, 0, 0),
(20002, 3, 152, 0, 0),
(20049, 5, 155, 0, 0);

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
  `label` varchar(100) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `instances`
--

INSERT INTO `instances` (`id`, `id_station`, `id_track_item`, `angle`, `position`, `label`) VALUES
(7, 1, 3, 180, '2-3', '12'),
(9, 1, 4, 180, '2-4', '13'),
(11, 1, 2, 90, '1-3', ''),
(14, 1, 5, 0, '3-4', '15'),
(15, 1, 2, 0, '4-4', ''),
(19, 1, 1, 0, '3-3', ''),
(20, 1, 1, 0, '4-6', ''),
(26, 1, 1, 0, '1-6', ''),
(32, 1, 1, 0, '1-7', ''),
(34, 1, 1, 0, '2-5', ''),
(35, 1, 1, 0, '3-5', ''),
(37, 1, 1, 0, '0-6', ''),
(38, 1, 1, 0, '1-8', '4'),
(39, 1, 1, 0, '2-6', ''),
(40, 1, 1, 0, '3-6', ''),
(42, 1, 3, 180, '4-11', '19'),
(44, 1, 3, 0, '2-12', '17'),
(45, 1, 4, 0, '2-14', '16'),
(46, 1, 2, 180, '1-14', ''),
(47, 1, 1, 0, '1-9', ''),
(48, 1, 1, 0, '2-15', ''),
(49, 1, 1, 0, '4-8', '1'),
(51, 3, 1, 0, '0-0', ''),
(52, 3, 1, 0, '0-0', ''),
(53, 3, 1, 0, '0-0', ''),
(54, 1, 1, 180, '0-7', ''),
(55, 1, 1, 0, '0-8', '5'),
(59, 1, 1, 0, '1-5', ''),
(62, 1, 3, 180, '1-4', '14'),
(63, 1, 2, 90, '0-4', ''),
(64, 1, 1, 0, '2-13', ''),
(65, 1, 2, 270, '3-12', ''),
(66, 1, 3, 0, '3-11', '18'),
(67, 1, 1, 0, '4-7', ''),
(68, 1, 1, 0, '1-10', ''),
(69, 1, 1, 0, '1-11', ''),
(70, 1, 1, 0, '1-12', ''),
(71, 1, 1, 0, '1-13', ''),
(72, 1, 1, 0, '2-7', ''),
(73, 1, 1, 0, '2-8', '3'),
(74, 1, 1, 0, '2-9', ''),
(75, 1, 1, 0, '3-7', ''),
(76, 1, 1, 0, '3-8', '2'),
(79, 1, 1, 0, '4-12', ''),
(80, 1, 6, 0, '4-14', ''),
(83, 1, 6, 180, '3-1', ''),
(84, 1, 1, 0, '2-1', ''),
(85, 1, 2, 90, '2-0', ''),
(86, 1, 1, 90, '3-0', ''),
(87, 1, 1, 90, '4-0', ''),
(89, 1, 4, 270, '5-0', 'KW'),
(90, 1, 1, 0, '2-10', ''),
(91, 1, 1, 0, '2-11', ''),
(92, 1, 1, 0, '3-9', ''),
(93, 1, 1, 0, '3-10', ''),
(94, 1, 1, 0, '4-9', ''),
(95, 1, 1, 0, '4-10', ''),
(96, 2, 1, 0, '4-0', ''),
(97, 2, 3, 180, '4-1', '1'),
(98, 2, 3, 180, '4-2', '4'),
(99, 2, 1, 0, '4-3', ''),
(100, 2, 4, 180, '4-4', '9'),
(101, 2, 2, 90, '3-1', ''),
(103, 2, 1, 0, '3-3', ''),
(104, 2, 1, 0, '3-4', ''),
(105, 2, 1, 0, '3-5', '22'),
(106, 2, 1, 0, '3-6', ''),
(108, 2, 5, 0, '3-7', '6'),
(109, 2, 4, 0, '4-7', '10'),
(110, 2, 1, 0, '4-5', '33'),
(111, 2, 1, 0, '4-6', ''),
(112, 2, 2, 0, '5-4', ''),
(113, 2, 4, 180, '5-5', '21'),
(115, 2, 3, 0, '3-11', '8'),
(116, 2, 4, 0, '7-6', '23'),
(117, 2, 4, 0, '8-7', '24'),
(118, 2, 2, 180, '7-7', ''),
(119, 2, 1, 0, '8-8', ''),
(120, 2, 4, 180, '6-6', '22'),
(121, 2, 2, 0, '6-5', ''),
(122, 2, 1, 0, '7-5', '15'),
(123, 2, 1, 0, '8-6', ''),
(124, 2, 1, 0, '8-5', '16'),
(125, 2, 6, 180, '7-3', ''),
(126, 2, 6, 180, '8-3', ''),
(127, 2, 6, 0, '8-12', ''),
(128, 2, 1, 0, '6-7', ''),
(130, 2, 6, 0, '6-12', ''),
(131, 2, 1, 0, '5-6', ''),
(132, 2, 1, 0, '5-7', ''),
(133, 2, 1, 0, '6-8', ''),
(134, 2, 1, 0, '5-8', ''),
(135, 2, 6, 0, '5-12', ''),
(136, 2, 1, 0, '4-8', ''),
(137, 2, 1, 0, '4-9', '3'),
(138, 2, 1, 0, '4-10', ''),
(139, 2, 2, 270, '4-11', ''),
(140, 2, 1, 0, '3-8', ''),
(141, 2, 1, 0, '3-9', '2'),
(142, 2, 1, 0, '3-10', ''),
(144, 2, 6, 0, '3-12', ''),
(145, 2, 2, 90, '2-2', ''),
(146, 2, 2, 270, '2-3', ''),
(147, 2, 2, 90, '1-3', ''),
(148, 2, 2, 270, '1-4', ''),
(149, 2, 2, 90, '0-4', ''),
(150, 2, 4, 180, '0-5', '2'),
(152, 2, 4, 180, '0-6', '3'),
(153, 2, 2, 0, '1-5', ''),
(154, 2, 2, 0, '2-6', ''),
(155, 2, 4, 180, '2-7', '5'),
(157, 2, 1, 0, '1-7', ''),
(158, 2, 1, 0, '1-8', ''),
(159, 2, 1, 0, '1-9', '10'),
(160, 2, 1, 0, '1-10', ''),
(161, 2, 1, 0, '1-11', ''),
(162, 2, 1, 0, '1-12', ''),
(163, 2, 6, 0, '1-14', ''),
(164, 2, 1, 0, '2-8', ''),
(165, 2, 1, 0, '2-9', '1'),
(166, 2, 1, 0, '2-10', ''),
(167, 2, 1, 0, '2-11', ''),
(169, 2, 6, 0, '2-12', ''),
(170, 2, 1, 0, '0-7', ''),
(171, 2, 1, 0, '0-8', ''),
(172, 2, 1, 0, '0-9', ''),
(173, 2, 1, 0, '0-10', ''),
(174, 2, 1, 0, '0-11', ''),
(175, 2, 1, 0, '0-12', ''),
(176, 2, 1, 0, '0-13', ''),
(177, 2, 1, 0, '0-14', ''),
(178, 2, 2, 180, '0-15', ''),
(179, 2, 1, 0, '1-13', ''),
(180, 2, 1, 0, '5-9', '4'),
(181, 2, 1, 0, '5-10', ''),
(182, 2, 1, 0, '5-11', ''),
(183, 2, 1, 0, '6-9', '5'),
(184, 2, 1, 0, '6-10', ''),
(185, 2, 1, 0, '6-11', ''),
(186, 2, 1, 0, '8-9', '6'),
(187, 2, 1, 0, '8-10', ''),
(188, 2, 1, 0, '8-11', ''),
(189, 2, 1, 0, '7-4', ''),
(190, 2, 1, 0, '8-4', ''),
(191, 2, 7, 90, '3-2', ''),
(192, 2, 7, 180, '1-6', ''),
(193, 1, 1, 0, '0-5', ''),
(194, 1, 1, 0, '4-5', ''),
(195, 1, 1, 0, '2-2', ''),
(196, 1, 1, 0, '0-9', ''),
(197, 1, 6, 0, '0-10', ''),
(198, 1, 1, 0, '4-13', '11'),
(199, 1, 1, 0, '3-2', '22');

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
(1, 'Hauptbahnhof', 16, 6),
(2, 'Kopfbahnhof', 16, 9);

-- --------------------------------------------------------

--
-- Table structure for table `track_items`
--

CREATE TABLE `track_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `img_name` varchar(100) NOT NULL,
  `drive_count` int(1) NOT NULL,
  `position` int(4) NOT NULL,
  `connection` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `track_items`
--

INSERT INTO `track_items` (`id`, `name`, `img_name`, `drive_count`, `position`, `connection`) VALUES
(1, 'Gerade', 'gerade', 0, 10, '[[0,2]]'),
(2, 'Diagonale', 'diagonal', 0, 20, '[[2,3]]'),
(3, 'Weiche links', 'weiche_links', 1, 40, '[[0,2],[1,2]]'),
(4, 'Weiche rechts', 'weiche_rechts', 1, 50, '[[0,2],[2,3]]'),
(5, 'Engländer', 'englaender', 2, 60, '[[0,2],[2,3],[0,1],[1,3]]'),
(6, 'Schluss', 'schluss', 0, 30, '[[0,null]]'),
(7, 'Doppel Diaginale', 'diagonal_2', 0, 25, '[[0,1],[2,3]]');

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200;
--
-- AUTO_INCREMENT for table `station`
--
ALTER TABLE `station`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `track_items`
--
ALTER TABLE `track_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
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

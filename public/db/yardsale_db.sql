/*
SQLyog Community v11.51 (64 bit)
MySQL - 5.6.16 : Database - druidinc_yardsale
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`druidinc_yardsale` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `druidinc_yardsale`;

/*Table structure for table `personal_info` */

DROP TABLE IF EXISTS `personal_info`;

CREATE TABLE `personal_info` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `login_id` int(20) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `first_nme` varchar(20) DEFAULT NULL,
  `middle_name` varchar(20) DEFAULT NULL,
  `email_address` varchar(30) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `zip` int(5) DEFAULT NULL,
  `state` varchar(2) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `active` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `login_id` (`login_id`),
  CONSTRAINT `personal_info_ibfk_1` FOREIGN KEY (`login_id`) REFERENCES `personal_info` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `personal_info` */

/*Table structure for table `security_login` */

DROP TABLE IF EXISTS `security_login`;

CREATE TABLE `security_login` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `login_id` int(20) DEFAULT NULL,
  `user_id` int(20) DEFAULT NULL,
  `validation_code` int(70) DEFAULT NULL,
  `s_question` varchar(80) DEFAULT NULL,
  `s_answer` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `login_id` (`login_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `security_login_ibfk_1` FOREIGN KEY (`login_id`) REFERENCES `user_login` (`id`),
  CONSTRAINT `security_login_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `personal_info` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `security_login` */

/*Table structure for table `user_login` */

DROP TABLE IF EXISTS `user_login`;

CREATE TABLE `user_login` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `login_email` varchar(30) DEFAULT NULL,
  `login_password` varchar(30) DEFAULT NULL,
  `date_added` datetime DEFAULT NULL,
  `validate` int(1) DEFAULT NULL,
  `active` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `user_login` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

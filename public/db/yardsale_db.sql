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

/*Table structure for table `country` */

DROP TABLE IF EXISTS `country`;

CREATE TABLE `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(3) DEFAULT NULL,
  `name` tinytext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `country` */

insert  into `country`(`id`,`code`,`name`) values (1,'PH','Philippines');

/*Table structure for table `function` */

DROP TABLE IF EXISTS `function`;

CREATE TABLE `function` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `function` */

insert  into `function`(`id`,`name`) values (1,'buy'),(2,'sell'),(3,'trade');

/*Table structure for table `role` */

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `role` */

insert  into `role`(`id`,`name`) values (1,'admin'),(2,'free_user'),(3,'paid_user');

/*Table structure for table `role_functions` */

DROP TABLE IF EXISTS `role_functions`;

CREATE TABLE `role_functions` (
  `role_id` int(11) NOT NULL,
  `function_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `role_functions` */

insert  into `role_functions`(`role_id`,`function_id`) values (1,1),(1,3),(1,3),(2,1),(2,2),(3,1),(3,2),(3,3);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `user_id` int(11) DEFAULT NULL,
  `firstname` text NOT NULL,
  `middlename` text,
  `lastname` text NOT NULL,
  `telephone` text,
  `mobile` text NOT NULL,
  `address1` text NOT NULL,
  `address2` text,
  `country` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `user` */

insert  into `user`(`user_id`,`firstname`,`middlename`,`lastname`,`telephone`,`mobile`,`address1`,`address2`,`country`) values (1,'admin',NULL,'admin',NULL,'09331380982','cebu',NULL,1);

/*Table structure for table `user_payment_info` */

DROP TABLE IF EXISTS `user_payment_info`;

CREATE TABLE `user_payment_info` (
  `user_id` int(11) NOT NULL,
  `paypal` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `user_payment_info` */

/*Table structure for table `user_registration` */

DROP TABLE IF EXISTS `user_registration`;

CREATE TABLE `user_registration` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` tinytext NOT NULL,
  `password` text NOT NULL,
  `validationcode` text NOT NULL,
  `sent` tinyint(1) DEFAULT '0',
  `validated` tinyint(1) DEFAULT '0',
  `active` tinyint(1) DEFAULT '0',
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `user_registration` */

insert  into `user_registration`(`id`,`email`,`password`,`validationcode`,`sent`,`validated`,`active`,`role_id`) values (1,'admin@admin.com','adminAdm!nadm1n','',1,1,1,1),(2,'admin2@admin.com','!l0v3A!za143','2y14OjL8DxsvrbPBfnDyxO2JXed1zmsgcWTtKpKwr7x0XI1x5aemq59hu686626145859022421b23ea624cd88813dc221e2',1,1,1,2);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

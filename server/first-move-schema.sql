CREATE TABLE `accesstoken` (
  `id` varchar(255) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `realm` varchar(512) DEFAULT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `socialMediaToken` varchar(512) DEFAULT NULL,
  `credentials` text,
  `challenges` text,
  `email` varchar(512) DEFAULT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  `status` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `lastUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

CREATE TABLE `acl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(512) DEFAULT NULL,
  `property` varchar(512) DEFAULT NULL,
  `accessType` varchar(512) DEFAULT NULL,
  `permission` varchar(512) DEFAULT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `bluetoothaccount` (
  `bluetoothAccountId` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` int(11) NOT NULL,
  `deviceName` varchar(512) NOT NULL,
  `deviceAddress` varchar(512) NOT NULL,
  `createdDate` datetime NOT NULL,
  PRIMARY KEY (`bluetoothAccountId`),
  KEY `fk_Account_BluetoothAccount_idx` (`accountId`),
  CONSTRAINT `fk_Account_BluetoothAccount` FOREIGN KEY (`accountId`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

CREATE TABLE `contactdetail` (
  `contactDetailId` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` int(11) NOT NULL,
  `phoneNumber` varchar(512) DEFAULT NULL,
  `facebookUserName` varchar(512) DEFAULT NULL,
  `twitterUserName` varchar(512) DEFAULT NULL,
  `instagramUserName` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`contactDetailId`),
  KEY `fk_Account_ContactDetail_idx` (`accountId`),
  CONSTRAINT `fk_Account_ContactDetail` FOREIGN KEY (`accountId`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

CREATE TABLE `contactrequest` (
  `contactRequestId` int(11) NOT NULL AUTO_INCREMENT,
  `toAccountId` int(11) DEFAULT NULL,
  `FromAccountId` int(11) DEFAULT NULL,
  `requestMessage` varchar(100) DEFAULT NULL,
  `status` varchar(45) DEFAULT 'pending',
  `createdDate` datetime DEFAULT NULL,
  PRIMARY KEY (`contactRequestId`),
  KEY `fk_ContactRequest_Account_idx` (`toAccountId`),
  KEY `fk_ContactRequest_AccountFrom_idx` (`FromAccountId`),
  CONSTRAINT `fk_ContactRequest_AccountFrom` FOREIGN KEY (`FromAccountId`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ContactRequest_AccountTo` FOREIGN KEY (`toAccountId`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;

CREATE TABLE `location` (
  `locationId` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` int(11) NOT NULL,
  `latitude` float(10,6) NOT NULL,
  `longitude` float(10,6) NOT NULL,
  PRIMARY KEY (`locationId`),
  KEY `fk_Account_Location_idx` (`accountId`),
  CONSTRAINT `fk_Account_Location` FOREIGN KEY (`accountId`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

CREATE TABLE `profile` (
  `profileId` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` int(11) DEFAULT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `profileImage` varchar(512) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `modifiedDate` datetime NOT NULL,
  `createdDate` datetime NOT NULL,
  PRIMARY KEY (`profileId`),
  KEY `fk_Account_Profile_idx` (`accountId`),
  CONSTRAINT `fk_Account_Profile` FOREIGN KEY (`accountId`) REFERENCES `account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

CREATE TABLE `rolemapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `principalId` (`principalId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `realm` varchar(512) DEFAULT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `credentials` text,
  `challenges` text,
  `email` varchar(512) NOT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  `status` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `lastUpdated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

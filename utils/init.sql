CREATE TABLE `matches` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `number` int(11) NOT NULL,
  `time` int(32) unsigned DEFAULT NULL,
  `red` int(11) DEFAULT '0',
  `blue` int(11) DEFAULT '0',
  `green` int(11) DEFAULT '0',
  `yellow` int(11) DEFAULT '0',
  `matchType` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
);

CREATE TABLE `radios` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `teamNumber` int(11) NOT NULL,
  `address` text NOT NULL,
  PRIMARY KEY (`ID`)
);

CREATE TABLE `scores` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `teamNumber` int(11) NOT NULL,
  `matchNumber` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
);

CREATE TABLE `teams` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `number` int(11) NOT NULL,
  `name` text,
  `robot_name` text,
  `college_name` text,
  PRIMARY KEY (`ID`)
);

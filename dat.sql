--
-- Vytvorenie tabuliek
--

CREATE TABLE IF NOT EXISTS `users` (
	`user_id` int(10) unsigned NOT NULL,
	`mail` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
	`password` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `projects` (
	`project_id` int(10) unsigned NOT NULL,
	`user_id` int(10) unsigned DEFAULT NULL,
	`name` text COLLATE utf8_unicode_ci,
	`code` text COLLATE utf8_unicode_ci,
	`code2` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `functions` (
	`function_id` int(10) unsigned NOT NULL,
	`project_id` int(10) unsigned DEFAULT NULL,
	`name` text COLLATE utf8_unicode_ci,
	`code2` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `links` (
	`link_id` int(10) unsigned NOT NULL,
	`project_id` int(10) unsigned DEFAULT NULL,
	`function_id` int(10) unsigned DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Vloženie testovacích dát
--




--
-- Indexy pre tabuľky
--

ALTER TABLE `users`
	ADD PRIMARY KEY (`user_id`);
	
ALTER TABLE `projects`
	ADD PRIMARY KEY (`project_id`),
	ADD KEY `user_id` (`user_id`);
	
ALTER TABLE `functions`
	ADD PRIMARY KEY (`function_id`),
	ADD KEY `project_id` (`project_id`);
	
ALTER TABLE `links`
	ADD PRIMARY KEY (`link_id`),
	ADD KEY `project_id` (`project_id`),
	ADD KEY `function_id` (`function_id`);

--
-- AUTO_INCREMENT pre tabuľky
--

ALTER TABLE `users`
	MODIFY `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
	
ALTER TABLE `projects`
	MODIFY `project_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
	
ALTER TABLE `functions`
	MODIFY `function_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
  
ALTER TABLE `links`
	MODIFY `link_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;

--
-- Obmedzenia pre tabuľky
--

ALTER TABLE `projects`
	ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `functions`
	ADD CONSTRAINT `functions_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE;
	
ALTER TABLE `links`
	ADD CONSTRAINT `links_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE,
	ADD CONSTRAINT `links_ibfk_2` FOREIGN KEY (`function_id`) REFERENCES `functions` (`function_id`) ON DELETE CASCADE;
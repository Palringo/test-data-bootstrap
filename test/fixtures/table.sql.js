/**
 * Note: these tables will eventually become part of the switchboard database Docker image that will be built
 * from the contents of the database repository in Github.
 */

module.exports = {
    SB_ZONE: 'CREATE TABLE `sb_zone` (' +
        '   `id` bigint(20) unsigned NOT NULL,' +
        '   `name` char(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,' +
        '   `description` varchar(100) CHARACTER SET utf8 DEFAULT NULL,' +
        '   PRIMARY KEY (`id`),' +
        '   UNIQUE KEY `zone_name__uq` (`name`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=FIXED',

    SB_SUBSCRIBER: 'CREATE TABLE `sb_subscriber` (' +
        '   `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,' +
        '   `email` char(50) NOT NULL,' +
        '   `created` datetime NOT NULL,' +
        '   `password` char(20) NOT NULL,' +
        '   `last_received` bigint(20) NOT NULL,' +
        '   `data` mediumblob NOT NULL,' +
        '   `update_source` varchar(32) DEFAULT NULL,' +
        '   `last_online` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
        '   `deleted` tinyint(1) NOT NULL DEFAULT \'0\',' +
        '   `zone` bigint(20) unsigned NOT NULL DEFAULT \'0\',' +
        '   PRIMARY KEY (`id`),' +
        '   UNIQUE KEY `email_zone__uq` (`email`,`zone`),' +
        '   KEY `deleted_idx` (`deleted`),' +
        '   KEY `sub_zone__fk` (`zone`),' +
        '   CONSTRAINT `sub_zone__fk` FOREIGN KEY (`zone`) REFERENCES `sb_zone` (`id`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=FIXED',

    SB_SUBSCRIBER_PRIVILEGE: 'CREATE TABLE `sb_subscriber_privilege` (' +
        '   `subscriber` bigint(20) unsigned NOT NULL,' +
        '   `privilege` bigint(20) unsigned NOT NULL,' +
        '   KEY `sb_sub_priv__sub_idx` (`subscriber`),' +
        '   KEY `sb_sub_priv__priv_idx` (`privilege`),' +
        '   CONSTRAINT `sb_sub_priv__sub_fk` FOREIGN KEY (`subscriber`) REFERENCES `sb_subscriber` (`id`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',

    SB_SUBSCRIBER_REPUTATION: 'CREATE TABLE `sb_subscriber_reputation` (' +
        '  `subscriber_id` bigint(20) unsigned NOT NULL,' +
        '  `reputation` bigint(20) unsigned NOT NULL DEFAULT \'0\',' +
        '  `reputation_adjust` bigint(20) unsigned NOT NULL,' +
        '  `reputation_level_v2` float(7,4) DEFAULT NULL,' +
        '  `reputation_level` float(7,4) DEFAULT NULL,' +
        '  `group_words` int(11) DEFAULT NULL,' +
        '  `update_time` timestamp NULL DEFAULT NULL,' +
        '  `active_days` int(11) unsigned NOT NULL,' +
        '  PRIMARY KEY (`subscriber_id`),' +
        '  KEY `sb_subscriber_reputation_ibfi_2` (`reputation`),' +
        '  KEY `sb_rep_rep_new__idx` (`reputation_level_v2`),' +
        '  KEY `reputation_level` (`reputation_level`),' +
        '  KEY `idx_subscriber_reputation_updated` (`update_time`),' +
        '  CONSTRAINT `_sb_subscriber_reputation_ibfk_4` FOREIGN KEY (`subscriber_id`) REFERENCES `sb_subscriber` (`id`) ON DELETE CASCADE' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8',

    SB_GROUP: 'CREATE TABLE `sb_group` (' +
        ' `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,' +
        ' `owner` bigint(20) unsigned NOT NULL,' +
        ' `name` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,' +
        ' `pswd` char(20) CHARACTER SET utf8mb4 DEFAULT NULL,' +
        ' `adult` tinyint(3) unsigned NOT NULL DEFAULT \'0\',' +
        ' `weight` smallint(5) DEFAULT \'0\',' +
        ' `weight_update_time` datetime DEFAULT \'0000-00-00 00:00:00\',' +
        ' `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        ' `description` char(50) CHARACTER SET utf8mb4 DEFAULT NULL,' +
        ' `update_source` varchar(32) DEFAULT NULL,' +
        ' `change_subscriber` bigint(20) unsigned DEFAULT NULL,' +
        ' `zone` bigint(20) unsigned NOT NULL DEFAULT \'0\',' +
        ' PRIMARY KEY (`id`),' +
        ' UNIQUE KEY `grp_onr_name__uq2` (`owner`,`name`,`zone`),' +
        ' UNIQUE KEY `grp_name__uq` (`name`,`zone`),' +
        ' KEY `grp_zone__fk` (`zone`),' +
        ' KEY `sb_grp_wt_upd_t__idx` (`weight_update_time`),' +
        ' KEY `sb_grp_changesub__idx` (`change_subscriber`),' +
        ' KEY `sb_grp__wgt` (`weight`),' +
        ' CONSTRAINT `grp_onr__fk` FOREIGN KEY (`owner`) REFERENCES `sb_subscriber` (`id`),' +
        ' CONSTRAINT `grp_zone__fk` FOREIGN KEY (`zone`) REFERENCES `sb_zone` (`id`),' +
        ' CONSTRAINT `sb_grp_changesub__fk` FOREIGN KEY (`change_subscriber`) ' +
                    ' REFERENCES `sb_subscriber` (`id`) ON DELETE CASCADE' +
        ') ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=FIXED',

    SB_GROUP_UPDATE_HASH: 'CREATE TABLE `sb_group_update_hash` (' +
        ' `group_id` bigint(20) unsigned NOT NULL,' +
        ' `hash` varchar(8) NOT NULL,' +
        ' `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        ' PRIMARY KEY (`group_id`),' +
        ' CONSTRAINT `sb_group_update_hash__sub_fk` FOREIGN KEY (`group_id`)' +
        ' REFERENCES `sb_group` (`id`) ON DELETE CASCADE' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8',

    SB_GROUP_AUDIO_PROFILE: 'CREATE TABLE `group_audio_profile` (' +
        '  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,' +
        '  `group_id` BIGINT UNSIGNED NOT NULL,' +
        '  `enabled` BOOLEAN NOT NULL DEFAULT false,' +
        '  `min_rep_level` SMALLINT NOT NULL DEFAULT 0,' +
        '  PRIMARY KEY (`id`),' +
        '  UNIQUE KEY `group_audio_profile_group_id_uq1` (`group_id`),' +
        '  CONSTRAINT `group_audio_profile_group_id_fk` FOREIGN KEY (`group_id`) REFERENCES `sb_group` (`id`) ON DELETE CASCADE' +
        ') ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=FIXED',

    SB_GROUP_SUBSCRIBER: 'CREATE TABLE `sb_group_subscriber` (' +
        '  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,' +
        '  `gruop` bigint(20) unsigned NOT NULL COMMENT \'Intentionally mis-spelt because group is a keyword.\',' +
        '  `subscriber` bigint(20) unsigned NOT NULL,' +
        '  `capabilities` bigint(20) unsigned NOT NULL DEFAULT \'0\',' +
        '  `joined` datetime NOT NULL,' +
        '  `update_source` varchar(32) DEFAULT NULL,' +
        '  `change_subscriber` bigint(20) unsigned DEFAULT NULL,' +
        '  `caps_changed_by` bigint(20) unsigned DEFAULT NULL,' +
        '  `referred_by` bigint(20) unsigned DEFAULT NULL,' +
        '  PRIMARY KEY (`id`),' +
        '  UNIQUE KEY `grp_sub_grp_sub__uq` (`gruop`,`subscriber`),' +
        '  KEY `grp_sub_sub__idx` (`subscriber`),' +
        '  KEY `sb_grpsub_changesub__idx` (`change_subscriber`),' +
        '  KEY `sb_grp_sub_refed_by__fk` (`referred_by`),' +
        '  CONSTRAINT `sb_group_subscriber_ibfk_1` FOREIGN KEY (`referred_by`) REFERENCES `sb_subscriber` (`id`),' +
        '  CONSTRAINT `sb_group_subscriber_ibfk_2` FOREIGN KEY (`gruop`) REFERENCES `sb_group` (`id`) ON DELETE CASCADE' +
        ') ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPRESSED',

    SB_GROUP_BANNED_NAME: 'CREATE TABLE `sb_group_banned_name` (' +
        '  `id` int(10) NOT NULL AUTO_INCREMENT,' +
        '  `regex` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,' +
        '  `level` smallint(1) NOT NULL DEFAULT \'0\',' +
        '  PRIMARY KEY (`id`),' +
        'UNIQUE KEY `grb_banned_regex_uq` (`regex`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',

    SB_GROUP_REPUTATION: 'CREATE TABLE `sb_group_reputation` (' +
        '   `group_id` bigint(20) unsigned NOT NULL,' +
        '   `reputation` bigint(20) unsigned NOT NULL DEFAULT \'0\',' +
        '   `reputation_adjust` bigint(20) unsigned NOT NULL DEFAULT \'0\',' +
        '   `reputation_level` float(7,4) DEFAULT NULL,' +
        '   `reputation_level_v2` float(7,4) DEFAULT NULL,' +
        '   `total_stacked_credits` bigint(20) unsigned DEFAULT \'0\',' +
        '   `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
        '   PRIMARY KEY (`group_id`),' +
        '   KEY `reputation_level` (`reputation_level`),' +
        '   CONSTRAINT `sb_group_reputation_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `sb_group` (`id`) ON DELETE CASCADE' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',

    SB_GROUP_SINGLE_MEMBER: 'CREATE TABLE `sb_group_single_member` (' +
        '  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,' +
        '  `group_id` bigint(20) unsigned NOT NULL,' +
        '  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        '  PRIMARY KEY (`id`),' +
        '  UNIQUE KEY `group_id_2` (`group_id`),' +
        '  KEY `group_id` (`group_id`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',

    SB_GROUP_ATTRIBUTE: 'CREATE TABLE `sb_group_attribute` (' +
        '  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,' +
        '  `gruop` bigint(20) unsigned NOT NULL,' +
        '  `attribute_type` mediumint(8) unsigned NOT NULL,' +
        '  `data` varchar(1024) CHARACTER SET utf8mb4 NOT NULL,' +
        '  `update_source` varchar(50) COLLATE utf8_unicode_ci NOT NULL,' +
        '  `change_subscriber` bigint(20) unsigned DEFAULT NULL,' +
        '  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
        '  PRIMARY KEY (`id`),' +
        '  UNIQUE KEY `grp_Att_grp_at__uq` (`gruop`,`attribute_type`),' +
        '  KEY `sb_grpatt_changesub__idx` (`change_subscriber`),' +
        '  CONSTRAINT `grp_att_grp__fk` FOREIGN KEY (`gruop`) REFERENCES `sb_group` (`id`) ON DELETE CASCADE,' +
        '  CONSTRAINT `sb_grpattr_changesub__fk` FOREIGN KEY (`change_subscriber`) REFERENCES `sb_subscriber` (`id`) ON DELETE CASCADE' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',

    SB_AVATAR_CHANGE_GROUP: 'CREATE TABLE `sb_avatar_change_group` (' +
        '  `id` bigint(20) NOT NULL AUTO_INCREMENT,' +
        '  `group_id` bigint(20) unsigned NOT NULL,' +
        '  `timestamp` bigint(20) NOT NULL,' +
        '  PRIMARY KEY (`id`),' +
        '  UNIQUE KEY `group_id` (`group_id`),' +
        '  KEY `sb_group_group_id__fk` (`group_id`),' +
        '  KEY `timestamp_idx` (`timestamp`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',
};

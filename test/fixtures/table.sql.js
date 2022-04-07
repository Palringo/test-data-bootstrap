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
        ') ENGINE=InnoDB DEFAULT CHARSET=latin1',

    RO_REPLICA_STATUS: `
        CREATE TABLE mysql.ro_replica_status (
            Server_id varchar(100) NOT NULL,
            Session_id varchar(100) NOT NULL,
            Iops int(10) unsigned NOT NULL,
            Read_IOs bigint(20) unsigned NOT NULL,
            Pending_Read_IOs int(10) unsigned NOT NULL,
            Cpu float unsigned NOT NULL,
            Durable_lsn bigint(20) unsigned NOT NULL,
            Active_lsn bigint(20) unsigned NOT NULL,
            Last_transport_error int(11) NOT NULL,
            Last_error_timestamp datetime NOT NULL,
            Last_updated_timestamp datetime NOT NULL,
            Master_slave_latency_in_usec bigint(20) unsigned NOT NULL,
            Replica_lag_in_msec float unsigned NOT NULL,
            Log_stream_speed_in_KiB_per_second double unsigned NOT NULL,
            Log_buffer_sequence_number bigint(20) unsigned NOT NULL,
            Is_current tinyint(1) NOT NULL,
            Oldest_read_view_trx_id bigint(20) unsigned NOT NULL,
            Oldest_read_view_lsn bigint(20) unsigned NOT NULL,
            Highest_lsn_received bigint(20) unsigned NOT NULL,
            Current_read_lsn bigint(20) unsigned NOT NULL,
            Current_replay_latency_in_usec bigint(20) unsigned NOT NULL,
            Average_replay_latency_in_usec bigint(20) unsigned NOT NULL,
            Max_replay_latency_in_usec bigint(20) unsigned NOT NULL,
            PRIMARY KEY (Server_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0
    `,

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
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8',

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
        ') ENGINE=InnoDB DEFAULT CHARSET=latin1',

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
        ') ENGINE=InnoDB DEFAULT CHARSET=latin1',

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
        '  CONSTRAINT `sb_group_subscriber_ibfk_2` FOREIGN KEY (`gruop`) REFERENCES `sb_group` (`id`) ON DELETE CASCADE,' +
        '  CONSTRAINT `sb_group_subscriber_ibfk_3` FOREIGN KEY (`subscriber`) REFERENCES `sb_subscriber` (`id`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPRESSED',

    SB_SUB_FIRST_JOINED_GROUP: 'CREATE TABLE `sb_sub_first_joined_group` (' +
        '  `subscriber` bigint(20) unsigned NOT NULL,' +
        '  `gruop` bigint(20) unsigned NOT NULL,' +
        '  `joined` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
        '  PRIMARY KEY (`subscriber`),' +
        '  KEY `sfjg_grp` (`gruop`),' +
        '  CONSTRAINT `sfjg_grp` FOREIGN KEY (`gruop`) REFERENCES `sb_group` (`id`) ON DELETE CASCADE,' +
        '  CONSTRAINT `sfjg_sub` FOREIGN KEY (`subscriber`) REFERENCES `sb_subscriber` (`id`) ON DELETE CASCADE' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',

    SB_GROUP_HISTORY: 'CREATE TABLE `sb_group_history` (' +
        '  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,' +
        '  `group_id` bigint(20) unsigned NOT NULL,' +
        '  `type_id` int(4) unsigned DEFAULT NULL,' +
        '  `description` varchar(100) NOT NULL,' +
        '  `value` varchar(1050) DEFAULT NULL,' +
        '  `change_subscriber` bigint(20) unsigned DEFAULT NULL,' +
        '  `operation` varchar(6) DEFAULT NULL,' +
        '  `update_source` varchar(32) NOT NULL,' +
        '  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        '  `referred_by` bigint(20) unsigned DEFAULT NULL,' +
        '  PRIMARY KEY (`id`),' +
        '  KEY `sb_grp_hist__grp_i` (`group_id`),' +
        '  KEY `sb_grp_sub_refed_by__fk` (`referred_by`),' +
        '  CONSTRAINT `sb_group_history_ibfk_1` FOREIGN KEY (`referred_by`) REFERENCES `sb_subscriber` (`id`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8',

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

    SB_GROUP_PREMIUM_EXPIRY: 'CREATE TABLE `sb_group_premium_expiry` (' +
        '  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,' +
        '  `gruop` bigint(20) unsigned NOT NULL,' +
        '  `expire_time` datetime NOT NULL,' +
        '  `credit_purchase_id` bigint(20) unsigned DEFAULT NULL,' +
        '  `transaction_id` bigint(20) unsigned DEFAULT NULL,' +
        '  `auto_renew` tinyint(1) DEFAULT 0,' +
        '  `update_source` varchar(50) NOT NULL,' +
        '  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
        '  PRIMARY KEY (`id`),' +
        '  UNIQUE KEY `grp_exp_grp__uq` (`gruop`),' +
        '  KEY `sb_grp_prm_exp__cp_idx` (`credit_purchase_id`),' +
        '  KEY `sb_grp_prm_exp__tx_idx` (`transaction_id`),' +
        '  CONSTRAINT `sb_group_premium_expiry_ibfk_1` FOREIGN KEY (`gruop`) REFERENCES `sb_group` (`id`) ON DELETE CASCADE' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8',

    SB_BOTS_BOT_TYPE: 'CREATE TABLE `sb_bots`.`bot_type` (' +
        '  `bot_type_id` int(4) unsigned NOT NULL AUTO_INCREMENT,' +
        '  `name` varchar(100) NOT NULL,' +
        '  PRIMARY KEY (`bot_type_id`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8',

    SB_BOTS_BOT: 'CREATE TABLE `sb_bots`.`bot` (' +
        '  `bot_id` int(10) unsigned NOT NULL AUTO_INCREMENT,' +
        '  `bot_type_id` int(4) unsigned NOT NULL,' +
        '  `name` varchar(100) NOT NULL,' +
        '  `description` varchar(255) NOT NULL,' +
        '  `purchase_logic_bot_id` int(10) unsigned DEFAULT NULL,' +
        '  `manage_url` varchar(50) DEFAULT NULL,' +
        '  `is_removed` tinyint(1) unsigned DEFAULT NULL,' +
        '  `created_at` datetime NOT NULL,' +
        '  `updated_at` datetime NOT NULL,' +
        '  `display_name` varchar(100) NOT NULL DEFAULT "",' +
        '  `api_version` varchar(8) NOT NULL DEFAULT "",' +
        '  `gamepad_url` varchar(255) NOT NULL DEFAULT "",' +
        '  `gamepane_url` varchar(255) NOT NULL DEFAULT "",' +
        '  `icon_url` varchar(255) NOT NULL DEFAULT "",' +
        '  `assets_url` varchar(255) NOT NULL,' +
        '  `default_keyboard` tinyint(1) unsigned NOT NULL DEFAULT 1,' +
        '  `requires_pane` tinyint(1) unsigned NOT NULL DEFAULT 0,' +
        '  `keyboard_open` tinyint(1) unsigned NOT NULL DEFAULT 0,' +
        '  `client_type` varchar(255) NOT NULL DEFAULT "normal",' +
        '  `language` varchar(255) NOT NULL DEFAULT "en",' +
        '  `bot_command_prefix` varchar(100) NOT NULL DEFAULT "",' +
        '  `gamepad_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        '  PRIMARY KEY (`bot_id`),' +
        '  KEY `FK_bot_type_id` (`bot_type_id`),' +
        '  KEY `purchase_logic_bot_id` (`purchase_logic_bot_id`),' +
        '  CONSTRAINT `FK_bot_type_id` FOREIGN KEY (`bot_type_id`) REFERENCES `sb_bots`.`bot_type` (`bot_type_id`),' +
        '  CONSTRAINT `bot_ibfk_1` FOREIGN KEY (`purchase_logic_bot_id`) REFERENCES `sb_bots`.`bot` (`bot_id`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8',

    SB_BOTS_BOT_SUBSCRIBER: 'CREATE TABLE `sb_bots`.`bot_subscriber` (' +
        '  `bot_id` int(10) unsigned NOT NULL,' +
        '  `subscriber_id` bigint(20) unsigned NOT NULL,' +
        '  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        '  PRIMARY KEY (`bot_id`,`subscriber_id`),' +
        '  UNIQUE KEY `subscriber_id` (`subscriber_id`),' +
        '  CONSTRAINT `bot_subscriber_ibfk_1` FOREIGN KEY (`bot_id`) REFERENCES `sb_bots`.`bot` (`bot_id`) ON DELETE CASCADE' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',

    SB_GROUP_BOT_EXPIRY: 'CREATE TABLE `sb_group_bot_expiry` (' +
        ' `group_bot_expiry_id` int(10) unsigned NOT NULL AUTO_INCREMENT,' +
        ' `group_id` bigint(20) unsigned NOT NULL,' +
        ' `bot_id` int(10) unsigned NOT NULL,' +
        ' `expire_time` datetime DEFAULT NULL,' +
        ' `credit_purchase_id` bigint(20) unsigned DEFAULT NULL,' +
        ' `transaction_id` bigint(20) unsigned DEFAULT NULL,' +
        ' `auto_renew` tinyint(1) DEFAULT 1,' +
        ' `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
        ' PRIMARY KEY (`group_bot_expiry_id`),' +
        ' UNIQUE KEY `UNQ_gbe_group_bot` (`group_id`,`bot_id`),' +
        ' KEY `IDX_gbe_bot_id` (`bot_id`),' +
        ' KEY `idx_sb_grp_be_crd_phse` (`credit_purchase_id`),' +
        ' KEY `idx_sb_grp_be_txn` (`transaction_id`),' +
        ' CONSTRAINT `FK_gbe_group_id` FOREIGN KEY (`group_id`) REFERENCES `sb_group` (`id`) ON DELETE CASCADE' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',

    SB_SUB_LAST_RECEIVED: 'CREATE TABLE `sb_sub_last_received` (' +
        '`subscriber` bigint(20) unsigned NOT NULL DEFAULT 0,' +
        '`last_received` bigint(20) NOT NULL,' +
        '`update_source` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,' +
        'PRIMARY KEY (`subscriber`),' +
        'KEY `sb_sub_last_received_idx` (`last_received`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',

    SB_GROUP_OWNER_REALLOC: 'CREATE TABLE `sb_group_owner_realloc` (' +
        '`group_id` bigint(20) unsigned NOT NULL,' +
        '`is_premium` smallint(5) unsigned NOT NULL,' +
        '`date_owner_left` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
        'PRIMARY KEY (`group_id`),' +
        'KEY `date_owner_left` (`date_owner_left`,`is_premium`),' +
        'CONSTRAINT `sb_grp_realloc_grp_fk` FOREIGN KEY (`group_id`) REFERENCES `sb_group` (`id`) ON DELETE CASCADE' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',

    SB_SUBSCRIBER_NOTE: `CREATE TABLE \`sb_subscriber_note_${new Date().getFullYear()}\` (` +
        '`note_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,' +
        '`note_type_id` tinyint(1) unsigned NOT NULL,' +
        '`subscriber_id` bigint(20) unsigned NOT NULL,' +
        '`author_id` bigint(20) unsigned DEFAULT NULL,' +
        '`content` text NOT NULL,' +
        '`created_at` datetime NOT NULL,' +
        '`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        'PRIMARY KEY (`note_id`),' +
        'KEY `idx_subscriber_note_2021_subscriber_id` (`subscriber_id`),' +
        'KEY `idx_subscriber_note_2021_author` (`author_id`),' +
        'KEY `idx_subscriber_note_2021_type_id` (`note_type_id`)' +
        ') ENGINE=InnoDB AUTO_INCREMENT=42677 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPRESSED',

    GROUP_MESSAGE_CONFIG:
        'CREATE TABLE group_message_config (' +
        '    `group_id` bigint(20) unsigned NOT NULL,' +
        '    `disable_image` tinyint(1) DEFAULT NULL,' +
        '    `disable_image_filter` tinyint(1) DEFAULT NULL,' +
        '    `disable_voice` tinyint(1) DEFAULT NULL,' +
        '    `disable_group_link` tinyint(1) DEFAULT NULL,' +
        '    `disable_hyperlink` tinyint(1) DEFAULT NULL,' +
        '    `slow_mode_rate_in_seconds` int UNSIGNED DEFAULT NULL,' +
        '    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        '    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
        '    PRIMARY KEY (`group_id`),' +
        '    CONSTRAINT `sb_group_group_id_fk` FOREIGN KEY (`group_id`) REFERENCES `sb_group` (`id`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;',
        
        SB_SUBSCRIBER_EXTENDED: `CREATE TABLE \`subscriber_extended\` (
            \`subscriber_id\` BIGINT(20) UNSIGNED NOT NULL,
            \`name\` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            \`nickname\` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            \`status\` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            \`about\` VARCHAR(1792) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            \`gender\` TINYINT UNSIGNED COMMENT 'Single select, 0: unspecified, 1: male, 2: female',
            \`privileges\` BIGINT UNSIGNED COMMENT 'Multi select, currently 32 values available, See @palringo/constants.subscriberPrivilege',
            \`looking_for\` TINYINT UNSIGNED COMMENT 'Multi select, currently 4 values are available',
            \`relationship\` TINYINT UNSIGNED COMMENT 'Single select, currently 7 values',
            \`language\` SMALLINT UNSIGNED COMMENT 'Currently, number of languages is less than 100',
            \`icon\` INT UNSIGNED COMMENT 'An icon identifier for use in caching',
            \`date_of_birth\` DATETIME,
            \`urls\` JSON,
            PRIMARY KEY (\`subscriber_id\`),
            CONSTRAINT \`sb_subscriber_extended_subscriber_id_fk\` FOREIGN KEY (\`subscriber_id\`) REFERENCES \`sb_subscriber\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
};

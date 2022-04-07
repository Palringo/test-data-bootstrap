
module.exports = {
    dropGenerateGroupSubscribersProcedure: 'DROP procedure IF EXISTS `GenerateGroupSubscribers`;',
    callGenerateGroupSubscribersProcedure: 'CALL `switchboard`.`GenerateGroupSubscribers`( ?, ?, @groupId );',
    selectGroupId: 'SELECT @groupId as groupId;',
    createGenerateGroupSubscribersProcedure:
    '  CREATE DEFINER=`root`@`%` PROCEDURE `GenerateGroupSubscribers`(IN numRecords INT, IN groupName VARCHAR(255),OUT groupId INT)  ' +
    '  BEGIN   ' +
    '  DECLARE EXIT HANDLER FOR SQLEXCEPTION   ' +
    '  BEGIN  ' +
    '    ' +
    '  	rollback;  ' +
    '  END;  ' +
    '  START TRANSACTION;  ' +
    '  	SET @offset = (SELECT Auto_increment as seq   ' +
    '  	FROM information_schema.tables   ' +
    '  	WHERE table_name=\'sb_subscriber\');     ' +
    '      SET @owner = @offset;  ' +
    '        ' +
    '  	INSERT INTO `switchboard`.`sb_subscriber` (  ' +
    '  		`id`  ' +
    '  		,`email`  ' +
    '  		,`created`  ' +
    '  		,`password`  ' +
    '  		,`last_received`  ' +
    '  		,`data`  ' +
    '  		,`update_source`  ' +
    '  		,`last_online`  ' +
    '  		,`deleted`  ' +
    '  		,`zone`  ' +
    '  		)  ' +
    '  	VALUES (  ' +
    '  		@owner  ' +
    '  		,CONCAT(\'test-\',@offset,\'@email.com\')  ' +
    '  		,current_timestamp()  ' +
    '  		,\'\'  ' +
    '  		,0  ' +
    '  		,\'\'  ' +
    '  		,\'group_svc_int_test\'  ' +
    '  		,current_timestamp()  ' +
    '  		,0  ' +
    '  		,0);  ' +
    '            ' +
    '  	INSERT INTO `switchboard`.`sb_subscriber_privilege` (  ' +
    '  		`subscriber`  ' +
    '  		,`privilege`)  ' +
    '  	VALUES (  ' +
    '  		@owner  ' +
    '  		,1  ' +
    '  	);  ' +
    '        ' +
    '      INSERT INTO `switchboard`.`subscriber_extended` (  ' +
    '  	`subscriber_id`  ' +
    '  	,`nickname`  ' +
    '  	)  ' +
    '  	VALUES (  ' +
    '  	@owner  ' +
    '  	,concat(\'NickName-\',@owner)  ' +
    '  	);  ' +
    '            ' +
    '  	SET @offset = (SELECT Auto_increment as seq   ' +
    '  	FROM information_schema.tables   ' +
    '  	WHERE table_name=\'sb_subscriber\');   ' +
    '        ' +
    '      SET @subscriber = @offset;   ' +
    '      INSERT INTO `switchboard`.`sb_subscriber` (  ' +
    '  		`id`  ' +
    '  		,`email`  ' +
    '  		,`created`  ' +
    '  		,`password`  ' +
    '  		,`last_received`  ' +
    '  		,`data`  ' +
    '  		,`update_source`  ' +
    '  		,`last_online`  ' +
    '  		,`deleted`  ' +
    '  		,`zone`  ' +
    '  		)  ' +
    '  	VALUES (  ' +
    '  		@subscriber  ' +
    '  		,CONCAT(\'test-\',@offset,\'@email.com\')  ' +
    '  		,current_timestamp()  ' +
    '  		,\'\'  ' +
    '  		,0  ' +
    '  		,\'\'  ' +
    '  		,\'group_svc_int_test\'  ' +
    '  		,current_timestamp()  ' +
    '  		,0  ' +
    '  		,0);  ' +
    '            ' +
    '      SET @groupAdmin = 33554432;  ' +
    '      INSERT INTO `switchboard`.`sb_subscriber_privilege` (  ' +
    '  		`subscriber`  ' +
    '  		,`privilege`)  ' +
    '  	VALUES (  ' +
    '  		@subscriber  ' +
    '  		,@groupAdmin  ' +
    '  	);  ' +
    '  	INSERT INTO `switchboard`.`subscriber_extended` (  ' +
    '  	`subscriber_id`  ' +
    '  	,`nickname`  ' +
    '  	)  ' +
    '  	VALUES (  ' +
    '  	@subscriber  ' +
    '  	,concat(\'NickName-\',@subscriber)  ' +
    '  	);  ' +
    '      INSERT INTO `switchboard`.`sb_subscriber_reputation` (  ' +
    '  		`subscriber_id`   ' +
    '  		,`reputation_level` )  ' +
    '  	VALUES (  ' +
    '  		@subscriber  ' +
    '  		,50  ' +
    '  		);  ' +
    '  	SET @offset = (SELECT Auto_increment as seq   ' +
    '  	FROM information_schema.tables   ' +
    '  	WHERE table_name=\'sb_group\');   ' +
    '        ' +
    '      SET @group = @offset;  ' +
    '      SET groupId = @group;  ' +
    '  	INSERT INTO `switchboard`.`sb_group` (  ' +
    '  		 `id`  ' +
    '  		,`owner`  ' +
    '  		,`name`  ' +
    '  		,`pswd`  ' +
    '  		,`adult`  ' +
    '  		,`weight`  ' +
    '  		,`weight_update_time`  ' +
    '  		,`created`  ' +
    '  		,`description`  ' +
    '  		,`update_source`  ' +
    '  		,`change_subscriber`  ' +
    '  		,`zone`)  ' +
    '  	VALUES (  ' +
    '  		@group  ' +
    '  		,@owner  ' +
    '  		,COALESCE(groupName,CONCAT(\'new test group-\', @offset))  ' +
    '  		,\'password\'  ' +
    '  		,0  ' +
    '  		,0  ' +
    '  		,\'0000-00-00 00:00:00\'  ' +
    '  		,current_timestamp()  ' +
    '  		,CONCAT(\'Description-\', @offset)  ' +
    '  		,\'group_svc_int_test\'  ' +
    '  		,null  ' +
    '  		,0);  ' +
    '    ' +
    '  	INSERT INTO `switchboard`.`sb_group_attribute` (  ' +
    '  		 `gruop`  ' +
    '  		,`attribute_type`  ' +
    '  		,`data`  ' +
    '  		,`update_source`  ' +
    '  		,`change_subscriber`  ' +
    '  		,`update_time`  ' +
    '  		)  ' +
    '  	select @group,11,2 ,\'group_svc_int_test\',null,current_timestamp()  ' +
    '  	UNION ALL  ' +
    '  	select @group,8, 666 ,\'group_svc_int_test\',null,current_timestamp()  ' +
    '  	UNION ALL  ' +
    '  	select @group,36,1 ,\'group_svc_int_test\',null,current_timestamp()  ' +
    '  	UNION ALL  ' +
    '  	select @group,1, CONCAT(\'Description-\', @offset) ,\'group_svc_int_test\',null,current_timestamp()  ' +
    '  	UNION ALL  ' +
    '  	select @group,3, 1 ,\'group_svc_int_test\',null,current_timestamp()  ' +
    '  	UNION ALL  ' +
    '  	select @group,32,0 ,\'group_svc_int_test\',null,current_timestamp()  ' +
    '  	UNION ALL  ' +
    '  	select @group,28,1 ,\'group_svc_int_test\',null,current_timestamp()  ' +
    '  	UNION ALL  ' +
    '  	select @group,2, 0 ,\'group_svc_int_test\',null,current_timestamp()  ' +
    '  	UNION ALL  ' +
    '  	select @group,30, 1,\'group_svc_int_test\',null,current_timestamp()  ' +
    '  	UNION ALL  ' +
    '  	select @group,5, 55 ,\'group_svc_int_test\',null,current_timestamp()  ' +
    '  	UNION ALL  ' +
    '  	select @group,20,12 ,\'group_svc_int_test\',null,current_timestamp()  ' +
    '  	UNION ALL  ' +
    '  	select @group,25,1 ,\'group_svc_int_test\',null,current_timestamp()  ' +
    '  	UNION ALL  ' +
    '  	select @group,37,0 ,\'group_svc_int_test\',null,current_timestamp();  ' +
    '    ' +
    '  	SET @count = 0;  ' +
    '  	SET @offset = (SELECT Auto_increment as seq   ' +
    '  	FROM information_schema.tables   ' +
    '  	WHERE table_name=\'sb_subscriber\');   ' +
    '      startLoop:  ' +
    '      WHILE @count < numRecords DO  ' +
    '      INSERT INTO `switchboard`.`sb_subscriber` (  ' +
    '  		`id`  ' +
    '  		,`email`  ' +
    '  		,`created`  ' +
    '  		,`password`  ' +
    '  		,`last_received`  ' +
    '  		,`data`  ' +
    '  		,`update_source`  ' +
    '  		,`last_online`  ' +
    '  		,`deleted`  ' +
    '  		,`zone`  ' +
    '  		)  ' +
    '  	VALUES (  ' +
    '  		@offset  ' +
    '  		,CONCAT(\'test-\',@offset,\'@email.com\')  ' +
    '  		,current_timestamp()  ' +
    '  		,\'\'  ' +
    '  		,0  ' +
    '  		,\'\'  ' +
    '  		,\'group_svc_int_test\'  ' +
    '  		,current_timestamp()  ' +
    '  		,0  ' +
    '  		,0);  ' +
    '            ' +
    '          INSERT INTO `switchboard`.`sb_subscriber_privilege` (  ' +
    '  		`subscriber`  ' +
    '  		,`privilege`)  ' +
    '  		VALUES (  ' +
    '  			@offset  ' +
    '  			,1  ' +
    '  		);  ' +
    '            ' +
    '          INSERT INTO `switchboard`.`subscriber_extended` (  ' +
    '  		`subscriber_id`  ' +
    '  		,`nickname`  ' +
    '  		)  ' +
    '  		VALUES (  ' +
    '  		@offset  ' +
    '  		,concat(\'NickName-\',@offset)  ' +
    '  		);  ' +
    '            ' +
    '          INSERT INTO `switchboard`.`sb_group_subscriber` (  ' +
    '  			 `gruop`  ' +
    '  			,`subscriber`  ' +
    '  			,`capabilities`  ' +
    '  			,`joined`  ' +
    '  			,`update_source`  ' +
    '  			,`change_subscriber`  ' +
    '  			,`caps_changed_by`  ' +
    '  			,`referred_by`  ' +
    '  			)  ' +
    '  		VALUES (  ' +
    '  			 @group  ' +
    '  			,@offset  ' +
    '  			,0  ' +
    '  			,current_timestamp()  ' +
    '  			,\'group_svc_int_test\'  ' +
    '  			,DEFAULT  ' +
    '  			,DEFAULT  ' +
    '  			,DEFAULT  ' +
    '  			);  ' +
    '                ' +
    '  		INSERT INTO `switchboard`.`sb_sub_last_received` (  ' +
    '  			`subscriber`  ' +
    '  			,`last_received`  ' +
    '  			,`update_source`  ' +
    '  			)  ' +
    '  		VALUES (  ' +
    '  			 @offset  ' +
    '  			,DEFAULT  ' +
    '  			,\'group_svc_int_test\'  ' +
    '  			);  ' +
    '          SET @offset = @offset + 1;  ' +
    '          SET @count = @count + 1;  ' +
    '      END   ' +
    '      WHILE startLoop;  ' +
    '  COMMIT;  ' +
    '  Select @groupId; ' +
    '  END  ',
};

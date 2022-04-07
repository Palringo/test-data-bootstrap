/**
 * Note: this data will eventually become part of the switchboard database Docker image that will be built
 * from the contents of the database repository in Github.
 */

module.exports = {
    SB_GROUP_SUB_INSERT:
        `CREATE TRIGGER sb_group_sub_ins 
            AFTER INSERT ON sb_group_subscriber FOR EACH ROW
            BEGIN
                INSERT INTO sb_group_history (group_id,
                                              type_id,
                                              description,
                                              value,
                                              change_subscriber,
                                              operation,
                                              referred_by,
                                              update_source)
                VALUES (NEW.gruop,
                        4,
                        NEW.capabilities,
                        NEW.subscriber,
                        NEW.change_subscriber,
                        'INSERT',
                        NEW.referred_by,
                        NEW.update_source);
                
                IF NEW.subscriber > 35004320 THEN
                  INSERT IGNORE INTO sb_sub_first_joined_group(subscriber, gruop)
                  VALUES(NEW.subscriber, NEW.gruop);
                END IF;
            END`,

    SB_GROUP_SUB_UPDATE:
        `CREATE TRIGGER sb_group_sub_upd 
            AFTER UPDATE ON sb_group_subscriber FOR EACH ROW
            BEGIN
                IF (NEW.capabilities <> OLD.capabilities) THEN
                    INSERT INTO sb_group_history (group_id, type_id, description, value, change_subscriber, operation, referred_by, update_source)
                    VALUES (OLD.gruop,
                            3,
                            NEW.capabilities,
                            NEW.subscriber,
                            NEW.change_subscriber,
                            'UPDATE',
                            NEW.referred_by,
                            NEW.update_source);
                END IF;
            END`,

    SB_GROUP_SUB_DELETE:
        `CREATE TRIGGER sb_group_sub_del 
            AFTER DELETE ON sb_group_subscriber FOR EACH ROW
            BEGIN
                INSERT INTO sb_group_history (group_id, type_id, description, value, change_subscriber, operation, update_source)
                VALUES (OLD.gruop,
                        4,
                        OLD.capabilities,
                        OLD.subscriber,
                        OLD.change_subscriber,
                        'DELETE',
                        OLD.update_source);
            END`,
};

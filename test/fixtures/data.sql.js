/**
 * Note: this data will eventually become part of the switchboard database Docker image that will be built
 * from the contents of the database repository in Github.
 */

module.exports = {
    SB_ZONE_DATA:
        'INSERT INTO sb_zone (id, name, description) VALUES (0, "", "default")',

    SB_BOT_TYPE_DATA:
        'INSERT INTO `sb_bots`.`bot_type` (bot_type_id, name) VALUES (1, "Dev"), (2, "General"), (3, "Pay by message")',
};

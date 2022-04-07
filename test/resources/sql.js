
module.exports = {
    countSubscribersByGroup: 'SELECT COUNT(1) as count FROM `switchboard`.`sb_group_subscriber` WHERE `gruop` = ?',
};

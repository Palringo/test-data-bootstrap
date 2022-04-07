/* eslint-disable quotes */

/**
 * Note: these tables will eventually become part of the switchboard database Docker image that will be built
 * from the contents of the database repository in Github.
 */

module.exports = {
    GROUP_SERVICE: "CREATE USER 'group_service'@'%' IDENTIFIED BY 'group_service_pw';",
    GROUP_SERVICE_GRANT1: "GRANT SELECT, INSERT, UPDATE, DELETE ON `switchboard`.* TO 'group_service'@'%';",
    GROUP_SERVICE_GRANT2: "GRANT EXECUTE ON FUNCTION `switchboard`.`blob_extract`  TO 'group_service'@'%';",
    GROUP_SERVICE_GRANT3: "GRANT SELECT ON `sb_bots`.`bot_subscriber`              TO 'group_service'@'%';",
    GROUP_SERVICE_GANRT4: "GRANT SELECT ON `mysql`.`ro_replica_status`             TO 'group_service'@'%';",
};

/**
 * Note: this data will eventually become part of the switchboard database Docker image that will be built
 * from the contents of the database repository in Github.
 */

module.exports = {
    SB_ZONE_DATA:
        'INSERT INTO sb_zone (id, name, description) VALUES (0, "", "default")',
};

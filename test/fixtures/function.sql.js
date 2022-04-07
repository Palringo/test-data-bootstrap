/**
 * Note: these tables will eventually become part of the switchboard database Docker image that will be built
 * from the contents of the database repository in Github.
 */

module.exports = {
    BLOB_EXTRACT: 'CREATE DEFINER=`root`@`%` FUNCTION `blob_extract`(' +
        '  _blob MEDIUMBLOB,' +
        '  _key TEXT) RETURNS blob' +
        '  DETERMINISTIC' +
        ' BEGIN' +
        '' +
        '  DECLARE pos INT DEFAULT 1;' +
        '  DECLARE pos_zero INT DEFAULT 1;' +
        '' +
        '  DECLARE this_key TEXT;' +
        '  DECLARE concat_key TEXT DEFAULT NULL;' +
        '  DECLARE this_value MEDIUMBLOB;' +
        '  DECLARE this_len INT;' +
        '' +
        '  key_iterator: WHILE pos < LENGTH(_blob) DO' +
        '  SET pos_zero = LOCATE(CHAR(0), _blob, pos);' +
        '  SET this_key = SUBSTR(_blob, pos, pos_zero - pos);' +
        '  SET this_len = ORD(SUBSTR(_blob, pos_zero + 1, 1)) * 256 + ORD(SUBSTR(_blob, pos_zero + 2, 1));' +
        '  SET pos = pos_zero + 1 + 2 + this_len;' +
        '' +
        '  IF concat_key IS NOT NULL THEN' +
        '' +
        '    IF this_key = concat_key THEN' +
        '' +
        '      SET this_value = CONCAT(this_value, SUBSTR(_blob, pos_zero + 3, this_len));' +
        '    ELSE' +
        '' +
        '      IF concat_key = _key THEN' +
        '        RETURN this_value;' +
        '      END IF;' +
        '' +
        '      SET this_value = SUBSTR(_blob, pos_zero + 3, this_len);' +
        '    END IF;' +
        '  ELSE' +
        '    SET this_value = SUBSTR(_blob, pos_zero + 3, this_len);' +
        '  END IF;' +
        '' +
        '  IF this_len = 65535 THEN' +
        '' +
        '    SET concat_key = this_key;' +
        '    ITERATE key_iterator;' +
        '  ELSE' +
        '    SET concat_key = NULL;' +
        '  END IF;' +
        '' +
        '  IF this_key = _key THEN' +
        '    RETURN this_value;' +
        '  END IF;' +
        '  END WHILE;' +
        '' +
        '  RETURN NULL;' +
        '' +
        ' END',

    };

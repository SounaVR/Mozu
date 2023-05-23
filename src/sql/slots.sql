CREATE TABLE IF NOT EXISTS slots (
    uuid bigint PRIMARY KEY AUTO_INCREMENT,
	userid bigint,

    head smallint,
    shoulders smallint,
    chest smallint,
    wrists smallint,
    hands smallint,
    waist smallint,
    legs smallint,
    feet smallint
) 
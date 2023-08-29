CREATE TABLE IF NOT EXISTS idle (
    uuid bigint PRIMARY KEY AUTO_INCREMENT,
	userid bigint,

    factory bigint,
    husbandry bigint,
    builder bigint
) 
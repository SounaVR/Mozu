CREATE TABLE IF NOT EXISTS data (
    uuid bigint PRIMARY KEY AUTO_INCREMENT,
	username text,
	userid bigint,

	lang text,
	ban bigint,
	badges longtext,

	money bigint,
	manaCooldown bigint,
	hpCooldown bigint,
	energyCooldown bigint,
	lastActivity bigint,

	HP bigint,
	MANA bigint,
	ATK bigint,
	DEF bigint,
	power bigint,

	lastHR bigint,
	lastDaily bigint,
	lastRep bigint
) 
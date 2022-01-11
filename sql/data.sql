CREATE TABLE IF NOT EXISTS data (
    uuid bigint,
	username text,
	userid bigint,

	lang text,
	ban bigint,

	money bigint,
	manaCooldown bigint,
	energyCooldown bigint,
	lastActivity bigint,

	MANA bigint,
	power bigint,

	HR bigint,
	lastHR bigint,
	daily bigint,
	lastDaily bigint,
	rep bigint,
	lastRep bigint
)
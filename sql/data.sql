CREATE TABLE IF NOT EXISTS data (
    uuid bigint,
	username text,
	userid bigint,

	lang text,
	ban bigint,

	money bigint,
	lastActivity bigint,

	PV bigint,
	MANA bigint,
	ATK bigint,
	DEF bigint,

	HR bigint,
	lastHR bigint,
	daily bigint,
	lastDaily bigint,
	rep bigint,
	lastRep bigint
)
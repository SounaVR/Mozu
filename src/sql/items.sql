CREATE TABLE IF NOT EXISTS items (
    uuid bigint PRIMARY KEY,
	userid bigint,

    ring bigint,
    dungeon_amulet bigint,

	pickaxe bigint,
	sword bigint,
	shield bigint,
	head bigint,
	shoulders bigint,
	chest bigint,
	wrists bigint,
	hands bigint,
	waist bigint,
	legs bigint,
	feet bigint
) 
CREATE TABLE IF NOT EXISTS ress (
    uuid bigint PRIMARY KEY AUTO_INCREMENT,
	userid bigint,

    energy bigint,
    zone bigint,
    torch bigint,

    stone bigint,
	coal bigint,
	copper bigint,
	iron bigint,
	gold bigint,
	malachite bigint,

	chest_d bigint,
	chest_c bigint,
	chest_b bigint,
	chest_a bigint,
	chest_s bigint,

    rune_pickaxe bigint,
    rune_sword bigint,
    rune_shield bigint,
    rune_head bigint,
    rune_shoulders bigint,
    rune_chest bigint,
    rune_wrists bigint,
    rune_hands bigint,
    rune_waist bigint,
    rune_legs bigint,
    rune_feet bigint
) 